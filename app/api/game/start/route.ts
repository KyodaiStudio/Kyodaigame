import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, levelId } = body

    if (!userId || !levelId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient()

    // Ambil soal untuk level ini
    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("*")
      .eq("level_id", levelId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (questionsError) {
      console.error("Error fetching questions:", questionsError)
      return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
    }

    // Ambil info level
    const { data: level, error: levelError } = await supabase.from("levels").select("*").eq("id", levelId).single()

    if (levelError) {
      console.error("Error fetching level:", levelError)
      return NextResponse.json({ error: "Failed to fetch level" }, { status: 500 })
    }

    // Shuffle questions dan ambil sesuai kebutuhan
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5)
    const selectedQuestions = shuffledQuestions.slice(0, level.required_questions)

    // Buat sesi game baru
    const { data: session, error: sessionError } = await supabase
      .from("game_sessions")
      .insert({
        user_id: userId,
        level_id: levelId,
        total_questions: selectedQuestions.length,
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (sessionError) {
      console.error("Error creating session:", sessionError)
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }

    // Transform questions untuk frontend (tanpa jawaban benar)
    const gameQuestions = selectedQuestions.map((q) => ({
      id: q.id,
      question: q.question,
      options: [q.option_a, q.option_b, q.option_c, q.option_d],
    }))

    return NextResponse.json({
      sessionId: session.id,
      questions: gameQuestions,
      level: level,
      timeLimit: level.time_limit,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
