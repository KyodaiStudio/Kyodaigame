"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Lock, User, AlertTriangle, Eye, EyeOff } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/admin")
      } else {
        setError(data.error || "Login gagal")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Terjadi kesalahan saat login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-4 sm:pb-6">
            <div className="mx-auto mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-white mb-2">Admin Login</CardTitle>
            <CardDescription className="text-purple-200 text-base sm:text-lg">
              Masuk ke panel administrasi Game Kuis Indonesia
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6">
            {error && (
              <Alert className="bg-red-500/20 border-red-300/30 text-red-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm sm:text-base">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white text-sm sm:text-base flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="bg-white/10 border-white/30 text-white placeholder-purple-300 text-sm sm:text-base h-12"
                  placeholder="Masukkan username admin"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white text-sm sm:text-base flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-white/10 border-white/30 text-white placeholder-purple-300 text-sm sm:text-base h-12 pr-12"
                    placeholder="Masukkan password admin"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 text-purple-300 hover:text-white hover:bg-white/10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg h-12 text-base sm:text-lg font-medium"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Memproses...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Masuk ke Admin Panel</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center pt-4 sm:pt-6 border-t border-white/20">
              <p className="text-purple-300 text-xs sm:text-sm">
                Hanya administrator yang memiliki akses ke halaman ini
              </p>
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-500/10 border border-blue-300/30 rounded-lg">
                <p className="text-blue-200 text-xs sm:text-sm">
                  <strong>Default Login:</strong>
                  <br />
                  Username: admin
                  <br />
                  Password: admin123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
