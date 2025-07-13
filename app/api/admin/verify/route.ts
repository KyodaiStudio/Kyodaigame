import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    // Simple token validation - check if it starts with admin_
    if (token && token.startsWith("admin_")) {
      return NextResponse.json({
        success: true,
        valid: true,
        user: {
          username: "admin",
          role: "admin",
        },
      })
    } else {
      return NextResponse.json({ error: "Token tidak valid" }, { status: 401 })
    }
  } catch (error) {
    console.error("Verify error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
