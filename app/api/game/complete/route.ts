import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { deviceId, level, score, passed, answers } = await request.json()

    if (!deviceId || !level || score === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient()

    // Get user by device ID
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("device_id", deviceId).single()

    if (userError) {
      console.error("Error fetching user:", userError)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get level info
    const { data: levelInfo, error: levelError } = await supabase
      .from("levels")
      .select("*")
      .eq("level_number", level)
      .single()

    if (levelError) {
      console.error("Error fetching level:", levelError)
      return NextResponse.json({ error: "Level not found" }, { status: 404 })
    }

    // Check existing progress
    const { data: existingProgress, error: progressError } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("level_id", levelInfo.id)
      .single()

    if (progressError && progressError.code !== "PGRST116") {
      console.error("Error checking progress:", progressError)
      return NextResponse.json({ error: "Failed to check progress" }, { status: 500 })
    }

    // Update or create progress
    if (existingProgress) {
      // Update existing progress
      const { error: updateError } = await supabase
        .from("user_progress")
        .update({
          highest_score: Math.max(existingProgress.highest_score, score),
          attempts: existingProgress.attempts + 1,
          completed: passed || existingProgress.completed,
          completed_at: passed ? new Date().toISOString() : existingProgress.completed_at,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingProgress.id)

      if (updateError) {
        console.error("Error updating progress:", updateError)
        return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
      }
    } else {
      // Create new progress
      const { error: createError } = await supabase.from("user_progress").insert({
        user_id: user.id,
        level_id: levelInfo.id,
        highest_score: score,
        attempts: 1,
        completed: passed,
        completed_at: passed ? new Date().toISOString() : null,
      })

      if (createError) {
        console.error("Error creating progress:", createError)
        return NextResponse.json({ error: "Failed to create progress" }, { status: 500 })
      }
    }

    // Create game session record
    const { error: sessionError } = await supabase.from("game_sessions").insert({
      user_id: user.id,
      level_id: levelInfo.id,
      score,
      total_questions: answers?.length || 0,
      correct_answers: Math.floor(score / 10),
      completed: true,
      completed_at: new Date().toISOString(),
    })

    if (sessionError) {
      console.error("Error creating session:", sessionError)
    }

    // Update leaderboard
    const { data: leaderboard, error: leaderboardError } = await supabase
      .from("leaderboard")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (leaderboardError && leaderboardError.code !== "PGRST116") {
      console.error("Error fetching leaderboard:", leaderboardError)
    } else {
      // Get completed levels count
      const { data: completedLevels, error: completedError } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("completed", true)

      const levelsCount = completedLevels?.length || 0

      if (leaderboard) {
        // Update existing leaderboard entry
        const newTotalScore = leaderboard.total_score + score
        const newAverageScore = levelsCount > 0 ? newTotalScore / levelsCount : 0

        await supabase
          .from("leaderboard")
          .update({
            total_score: newTotalScore,
            levels_completed: levelsCount,
            average_score: newAverageScore,
            last_played: new Date().toISOString(),
          })
          .eq("user_id", user.id)
      } else {
        // Create new leaderboard entry
        await supabase.from("leaderboard").insert({
          user_id: user.id,
          total_score: score,
          levels_completed: passed ? 1 : 0,
          average_score: score,
          last_played: new Date().toISOString(),
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Game completed successfully",
      score,
      passed,
      level,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
