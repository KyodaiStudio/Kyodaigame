import { type NextRequest, NextResponse } from "next/server"

// Kredensial admin sederhana
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    console.log("Login attempt:", { username, password })

    if (!username || !password) {
      return NextResponse.json({ error: "Username dan password harus diisi" }, { status: 400 })
    }

    // Verifikasi kredensial
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Generate simple token
      const token = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      return NextResponse.json({
        success: true,
        token,
        message: "Login berhasil",
        user: {
          username: "admin",
          role: "admin",
        },
      })
    } else {
      return NextResponse.json({ error: "Username atau password salah" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
