import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { question, options, correct_answer, level, explanation } = body
    const { id } = params

    if (!question || !options || options.length !== 4 || correct_answer === undefined || !level) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("questions")
      .update({
        question,
        option_a: options[0],
        option_b: options[1],
        option_c: options[2],
        option_d: options[3],
        correct_answer,
        level_id: level,
        explanation: explanation || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Update error:", error)
      return NextResponse.json({ error: "Gagal mengupdate soal", details: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Soal berhasil diupdate",
      data,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const supabase = createClient()

    const { error } = await supabase.from("questions").delete().eq("id", id)

    if (error) {
      console.error("Delete error:", error)
      return NextResponse.json({ error: "Gagal menghapus soal", details: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Soal berhasil dihapus",
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server", details: error.message }, { status: 500 })
  }
}
