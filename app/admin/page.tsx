"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  Users,
  BookOpen,
  BarChart3,
  ArrowLeft,
  Shield,
  LogOut,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

interface Question {
  id: string
  question: string
  options: string[]
  correct_answer: number
  level: number
  explanation?: string
  created_at: string
}

interface QuestionForm {
  question: string
  options: string[]
  correct_answer: number
  level: number
  explanation: string
}

export default function AdminPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedLevel, setSelectedLevel] = useState<number>(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  const [questionForm, setQuestionForm] = useState<QuestionForm>({
    question: "",
    options: ["", "", "", ""],
    correct_answer: 0,
    level: 1,
    explanation: "",
  })

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadQuestions()
    }
  }, [isAuthenticated])

  const checkAuth = async () => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
      return
    }

    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })

      if (response.ok) {
        setIsAuthenticated(true)
        setLoading(false)
      } else {
        localStorage.removeItem("adminToken")
        router.push("/admin/login")
      }
    } catch (error) {
      console.error("Auth check error:", error)
      localStorage.removeItem("adminToken")
      router.push("/admin/login")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin/login")
  }

  const loadQuestions = async () => {
    try {
      setError("")
      const response = await fetch("/api/questions")
      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions || [])
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Gagal memuat soal")
      }
    } catch (error) {
      console.error("Error loading questions:", error)
      setError("Terjadi kesalahan saat memuat soal")
    }
  }

  const handleSaveQuestion = async () => {
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const method = editingQuestion ? "PUT" : "POST"
      const url = editingQuestion ? `/api/questions/${editingQuestion.id}` : "/api/questions"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionForm),
      })

      if (response.ok) {
        setSuccess(editingQuestion ? "Soal berhasil diperbarui!" : "Soal berhasil ditambahkan!")
        await loadQuestions()
        resetForm()
        setIsDialogOpen(false)

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000)
      } else {
        const data = await response.json()
        setError(data.error || "Gagal menyimpan soal")
      }
    } catch (error) {
      console.error("Error saving question:", error)
      setError("Terjadi kesalahan saat menyimpan soal")
    } finally {
      setSaving(false)
    }
  }

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question)
    setQuestionForm({
      question: question.question,
      options: question.options,
      correct_answer: question.correct_answer,
      level: question.level,
      explanation: question.explanation || "",
    })
    setIsDialogOpen(true)
  }

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus soal ini?")) return

    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSuccess("Soal berhasil dihapus!")
        await loadQuestions()
        setTimeout(() => setSuccess(""), 3000)
      } else {
        const data = await response.json()
        setError(data.error || "Gagal menghapus soal")
      }
    } catch (error) {
      console.error("Error deleting question:", error)
      setError("Terjadi kesalahan saat menghapus soal")
    }
  }

  const resetForm = () => {
    setQuestionForm({
      question: "",
      options: ["", "", "", ""],
      correct_answer: 0,
      level: 1,
      explanation: "",
    })
    setEditingQuestion(null)
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...questionForm.options]
    newOptions[index] = value
    setQuestionForm({ ...questionForm, options: newOptions })
  }

  const filteredQuestions = questions.filter((q) => q.level === selectedLevel)
  const questionsByLevel = Array.from({ length: 12 }, (_, i) => ({
    level: i + 1,
    count: questions.filter((q) => q.level === i + 1).length,
  }))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Memuat dashboard admin...</p>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-2xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-purple-200">Kelola soal dan level permainan</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={loadQuestions}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              <Link href="/">
                <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali ke Game
                </Button>
              </Link>
              <Button
                variant="outline"
                className="bg-red-500/20 border-red-300/30 text-red-200 hover:bg-red-500/30"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <Alert className="mb-6 bg-red-500/20 border-red-300/30 text-red-200">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-500/20 border-green-300/30 text-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
            <TabsTrigger value="questions" className="text-white data-[state=active]:bg-purple-600">
              Kelola Soal
            </TabsTrigger>
            <TabsTrigger value="levels" className="text-white data-[state=active]:bg-purple-600">
              Level Overview
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-white data-[state=active]:bg-purple-600">
              Statistik
            </TabsTrigger>
          </TabsList>

          {/* Kelola Soal */}
          <TabsContent value="questions" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-white">Kelola Soal</h2>
                <p className="text-purple-200 text-lg">Tambah, edit, atau hapus soal untuk setiap level</p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={resetForm}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Soal
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-white text-xl">
                      {editingQuestion ? "Edit Soal" : "Tambah Soal Baru"}
                    </DialogTitle>
                    <DialogDescription className="text-slate-300">
                      Isi form di bawah untuk {editingQuestion ? "mengubah" : "menambahkan"} soal
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="level" className="text-white">
                        Level
                      </Label>
                      <Select
                        value={questionForm.level.toString()}
                        onValueChange={(value) => setQuestionForm({ ...questionForm, level: Number.parseInt(value) })}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                          <SelectValue placeholder="Pilih level" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()} className="text-white">
                              Level {i + 1} - {i < 3 ? "Mudah" : i < 6 ? "Sedang" : i < 9 ? "Sulit" : "Sangat Sulit"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="question" className="text-white">
                        Pertanyaan
                      </Label>
                      <Textarea
                        id="question"
                        placeholder="Masukkan pertanyaan..."
                        value={questionForm.question}
                        onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                        rows={3}
                        className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <Label className="text-white">Pilihan Jawaban</Label>
                      <div className="space-y-3">
                        {questionForm.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="flex-1">
                              <Input
                                placeholder={`Pilihan ${String.fromCharCode(65 + index)}`}
                                value={option}
                                onChange={(e) => updateOption(index, e.target.value)}
                                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                              />
                            </div>
                            <Button
                              type="button"
                              variant={questionForm.correct_answer === index ? "default" : "outline"}
                              size="sm"
                              onClick={() => setQuestionForm({ ...questionForm, correct_answer: index })}
                              className={
                                questionForm.correct_answer === index
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "border-slate-600 text-slate-300 hover:bg-slate-700"
                              }
                            >
                              {questionForm.correct_answer === index ? "✓ Benar" : "Pilih"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="explanation" className="text-white">
                        Penjelasan (Opsional)
                      </Label>
                      <Textarea
                        id="explanation"
                        placeholder="Penjelasan jawaban yang benar..."
                        value={questionForm.explanation}
                        onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                        rows={2}
                        className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={handleSaveQuestion}
                      disabled={saving || !questionForm.question || questionForm.options.some((opt) => !opt.trim())}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {saving ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Menyimpan...
                        </div>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {editingQuestion ? "Update" : "Simpan"} Soal
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Level Filter */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Label className="text-white text-lg">Filter Level:</Label>
                  <Select
                    value={selectedLevel.toString()}
                    onValueChange={(value) => setSelectedLevel(Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-64 bg-slate-800 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()} className="text-white">
                          Level {i + 1} ({questions.filter((q) => q.level === i + 1).length} soal)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Questions Table */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Soal Level {selectedLevel}</CardTitle>
                <CardDescription className="text-purple-200 text-lg">
                  {filteredQuestions.length} soal tersedia untuk level ini
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredQuestions.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-300 text-lg mb-4">Belum ada soal untuk level ini</p>
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={() => {
                        setQuestionForm({ ...questionForm, level: selectedLevel })
                        setIsDialogOpen(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Soal Pertama
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700">
                          <TableHead className="text-slate-300">Pertanyaan</TableHead>
                          <TableHead className="text-slate-300">Jawaban Benar</TableHead>
                          <TableHead className="text-slate-300">Dibuat</TableHead>
                          <TableHead className="text-slate-300">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredQuestions.map((question) => (
                          <TableRow key={question.id} className="border-slate-700">
                            <TableCell className="max-w-md text-white">
                              <div className="truncate" title={question.question}>
                                {question.question}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-green-600 text-white">
                                {String.fromCharCode(65 + question.correct_answer)} -{" "}
                                {question.options[question.correct_answer]?.substring(0, 20)}
                                {question.options[question.correct_answer]?.length > 20 ? "..." : ""}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-300">
                              {new Date(question.created_at).toLocaleDateString("id-ID")}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditQuestion(question)}
                                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteQuestion(question.id)}
                                  className="border-red-600 text-red-300 hover:bg-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Level Overview */}
          <TabsContent value="levels" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Overview Level</h2>
              <p className="text-purple-200 text-lg">Lihat jumlah soal di setiap level</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {questionsByLevel.map(({ level, count }) => {
                const difficulty = level <= 3 ? "Mudah" : level <= 6 ? "Sedang" : level <= 9 ? "Sulit" : "Sangat Sulit"
                const requiredCount = level <= 3 ? 10 : level <= 6 ? 15 : level <= 9 ? 20 : 25
                const isComplete = count >= requiredCount
                const difficultyColor =
                  level <= 3
                    ? "from-green-500 to-emerald-500"
                    : level <= 6
                      ? "from-yellow-500 to-orange-500"
                      : level <= 9
                        ? "from-orange-500 to-red-500"
                        : "from-red-500 to-pink-500"

                return (
                  <Card
                    key={level}
                    className={`bg-white/10 backdrop-blur-md border-white/20 ${isComplete ? "ring-2 ring-green-500" : ""}`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-white">Level {level}</CardTitle>
                        <Badge className={`bg-gradient-to-r ${difficultyColor} text-white border-0`}>
                          {difficulty}
                        </Badge>
                      </div>
                      <CardDescription className="text-purple-200">
                        {count}/{requiredCount} soal
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="w-full bg-slate-700 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-300 ${
                              isComplete
                                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                : "bg-gradient-to-r from-blue-500 to-purple-500"
                            }`}
                            style={{ width: `${Math.min((count / requiredCount) * 100, 100)}%` }}
                          ></div>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
                          onClick={() => setSelectedLevel(level)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Lihat Soal ({count})
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Statistik */}
          <TabsContent value="stats" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Statistik</h2>
              <p className="text-purple-200 text-lg">Ringkasan data soal dan permainan</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-300/30">
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <div className="text-4xl font-bold text-white">{questions.length}</div>
                  <div className="text-blue-200 text-lg">Total Soal</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-300/30">
                <CardContent className="p-8 text-center">
                  <BarChart3 className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <div className="text-4xl font-bold text-white">
                    {questionsByLevel.filter((l) => l.count > 0).length}
                  </div>
                  <div className="text-green-200 text-lg">Level Aktif</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-300/30">
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <div className="text-4xl font-bold text-white">{Math.round((questions.length / 12) * 100) / 100}</div>
                  <div className="text-purple-200 text-lg">Rata-rata Soal/Level</div>
                </CardContent>
              </Card>
            </div>

            {/* Level Statistics */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Statistik per Level</CardTitle>
                <CardDescription className="text-purple-200 text-lg">
                  Detail jumlah soal di setiap level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">Level</TableHead>
                        <TableHead className="text-slate-300">Tingkat Kesulitan</TableHead>
                        <TableHead className="text-slate-300">Jumlah Soal</TableHead>
                        <TableHead className="text-slate-300">Target Soal</TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {questionsByLevel.map(({ level, count }) => {
                        const difficulty =
                          level <= 3 ? "Mudah" : level <= 6 ? "Sedang" : level <= 9 ? "Sulit" : "Sangat Sulit"
                        const requiredCount = level <= 3 ? 10 : level <= 6 ? 15 : level <= 9 ? 20 : 25
                        const isComplete = count >= requiredCount

                        return (
                          <TableRow key={level} className="border-slate-700">
                            <TableCell className="text-white font-medium">Level {level}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-slate-600 text-slate-300">
                                {difficulty}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-white">{count}</TableCell>
                            <TableCell className="text-slate-300">{requiredCount}</TableCell>
                            <TableCell>
                              <Badge className={isComplete ? "bg-green-600 text-white" : "bg-yellow-600 text-white"}>
                                {isComplete ? "Lengkap" : "Perlu Soal"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
