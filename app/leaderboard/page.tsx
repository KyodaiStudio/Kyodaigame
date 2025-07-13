"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Medal, Award, Users, TrendingUp, Star, ArrowLeft, Crown, Zap } from 'lucide-react'
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
        return <Trophy className="h-8 w-8 text-yellow-400" />
      case 2:
        return <Medal className="h-8 w-8 text-gray-300" />
      case 3:
        return <Award className="h-8 w-8 text-amber-600" />
      default:
        return (
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">#{rank}</span>
          </div>
        )
    }
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">🥇 Juara 1</Badge>
      case 2:
        return <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0">🥈 Juara 2</Badge>
      case 3:
        return <Badge className="bg-gradient-to-r from-amber-600 to-amber-700 text-white border-0">🥉 Juara 3</Badge>
      default:
        return <Badge variant="outline" className="border-purple-300 text-purple-300">Peringkat {rank}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-6"></div>
            <div
              className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-pink-500 rounded-full animate-spin mx-auto"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            ></div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-2">Memuat Papan Skor</h3>
            <p className="text-purple-200">Mengambil data peringkat pemain...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-2xl shadow-lg">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Papan Skor
                </h1>
                <p className="text-purple-200">🏆 Lihat peringkat pemain terbaik Indonesia!</p>
              </div>
            </div>
            <Link href="/">
              <Button
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {leaderboard.length === 0 ? (
          <Card className="text-center bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <CardContent className="p-12">
              <Trophy className="h-20 w-20 text-yellow-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Belum Ada Pemain</h3>
              <p className="text-purple-200 text-lg mb-6">
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
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-center mb-8">
                <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  🏆 Hall of Fame 🏆
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {leaderboard.slice(0, 3).map((entry, index) => {
                  const rank = index + 1
                  const isFirst = rank === 1

                  return (
                    <Card
                      key={entry.id}
                      className={`text-center bg-white/10 backdrop-blur-md border-white/20 shadow-2xl transform transition-all duration-300 hover:scale-105 ${
                        isFirst ? "ring-4 ring-yellow-400 scale-110" : ""
                      }`}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex justify-center mb-4">{getRankIcon(rank)}</div>
                        <CardTitle className={`text-xl ${isFirst ? "text-yellow-400" : "text-white"}`}>
                          {entry.username}
                        </CardTitle>
                        <CardDescription className="text-center">{getRankBadge(rank)}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4 rounded-xl border border-blue-300/30">
                            <div className="text-2xl font-bold text-blue-300">{entry.totalScore}</div>
                            <div className="text-blue-200">Total Poin</div>
                          </div>
                          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 rounded-xl border border-green-300/30">
                            <div className="text-2xl font-bold text-green-300">{entry.levelsCompleted}</div>
                            <div className="text-green-200">Level Selesai</div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4 rounded-xl border border-purple-300/30">
                          <div className="text-2xl font-bold text-purple-300">{entry.averageScore.toFixed(1)}%</div>
                          <div className="text-purple-200">Rata-rata Skor</div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Full Leaderboard */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center text-white text-2xl">
                  <Users className="h-7 w-7 mr-3 text-purple-400" />
                  Papan Skor Lengkap
                </CardTitle>
                <CardDescription className="text-purple-200 text-lg">
                  Peringkat semua pemain berdasarkan total poin dan pencapaian
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/20">
                        <TableHead className="text-purple-200 text-center">Rank</TableHead>
                        <TableHead className="text-purple-200">Nama Pemain</TableHead>
                        <TableHead className="text-purple-200 text-center">Total Poin</TableHead>
                        <TableHead className="text-purple-200 text-center">Level Selesai</TableHead>
                        <TableHead className="text-purple-200 text-center">Rata-rata Skor</TableHead>
                        <TableHead className="text-purple-200 text-center">Terakhir Main</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaderboard.map((entry, index) => {
                        const rank = index + 1

                        return (
                          <TableRow
                            key={entry.id}
                            className={`border-white/10 transition-colors hover:bg-white/5 ${
                              rank <= 3 ? "bg-gradient-to-r from-yellow-500/10 to-orange-500/10" : ""
                            }`}
                          >
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center">{getRankIcon(rank)}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <div className="font-medium text-white text-lg">{entry.username}</div>
                                {rank <= 3 && <div className="mt-1">{getRankBadge(rank)}</div>}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <Star className="h-5 w-5 text-yellow-400" />
                                <span className="font-bold text-white text-lg">{entry.totalScore}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant="outline"
                                className="border-purple-300 text-purple-300 bg-purple-500/20"
                              >
                                {entry.levelsCompleted}/12
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <TrendingUp className="h-4 w-4 text-green-400" />
                                <span className="text-white">{entry.averageScore.toFixed(1)}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center text-sm text-purple-300">
                              {new Date(entry.lastPlayed).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
              <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-300/30 shadow-xl">
                <CardContent className="p-8 text-center">
                  <Users className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white">{leaderboard.length}</div>
                  <div className="text-blue-200">Total Pemain</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-300/30 shadow-xl">
                <CardContent className="p-8 text-center">
                  <Trophy className="h-10 w-10 text-yellow-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white">
                    {leaderboard.length > 0 ? Math.max(...leaderboard.map((l) => l.totalScore)) : 0}
                  </div>
                  <div className="text-yellow-200">Skor Tertinggi</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-300/30 shadow-xl">
                <CardContent className="p-8 text-center">
                  <Star className="h-10 w-10 text-purple-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white">
                    {leaderboard.length > 0
                      ? Math.round(leaderboard.reduce((sum, l) => sum + l.averageScore, 0) / leaderboard.length)
                      : 0}
                    %
                  </div>
                  <div className="text-purple-200">Rata-rata Global</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-300/30 shadow-xl">
                <CardContent className="p-8 text-center">
                  <Crown className="h-10 w-10 text-green-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white">
                    {leaderboard.filter((l) => l.levelsCompleted === 12).length}
                  </div>
                  <div className="text-green-200">Grandmaster</div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
