import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createClient()

    const { data: questions, error } = await supabase
      .from("questions")
      .select("*")
      .eq("is_active", true)
      .order("level_id", { ascending: true })
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Gagal mengambil data soal", details: error.message }, { status: 500 })
    }

    // Transform data to match frontend format
    const transformedQuestions =
      questions?.map((q) => ({
        id: q.id,
        question: q.question,
        options: [q.option_a, q.option_b, q.option_c, q.option_d],
        correct_answer: q.correct_answer,
        level: q.level_id,
        explanation: q.explanation,
        created_at: q.created_at,
      })) || []

    return NextResponse.json({
      success: true,
      questions: transformedQuestions,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, options, correct_answer, level, explanation } = body

    if (!question || !options || options.length !== 4 || correct_answer === undefined || !level) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("questions")
      .insert([
        {
          question,
          option_a: options[0],
          option_b: options[1],
          option_c: options[2],
          option_d: options[3],
          correct_answer,
          level_id: level,
          explanation: explanation || null,
          is_active: true,
        },
      ])
      .select()

    if (error) {
      console.error("Insert error:", error)
      return NextResponse.json({ error: "Gagal menyimpan soal", details: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Soal berhasil ditambahkan",
      data,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server", details: error.message }, { status: 500 })
  }
}
