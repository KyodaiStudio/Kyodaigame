"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Medal, Award, Users, TrendingUp, Star, ArrowLeft, Crown, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface LeaderboardEntry {
  id: string
  username: string
  totalScore: number
  levelsCompleted: number
  averageScore: number
  lastPlayed: string
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    try {
      const response = await fetch("/api/leaderboard")
      if (response.ok) {
        const data = await response.json()
        setLeaderboard(data.leaderboard || [])
      } else {
        console.error("Failed to load leaderboard")
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
      case 2:
        return <Medal className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300" />
      case 3:
        return <Award className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600" />
      default:
        return (
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs sm:text-sm">#{rank}</span>
          </div>
        )
    }
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 text-xs sm:text-sm">
            🥇 Juara 1
          </Badge>
        )
      case 2:
        return (
          <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 text-xs sm:text-sm">
            🥈 Juara 2
          </Badge>
        )
      case 3:
        return (
          <Badge className="bg-gradient-to-r from-amber-600 to-amber-700 text-white border-0 text-xs sm:text-sm">
            🥉 Juara 3
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="border-purple-300 text-purple-300 text-xs sm:text-sm">
            Peringkat {rank}
          </Badge>
        )
    }
  }

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
            <h3 className="text-white text-lg sm:text-xl font-bold mb-2">Memuat Papan Skor</h3>
            <p className="text-purple-200 text-sm sm:text-base">Mengambil data peringkat pemain...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <div className="relative flex-shrink-0">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg">
                  <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Papan Skor
                </h1>
                <p className="text-purple-200 text-xs sm:text-sm">🏆 Lihat peringkat pemain terbaik!</p>
              </div>
            </div>
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-4"
              >
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Kembali
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {leaderboard.length === 0 ? (
          <Card className="text-center bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <CardContent className="p-8 sm:p-12">
              <Trophy className="h-16 w-16 sm:h-20 sm:w-20 text-yellow-400 mx-auto mb-4 sm:mb-6" />
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Belum Ada Pemain</h3>
              <p className="text-purple-200 text-base sm:text-lg mb-4 sm:mb-6">
                Jadilah yang pertama bermain dan raih posisi teratas di papan skor!
              </p>
              <Link href="/">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                  <Zap className="h-4 w-4 mr-2" />
                  Mulai Bermain Sekarang
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Top 3 Podium */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
                <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  🏆 Hall of Fame 🏆
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 max-w-5xl mx-auto">
                {leaderboard.slice(0, 3).map((entry, index) => {
                  const rank = index + 1
                  const isFirst = rank === 1

                  return (
                    <Card
                      key={entry.id}
                      className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                        isFirst
                          ? "md:order-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-300/30 shadow-yellow-400/25 shadow-2xl"
                          : rank === 2
                            ? "md:order-1 bg-gradient-to-br from-gray-400/20 to-gray-500/20 border-gray-300/30"
                            : "md:order-3 bg-gradient-to-br from-amber-600/20 to-amber-700/20 border-amber-300/30"
                      } backdrop-blur-md`}
                    >
                      {/* Crown for first place */}
                      {isFirst && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-full shadow-lg">
                            <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                          </div>
                        </div>
                      )}

                      <CardHeader className="text-center pb-3 sm:pb-4 pt-6 sm:pt-8">
                        <div className="flex justify-center mb-3 sm:mb-4">{getRankIcon(rank)}</div>
                        <CardTitle className="text-white text-lg sm:text-xl truncate">{entry.username}</CardTitle>
                        <div className="flex justify-center">{getRankBadge(rank)}</div>
                      </CardHeader>

                      <CardContent className="text-center space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          <div className="bg-white/10 p-2 sm:p-3 rounded-lg">
                            <div className="text-lg sm:text-xl font-bold text-white">{entry.totalScore}</div>
                            <div className="text-xs sm:text-sm text-purple-200">Total Poin</div>
                          </div>
                          <div className="bg-white/10 p-2 sm:p-3 rounded-lg">
                            <div className="text-lg sm:text-xl font-bold text-white">{entry.levelsCompleted}</div>
                            <div className="text-xs sm:text-sm text-purple-200">Level Selesai</div>
                          </div>
                        </div>
                        <div className="bg-white/10 p-2 sm:p-3 rounded-lg">
                          <div className="text-base sm:text-lg font-bold text-white">
                            {entry.averageScore.toFixed(1)}
                          </div>
                          <div className="text-xs sm:text-sm text-purple-200">Rata-rata Skor</div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Full Leaderboard Table */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center text-white text-xl sm:text-2xl">
                  <Users className="h-6 w-6 sm:h-7 sm:w-7 mr-2 sm:mr-3 text-blue-400" />
                  Peringkat Lengkap
                </CardTitle>
                <CardDescription className="text-purple-200 text-base sm:text-lg">
                  Semua pemain yang telah berpartisipasi dalam Game Kuis Indonesia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/20 hover:bg-white/5">
                        <TableHead className="text-purple-200 font-semibold text-sm sm:text-base">Peringkat</TableHead>
                        <TableHead className="text-purple-200 font-semibold text-sm sm:text-base">Pemain</TableHead>
                        <TableHead className="text-purple-200 font-semibold text-center text-sm sm:text-base">
                          Total Poin
                        </TableHead>
                        <TableHead className="text-purple-200 font-semibold text-center text-sm sm:text-base">
                          Level Selesai
                        </TableHead>
                        <TableHead className="text-purple-200 font-semibold text-center text-sm sm:text-base">
                          Rata-rata
                        </TableHead>
                        <TableHead className="text-purple-200 font-semibold text-center text-sm sm:text-base hidden sm:table-cell">
                          Terakhir Main
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaderboard.map((entry, index) => {
                        const rank = index + 1
                        return (
                          <TableRow
                            key={entry.id}
                            className={`border-white/10 hover:bg-white/5 transition-colors ${
                              rank <= 3 ? "bg-white/5" : ""
                            }`}
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                {getRankIcon(rank)}
                                <span className="text-white text-sm sm:text-base">#{rank}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-white font-bold text-xs sm:text-sm">
                                    {entry.username.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-white font-medium text-sm sm:text-base truncate">
                                    {entry.username}
                                  </div>
                                  {rank <= 3 && (
                                    <div className="flex items-center space-x-1 mt-1">
                                      <Star className="h-3 w-3 text-yellow-400" />
                                      <span className="text-yellow-300 text-xs">Top Player</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                                <TrendingUp className="h-4 w-4 text-green-400" />
                                <span className="text-white font-bold text-sm sm:text-base">{entry.totalScore}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant="outline"
                                className="border-blue-300 text-blue-300 bg-blue-500/10 text-xs sm:text-sm"
                              >
                                {entry.levelsCompleted}/12
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="text-purple-200 font-medium text-sm sm:text-base">
                                {entry.averageScore.toFixed(1)}
                              </span>
                            </TableCell>
                            <TableCell className="text-center hidden sm:table-cell">
                              <span className="text-purple-300 text-xs sm:text-sm">
                                {new Date(entry.lastPlayed).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}
