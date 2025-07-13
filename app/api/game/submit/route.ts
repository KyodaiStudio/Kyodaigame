import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, answers, timeTaken } = body

    if (!sessionId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient()

    // Ambil data sesi
    const { data: session, error: sessionError } = await supabase
      .from("game_sessions")
      .select(`
        *,
        levels (*)
      `)
      .eq("id", sessionId)
      .single()

    if (sessionError) {
      console.error("Error fetching session:", sessionError)
      return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 })
    }

    let correctAnswers = 0
    const answerResults = []

    // Proses setiap jawaban
    for (const answer of answers) {
      const { questionId, selectedAnswer, timeForQuestion } = answer

      // Ambil jawaban yang benar
      const { data: question, error: questionError } = await supabase
        .from("questions")
        .select("correct_answer, explanation")
        .eq("id", questionId)
        .single()

      if (questionError) {
        console.error("Error fetching question:", questionError)
        continue
      }

      const isCorrect = selectedAnswer === question.correct_answer
      if (isCorrect) correctAnswers++

      // Simpan jawaban
      await supabase.from("session_answers").insert({
        session_id: sessionId,
        question_id: questionId,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
        time_taken: timeForQuestion,
      })

      answerResults.push({
        questionId,
        isCorrect,
        correctAnswer: question.correct_answer,
        explanation: question.explanation,
      })
    }

    // Hitung skor
    const score = Math.round((correctAnswers / session.total_questions) * 100)
    const passed = score >= session.levels.passing_score

    // Update sesi
    await supabase
      .from("game_sessions")
      .update({
        score,
        correct_answers: correctAnswers,
        time_taken: timeTaken,
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq("id", sessionId)

    // Update progress user jika lulus
    if (passed) {
      const { data: existingProgress } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", session.user_id)
        .eq("level_id", session.level_id)
        .single()

      if (existingProgress) {
        // Update progress yang ada
        await supabase
          .from("user_progress")
          .update({
            highest_score: Math.max(existingProgress.highest_score, score),
            attempts: existingProgress.attempts + 1,
            completed: true,
            completed_at: new Date().toISOString(),
          })
          .eq("id", existingProgress.id)
      } else {
        // Buat progress baru
        await supabase.from("user_progress").insert({
          user_id: session.user_id,
          level_id: session.level_id,
          highest_score: score,
          attempts: 1,
          completed: true,
          completed_at: new Date().toISOString(),
        })
      }

      // Update leaderboard
      const { data: leaderboard } = await supabase
        .from("leaderboard")
        .select("*")
        .eq("user_id", session.user_id)
        .single()

      if (leaderboard) {
        const newTotalScore = leaderboard.total_score + score
        const newLevelsCompleted = leaderboard.levels_completed + (passed ? 1 : 0)
        const newAverageScore = newTotalScore / newLevelsCompleted

        await supabase
          .from("leaderboard")
          .update({
            total_score: newTotalScore,
            levels_completed: newLevelsCompleted,
            average_score: newAverageScore,
            last_played: new Date().toISOString(),
          })
          .eq("user_id", session.user_id)
      } else {
        await supabase.from("leaderboard").insert({
          user_id: session.user_id,
          total_score: score,
          levels_completed: passed ? 1 : 0,
          average_score: score,
          last_played: new Date().toISOString(),
        })
      }
    }

    return NextResponse.json({
      score,
      correctAnswers,
      totalQuestions: session.total_questions,
      passed,
      passingScore: session.levels.passing_score,
      answers: answerResults,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
