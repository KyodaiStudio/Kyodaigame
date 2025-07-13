"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Users,
  BookOpen,
  BarChart3,
  Shield,
  AlertTriangle,
  CheckCircle,
  LogOut,
} from "lucide-react"

interface Question {
  id: string
  question: string
  options: string[]
  correct_answer: number
  level: number
  explanation?: string
  created_at: string
}

interface AdminStats {
  totalQuestions: number
  totalUsers: number
  questionsPerLevel: { [key: number]: number }
}

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([])
  const [stats, setStats] = useState<AdminStats>({ totalQuestions: 0, totalUsers: 0, questionsPerLevel: {} })
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    correct_answer: 0,
    level: 1,
    explanation: "",
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/verify", {
        credentials: "include",
      })

      if (response.ok) {
        setIsAuthenticated(true)
        await loadData()
      } else {
        router.push("/admin/login")
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }

  const loadData = async () => {
    try {
      // Load questions
      const questionsResponse = await fetch("/api/questions")
      if (questionsResponse.ok) {
        const questionsData = await questionsResponse.json()
        setQuestions(questionsData.questions || [])

        // Calculate stats
        const questionsPerLevel: { [key: number]: number } = {}
        questionsData.questions?.forEach((q: Question) => {
          questionsPerLevel[q.level] = (questionsPerLevel[q.level] || 0) + 1
        })

        setStats({
          totalQuestions: questionsData.questions?.length || 0,
          totalUsers: 0, // This would come from a separate API
          questionsPerLevel,
        })
      }
    } catch (error) {
      console.error("Error loading data:", error)
      showMessage("error", "Gagal memuat data")
    }
  }

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      question: "",
      options: ["", "", "", ""],
      correct_answer: 0,
      level: 1,
      explanation: "",
    })
    setEditingQuestion(null)
    setShowAddForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.question.trim()) {
      showMessage("error", "Pertanyaan tidak boleh kosong")
      return
    }

    if (formData.options.some((opt) => !opt.trim())) {
      showMessage("error", "Semua opsi jawaban harus diisi")
      return
    }

    try {
      const url = editingQuestion ? `/api/questions/${editingQuestion.id}` : "/api/questions"
      const method = editingQuestion ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        showMessage("success", editingQuestion ? "Pertanyaan berhasil diperbarui" : "Pertanyaan berhasil ditambahkan")
        resetForm()
        await loadData()
      } else {
        const error = await response.json()
        showMessage("error", error.error || "Terjadi kesalahan")
      }
    } catch (error) {
      console.error("Error saving question:", error)
      showMessage("error", "Terjadi kesalahan saat menyimpan")
    }
  }

  const handleEdit = (question: Question) => {
    setFormData({
      question: question.question,
      options: question.options,
      correct_answer: question.correct_answer,
      level: question.level,
      explanation: question.explanation || "",
    })
    setEditingQuestion(question)
    setShowAddForm(true)
  }

  const handleDelete = async (questionId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pertanyaan ini?")) return

    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        showMessage("success", "Pertanyaan berhasil dihapus")
        await loadData()
      } else {
        showMessage("error", "Gagal menghapus pertanyaan")
      }
    } catch (error) {
      console.error("Error deleting question:", error)
      showMessage("error", "Terjadi kesalahan saat menghapus")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-sm w-full">
          <div className="relative mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
            <h3 className="text-white text-lg sm:text-xl font-bold mb-2">Memuat Panel Admin</h3>
            <p className="text-purple-200 text-sm sm:text-base">Memeriksa otentikasi...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 sm:p-3 rounded-xl shadow-lg">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">Panel Admin</h1>
                <p className="text-purple-200 text-xs sm:text-sm">Game Kuis Indonesia</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-4"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Message Alert */}
        {message && (
          <Alert
            className={`mb-6 ${message.type === "success" ? "bg-green-500/20 border-green-300/30" : "bg-red-500/20 border-red-300/30"}`}
          >
            {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            <AlertDescription className={message.type === "success" ? "text-green-200" : "text-red-200"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="dashboard" className="space-y-6 sm:space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-md border border-white/20">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-white/20 text-white text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="questions" className="data-[state=active]:bg-white/20 text-white text-xs sm:text-sm">
              <BookOpen className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Pertanyaan</span>
              <span className="sm:hidden">Soal</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-white/20 text-white text-xs sm:text-sm">
              <Users className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Pengguna</span>
              <span className="sm:hidden">User</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center text-base sm:text-lg">
                    <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-400" />
                    Total Pertanyaan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-white">{stats.totalQuestions}</div>
                  <p className="text-purple-200 text-xs sm:text-sm">Soal tersedia</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center text-base sm:text-lg">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-green-400" />
                    Total Pengguna
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-white">{stats.totalUsers}</div>
                  <p className="text-purple-200 text-xs sm:text-sm">Pemain terdaftar</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 sm:col-span-2 lg:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center text-base sm:text-lg">
                    <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-purple-400" />
                    Distribusi Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(stats.questionsPerLevel).map(([level, count]) => (
                      <div key={level} className="flex justify-between items-center text-sm">
                        <span className="text-purple-200">Level {level}</span>
                        <Badge variant="outline" className="border-purple-300 text-purple-300 text-xs">
                          {count} soal
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Manajemen Pertanyaan</h2>
                <p className="text-purple-200 text-sm sm:text-base">Kelola soal-soal kuis</p>
              </div>
              <Button
                onClick={() => setShowAddForm(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Pertanyaan
              </Button>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-lg sm:text-xl">
                    <Settings className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                    {editingQuestion ? "Edit Pertanyaan" : "Tambah Pertanyaan Baru"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div className="lg:col-span-2">
                        <Label htmlFor="question" className="text-white text-sm sm:text-base">
                          Pertanyaan
                        </Label>
                        <Textarea
                          id="question"
                          value={formData.question}
                          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                          className="bg-white/10 border-white/30 text-white placeholder-purple-300 text-sm sm:text-base"
                          placeholder="Masukkan pertanyaan..."
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label className="text-white text-sm sm:text-base">Level</Label>
                        <Select
                          value={formData.level.toString()}
                          onValueChange={(value) => setFormData({ ...formData, level: Number.parseInt(value) })}
                        >
                          <SelectTrigger className="bg-white/10 border-white/30 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((level) => (
                              <SelectItem key={level} value={level.toString()}>
                                Level {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-white text-sm sm:text-base">Jawaban Benar</Label>
                        <Select
                          value={formData.correct_answer.toString()}
                          onValueChange={(value) =>
                            setFormData({ ...formData, correct_answer: Number.parseInt(value) })
                          }
                        >
                          <SelectTrigger className="bg-white/10 border-white/30 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["A", "B", "C", "D"].map((letter, index) => (
                              <SelectItem key={index} value={index.toString()}>
                                Opsi {letter}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="lg:col-span-2">
                        <Label className="text-white text-sm sm:text-base">Opsi Jawaban</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2">
                          {formData.options.map((option, index) => (
                            <div key={index}>
                              <Label className="text-purple-200 text-xs sm:text-sm">
                                Opsi {String.fromCharCode(65 + index)}
                              </Label>
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...formData.options]
                                  newOptions[index] = e.target.value
                                  setFormData({ ...formData, options: newOptions })
                                }}
                                className="bg-white/10 border-white/30 text-white placeholder-purple-300 text-sm sm:text-base"
                                placeholder={`Opsi ${String.fromCharCode(65 + index)}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="lg:col-span-2">
                        <Label htmlFor="explanation" className="text-white text-sm sm:text-base">
                          Penjelasan (Opsional)
                        </Label>
                        <Textarea
                          id="explanation"
                          value={formData.explanation}
                          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                          className="bg-white/10 border-white/30 text-white placeholder-purple-300 text-sm sm:text-base"
                          placeholder="Penjelasan jawaban..."
                          rows={2}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {editingQuestion ? "Perbarui" : "Simpan"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Batal
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Questions Table */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/20">
                        <TableHead className="text-purple-200 font-semibold text-xs sm:text-sm">Level</TableHead>
                        <TableHead className="text-purple-200 font-semibold text-xs sm:text-sm">Pertanyaan</TableHead>
                        <TableHead className="text-purple-200 font-semibold text-center text-xs sm:text-sm">
                          Jawaban
                        </TableHead>
                        <TableHead className="text-purple-200 font-semibold text-center text-xs sm:text-sm">
                          Aksi
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {questions.map((question) => (
                        <TableRow key={question.id} className="border-white/10 hover:bg-white/5">
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="border-purple-300 text-purple-300 bg-purple-500/10 text-xs"
                            >
                              Level {question.level}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs sm:max-w-md">
                              <p className="text-white text-xs sm:text-sm truncate">{question.question}</p>
                              <p className="text-purple-300 text-xs mt-1">
                                {new Date(question.created_at).toLocaleDateString("id-ID")}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-500/20 text-green-300 border-green-300/30 text-xs">
                              {String.fromCharCode(65 + question.correct_answer)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center space-x-1 sm:space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(question)}
                                className="bg-blue-500/20 border-blue-300/30 text-blue-300 hover:bg-blue-500/30 p-1 sm:p-2"
                              >
                                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(question.id)}
                                className="bg-red-500/20 border-red-300/30 text-red-300 hover:bg-red-500/30 p-1 sm:p-2"
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg sm:text-xl">Manajemen Pengguna</CardTitle>
                <CardDescription className="text-purple-200 text-sm sm:text-base">
                  Fitur ini akan segera tersedia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 sm:py-12">
                  <Users className="h-16 w-16 sm:h-20 sm:w-20 text-purple-400 mx-auto mb-4" />
                  <p className="text-purple-200 text-base sm:text-lg">Manajemen pengguna sedang dalam pengembangan</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
