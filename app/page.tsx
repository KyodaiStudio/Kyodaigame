"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trophy, Play, BookOpen, Star, Zap, Target, Award, Crown, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface UserProgress {
  level: number
  score: number
  completed: boolean
  unlocked: boolean
}

export default function HomePage() {
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [totalScore, setTotalScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [deviceId, setDeviceId] = useState<string>("")

  useEffect(() => {
    initializeDevice()
  }, [])

  const initializeDevice = async () => {
    try {
      // Generate unique device ID berdasarkan browser fingerprint
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      ctx!.textBaseline = "top"
      ctx!.font = "14px Arial"
      ctx!.fillText("Device fingerprint", 2, 2)

      const fingerprint =
        canvas.toDataURL() +
        navigator.userAgent +
        navigator.language +
        screen.width +
        screen.height +
        new Date().getTimezoneOffset()

      const deviceId = btoa(fingerprint).slice(0, 32)
      setDeviceId(deviceId)

      await loadUserProgress(deviceId)
    } catch (error) {
      console.error("Error initializing device:", error)
      // Fallback ke localStorage jika ada masalah
      const fallbackId = localStorage.getItem("deviceId") || Math.random().toString(36).substr(2, 16)
      localStorage.setItem("deviceId", fallbackId)
      setDeviceId(fallbackId)
      await loadUserProgress(fallbackId)
    }
  }

  const loadUserProgress = async (deviceId: string) => {
    try {
      const response = await fetch(`/api/progress/${deviceId}`)
      const data = await response.json()

      if (response.ok) {
        setUserProgress(data.progress)
        setTotalScore(data.totalScore)
        setError("")
      } else {
        console.error("Failed to load progress:", data)
        setError(data.error || "Gagal memuat progress")

        // Jika ada masalah database, buat progress fallback
        const initialProgress: UserProgress[] = Array.from({ length: 12 }, (_, i) => ({
          level: i + 1,
          score: 0,
          completed: false,
          unlocked: i === 0, // Hanya level 1 yang terbuka
        }))
        setUserProgress(initialProgress)
        setTotalScore(0)
      }
    } catch (error) {
      console.error("Error loading progress:", error)
      setError("Terjadi kesalahan saat memuat data")

      // Fallback ke progress awal
      const initialProgress: UserProgress[] = Array.from({ length: 12 }, (_, i) => ({
        level: i + 1,
        score: 0,
        completed: false,
        unlocked: i === 0,
      }))
      setUserProgress(initialProgress)
      setTotalScore(0)
    } finally {
      setLoading(false)
    }
  }

  const getNextLevel = () => {
    const nextIncomplete = userProgress.find((p) => p.unlocked && !p.completed)
    return nextIncomplete ? nextIncomplete.level : 1
  }

  const completedLevels = userProgress.filter((p) => p.completed).length
  const progressPercentage = (completedLevels / 12) * 100

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center max-w-sm w-full">
          <div className="relative mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div
              className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-transparent border-t-pink-500 rounded-full animate-spin mx-auto"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            ></div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
            <h3 className="text-white text-lg sm:text-xl font-bold mb-2">Memuat Game Kuis Indonesia</h3>
            <p className="text-purple-200 text-sm sm:text-base">Menyiapkan petualangan pengetahuanmu...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <div className="relative flex-shrink-0">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg">
                  <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent truncate">
                  Game Kuis Indonesia
                </h1>
                <p className="text-purple-200 text-xs sm:text-sm truncate">🇮🇩 Asah Pengetahuanmu!</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  <span className="text-white font-bold text-sm sm:text-base">{totalScore}</span>
                  <span className="text-yellow-100 text-xs sm:text-sm hidden sm:inline">Poin</span>
                </div>
              </div>
              <Link href="/leaderboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-4"
                >
                  <Crown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Papan Skor</span>
                  <span className="sm:hidden">Skor</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 sm:mb-8 bg-red-500/20 border-red-300/30 text-red-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm sm:text-base">
              <strong>Peringatan:</strong> {error}
              <br />
              <span className="text-xs sm:text-sm mt-2 block">
                Aplikasi berjalan dalam mode offline. Beberapa fitur mungkin tidak tersedia.
              </span>
            </AlertDescription>
          </Alert>
        )}

        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-300/30 rounded-full px-3 sm:px-6 py-1 sm:py-2 mb-4 sm:mb-6">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mr-1 sm:mr-2" />
            <span className="text-purple-200 text-xs sm:text-sm font-medium">Petualangan Pengetahuan Dimulai!</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 px-2">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent block">
              Selamat Datang di
            </span>
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent block mt-1 sm:mt-2">
              Game Kuis Indonesia! 🎯
            </span>
          </h2>

          <p className="text-base sm:text-xl text-purple-200 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
            Uji pengetahuanmu melalui <span className="text-yellow-400 font-semibold">12 level menantang</span> tentang
            Indonesia. Mulai dari level mudah hingga sangat sulit. Raih poin tertinggi dan jadilah{" "}
            <span className="text-pink-400 font-semibold">Grandmaster</span>!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Link href={`/game/${getNextLevel()}`} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
              >
                <Play className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                <span className="truncate">Mulai Petualangan - Level {getNextLevel()}</span>
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 sm:mb-12 bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center text-white text-xl sm:text-2xl">
              <Target className="h-6 w-6 sm:h-7 sm:w-7 mr-2 sm:mr-3 text-yellow-400" />
              Progress Petualanganmu
            </CardTitle>
            <CardDescription className="text-purple-200 text-base sm:text-lg">
              Lihat seberapa jauh kamu telah menjelajahi dunia pengetahuan Indonesia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div>
              <div className="flex justify-between text-base sm:text-lg mb-2 sm:mb-3">
                <span className="text-white font-medium">Progress Keseluruhan</span>
                <span className="text-purple-200 text-sm sm:text-base">{completedLevels}/12 Level Selesai</span>
              </div>
              <div className="relative">
                <Progress value={progressPercentage} className="h-3 sm:h-4 bg-white/20" />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs sm:text-sm text-purple-300">
                <span>Pemula</span>
                <span>Grandmaster</span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-3 sm:p-4 rounded-xl border border-blue-300/30">
                <div className="text-xl sm:text-2xl font-bold text-white">{completedLevels}</div>
                <div className="text-blue-200 text-xs sm:text-sm">Level Selesai</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-3 sm:p-4 rounded-xl border border-green-300/30">
                <div className="text-xl sm:text-2xl font-bold text-white">{totalScore}</div>
                <div className="text-green-200 text-xs sm:text-sm">Total Poin</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-3 sm:p-4 rounded-xl border border-yellow-300/30">
                <div className="text-xl sm:text-2xl font-bold text-white">{Math.round(progressPercentage)}%</div>
                <div className="text-yellow-200 text-xs sm:text-sm">Progress</div>
              </div>
              <div className="bg-gradient-to-br from-pink-500/20 to-red-500/20 p-3 sm:p-4 rounded-xl border border-pink-300/30">
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {userProgress.filter((p) => p.unlocked).length}
                </div>
                <div className="text-pink-200 text-xs sm:text-sm">Level Terbuka</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Level Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {userProgress.map((progress) => {
            const difficulty =
              progress.level <= 3
                ? {
                    name: "Mudah",
                    color: "from-green-500 to-emerald-500",
                    bgColor: "from-green-500/20 to-emerald-500/20",
                    borderColor: "border-green-300/30",
                  }
                : progress.level <= 6
                  ? {
                      name: "Sedang",
                      color: "from-yellow-500 to-orange-500",
                      bgColor: "from-yellow-500/20 to-orange-500/20",
                      borderColor: "border-yellow-300/30",
                    }
                  : progress.level <= 9
                    ? {
                        name: "Sulit",
                        color: "from-orange-500 to-red-500",
                        bgColor: "from-orange-500/20 to-red-500/20",
                        borderColor: "border-orange-300/30",
                      }
                    : {
                        name: "Sangat Sulit",
                        color: "from-red-500 to-pink-500",
                        bgColor: "from-red-500/20 to-pink-500/20",
                        borderColor: "border-red-300/30",
                      }

            const questionCount = progress.level <= 3 ? 10 : progress.level <= 6 ? 15 : progress.level <= 9 ? 20 : 25

            return (
              <Card
                key={progress.level}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 bg-white/10 backdrop-blur-md border-white/20 shadow-2xl ${
                  !progress.unlocked
                    ? "opacity-50 cursor-not-allowed"
                    : progress.completed
                      ? "ring-2 ring-green-400 shadow-green-400/25"
                      : "hover:ring-2 hover:ring-purple-400 hover:shadow-purple-400/25"
                }`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${difficulty.bgColor} opacity-50`}></div>

                {/* Lock Overlay */}
                {!progress.unlocked && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-600 rounded-full flex items-center justify-center mb-2 mx-auto">
                        <span className="text-white text-lg sm:text-xl">🔒</span>
                      </div>
                      <p className="text-white text-xs sm:text-sm font-medium">Terkunci</p>
                    </div>
                  </div>
                )}

                <CardHeader className="relative z-10 pb-2 sm:pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white text-lg sm:text-xl flex items-center">
                      {progress.completed && <Award className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mr-1 sm:mr-2" />}
                      Level {progress.level}
                    </CardTitle>
                    <Badge
                      className={`bg-gradient-to-r ${difficulty.color} text-white border-0 shadow-lg text-xs sm:text-sm`}
                    >
                      {difficulty.name}
                    </Badge>
                  </div>
                  <CardDescription className="text-purple-200 text-xs sm:text-sm">
                    {questionCount} soal -{" "}
                    {difficulty.name === "Mudah"
                      ? "Tingkat dasar"
                      : difficulty.name === "Sedang"
                        ? "Tingkat menengah"
                        : difficulty.name === "Sulit"
                          ? "Tingkat lanjut"
                          : "Tingkat expert"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10 space-y-3 sm:space-y-4">
                  {progress.completed && (
                    <div className="bg-green-500/20 border border-green-300/30 rounded-lg p-2 sm:p-3">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-green-300 font-medium flex items-center">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Selesai
                        </span>
                        <span className="text-white font-bold">{progress.score} poin</span>
                      </div>
                    </div>
                  )}

                  <Link href={progress.unlocked ? `/game/${progress.level}` : "#"}>
                    <Button
                      className={`w-full text-xs sm:text-sm py-2 sm:py-3 ${
                        !progress.unlocked
                          ? "bg-gray-600 cursor-not-allowed"
                          : progress.completed
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      } text-white shadow-lg transform transition-all duration-200 hover:scale-105`}
                      disabled={!progress.unlocked}
                    >
                      {!progress.unlocked ? (
                        <>🔒 Terkunci</>
                      ) : progress.completed ? (
                        <>🔄 Ulangi Level</>
                      ) : (
                        <>🚀 Mulai Level</>
                      )}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Achievement Section */}
        {completedLevels > 0 && (
          <Card className="mt-8 sm:mt-12 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-md border-purple-300/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-xl sm:text-2xl flex items-center">
                <Trophy className="h-6 w-6 sm:h-7 sm:w-7 mr-2 sm:mr-3 text-yellow-400" />
                Pencapaianmu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {completedLevels >= 3 && (
                  <div className="bg-green-500/20 border border-green-300/30 rounded-xl p-3 sm:p-4 text-center">
                    <div className="text-2xl sm:text-3xl mb-2">🌟</div>
                    <div className="text-white font-bold text-sm sm:text-base">Pemula</div>
                    <div className="text-green-200 text-xs sm:text-sm">3 Level Selesai</div>
                  </div>
                )}
                {completedLevels >= 6 && (
                  <div className="bg-blue-500/20 border border-blue-300/30 rounded-xl p-3 sm:p-4 text-center">
                    <div className="text-2xl sm:text-3xl mb-2">⭐</div>
                    <div className="text-white font-bold text-sm sm:text-base">Menengah</div>
                    <div className="text-blue-200 text-xs sm:text-sm">6 Level Selesai</div>
                  </div>
                )}
                {completedLevels >= 9 && (
                  <div className="bg-purple-500/20 border border-purple-300/30 rounded-xl p-3 sm:p-4 text-center">
                    <div className="text-2xl sm:text-3xl mb-2">💎</div>
                    <div className="text-white font-bold text-sm sm:text-base">Ahli</div>
                    <div className="text-purple-200 text-xs sm:text-sm">9 Level Selesai</div>
                  </div>
                )}
                {completedLevels === 12 && (
                  <div className="bg-yellow-500/20 border border-yellow-300/30 rounded-xl p-3 sm:p-4 text-center">
                    <div className="text-2xl sm:text-3xl mb-2">👑</div>
                    <div className="text-white font-bold text-sm sm:text-base">Grandmaster</div>
                    <div className="text-yellow-200 text-xs sm:text-sm">Semua Level Selesai!</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
