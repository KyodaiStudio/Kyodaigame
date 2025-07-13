import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { deviceId: string } }) {
  try {
    const { deviceId } = params

    if (!deviceId) {
      return NextResponse.json({ error: "Device ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Coba cek apakah kolom device_id ada dengan query sederhana
    try {
      const { data: testQuery, error: testError } = await supabase.from("users").select("device_id").limit(1)

      if (testError && testError.message.includes("device_id")) {
        console.error("Column device_id does not exist:", testError)
        return NextResponse.json(
          {
            error: "Database schema not updated. Please run the database migration script.",
            details: "Column device_id does not exist in users table",
          },
          { status: 500 },
        )
      }
    } catch (schemaError) {
      console.error("Schema check error:", schemaError)
      return NextResponse.json(
        {
          error: "Database schema error",
          details: "Please ensure the database migration has been run",
        },
        { status: 500 },
      )
    }

    // Cek apakah user sudah ada berdasarkan device_id
    let { data: user, error: userError } = await supabase.from("users").select("*").eq("device_id", deviceId).single()

    if (userError && userError.code !== "PGRST116") {
      console.error("Error fetching user:", userError)
      return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
    }

    // Jika user belum ada, buat user baru
    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          device_id: deviceId,
          username: `Player_${deviceId.slice(0, 8)}`,
          email: null,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (createError) {
        console.error("Error creating user:", createError)
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
      }

      user = newUser
    }

    // Ambil semua level untuk referensi
    const { data: levels, error: levelsError } = await supabase
      .from("levels")
      .select("*")
      .order("level_number", { ascending: true })

    if (levelsError) {
      console.error("Error fetching levels:", levelsError)
      return NextResponse.json({ error: "Failed to fetch levels" }, { status: 500 })
    }

    // Ambil progress user
    const { data: progressData, error: progressError } = await supabase
      .from("user_progress")
      .select(`
        *,
        levels (
          id,
          level_number,
          name,
          difficulty
        )
      `)
      .eq("user_id", user.id)
      .order("level_id", { ascending: true })

    if (progressError) {
      console.error("Error fetching progress:", progressError)
      return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 })
    }

    // Buat progress array untuk 12 level
    const allProgress = Array.from({ length: 12 }, (_, i) => {
      const levelNumber = i + 1
      const levelInfo = levels?.find((l) => l.level_number === levelNumber)
      const existingProgress = progressData?.find((p) => p.levels?.level_number === levelNumber)

      // Tentukan apakah level terbuka
      let unlocked = false
      if (levelNumber === 1) {
        unlocked = true // Level 1 selalu terbuka
      } else {
        // Level terbuka jika level sebelumnya sudah selesai
        const previousProgress = progressData?.find((p) => p.levels?.level_number === levelNumber - 1)
        unlocked = previousProgress?.completed || false
      }

      return {
        level: levelNumber,
        score: existingProgress?.highest_score || 0,
        completed: existingProgress?.completed || false,
        unlocked,
        levelId: levelInfo?.id || levelNumber,
      }
    })

    // Hitung total score
    const totalScore = allProgress.reduce((sum, p) => sum + p.score, 0)

    return NextResponse.json({
      progress: allProgress,
      totalScore,
      userId: user.id,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
