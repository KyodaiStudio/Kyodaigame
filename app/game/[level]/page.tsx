"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Clock, Trophy, CheckCircle, XCircle, RotateCcw, Zap, Target, Star } from "lucide-react"
import Link from "next/link"

interface Question {
  id: string
  question: string
  options: string[]
  correct_answer: number
  explanation?: string
}

interface GameState {
  currentQuestion: number
  score: number
  answers: number[]
  timeLeft: number
  isCompleted: boolean
  isCorrect: boolean | null
}

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const level = Number.parseInt(params.level as string)

  const [questions, setQuestions] = useState<Question[]>([])
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    score: 0,
    answers: [],
    timeLeft: 30,
    isCompleted: false,
    isCorrect: null,
  })
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deviceId, setDeviceId] = useState<string>("")

  useEffect(() => {
    initializeGame()
  }, [level])

  useEffect(() => {
    if (gameState.timeLeft > 0 && !gameState.isCompleted && !showResult) {
      const timer = setTimeout(() => {
        setGameState((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }))
      }, 1000)
      return () => clearTimeout(timer)
    } else if (gameState.timeLeft === 0 && !showResult) {
      handleTimeUp()
    }
  }, [gameState.timeLeft, gameState.isCompleted, showResult])

  const initializeGame = async () => {
    try {
      // Get device ID
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

      await loadQuestions()
    } catch (error) {
      console.error("Error initializing game:", error)
      setLoading(false)
    }
  }

  const loadQuestions = async () => {
    try {
      const response = await fetch(`/api/questions?level=${level}`)
      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions)
      } else {
        console.error("Failed to load questions")
      }
    } catch (error) {
      console.error("Error loading questions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTimeUp = () => {
    setSelectedAnswer(null)
    setShowResult(true)
    setGameState((prev) => ({ ...prev, isCorrect: false }))
  }

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return

    const currentQ = questions[gameState.currentQuestion]
    const isCorrect = selectedAnswer === currentQ.correct_answer

    setGameState((prev) => ({
      ...prev,
      answers: [...prev.answers, selectedAnswer],
      score: isCorrect ? prev.score + 10 : prev.score,
      isCorrect,
    }))

    setShowResult(true)
  }

  const handleNextQuestion = () => {
    const nextQuestion = gameState.currentQuestion + 1

    if (nextQuestion >= questions.length) {
      // Game selesai
      setGameState((prev) => ({ ...prev, isCompleted: true }))
      saveGameResult()
    } else {
      // Pertanyaan berikutnya
      setGameState((prev) => ({
        ...prev,
        currentQuestion: nextQuestion,
        timeLeft: 30,
        isCorrect: null,
      }))
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const saveGameResult = async () => {
    try {
      const finalScore = gameState.score + (gameState.isCorrect ? 10 : 0)
      const percentage = Math.round((finalScore / (questions.length * 10)) * 100)
      const passed = percentage >= 60

      await fetch("/api/game/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId,
          level,
          score: finalScore,
          passed,
          answers: gameState.answers,
        }),
      })
    } catch (error) {
      console.error("Error saving game result:", error)
    }
  }

  const handleRetryLevel = () => {
    setGameState({
      currentQuestion: 0,
      score: 0,
      answers: [],
      timeLeft: 30,
      isCompleted: false,
      isCorrect: null,
    })
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const getDifficultyInfo = () => {
    if (level <= 3)
      return {
        name: "Mudah",
        color: "from-green-500 to-emerald-500",
        bgColor: "from-green-500/20 to-emerald-500/20",
        description: "Tingkat dasar",
      }
    if (level <= 6)
      return {
        name: "Sedang",
        color: "from-yellow-500 to-orange-500",
        bgColor: "from-yellow-500/20 to-orange-500/20",
        description: "Tingkat menengah",
      }
    if (level <= 9)
      return {
        name: "Sulit",
        color: "from-orange-500 to-red-500",
        bgColor: "from-orange-500/20 to-red-500/20",
        description: "Tingkat lanjut",
      }
    return {
      name: "Sangat Sulit",
      color: "from-red-500 to-pink-500",
      bgColor: "from-red-500/20 to-pink-500/20",
      description: "Tingkat expert",
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
            <h3 className="text-white text-xl font-bold mb-2">Memuat Soal Level {level}</h3>
            <p className="text-purple-200">Menyiapkan tantangan untukmu...</p>
          </div>
        </div>
      </div>
    )
  }

  const difficulty = getDifficultyInfo()
  const currentQ = questions[gameState.currentQuestion]
  const progress = ((gameState.currentQuestion + 1) / questions.length) * 100

  // Game completed screen
  if (gameState.isCompleted) {
    const finalScore = gameState.score
    const maxScore = questions.length * 10
    const percentage = Math.round((finalScore / maxScore) * 100)
    const passed = percentage >= 60

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="max-w-2xl mx-auto relative z-10">
          <Card className="text-center bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <CardHeader>
              <div className="mx-auto mb-6">
                {passed ? (
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="h-12 w-12 text-white" />
                  </div>
                )}
              </div>
              <CardTitle className="text-3xl text-white mb-2">
                {passed ? "🎉 Luar Biasa! Level Selesai!" : "😔 Hampir Berhasil!"}
              </CardTitle>
              <CardDescription className="text-purple-200 text-lg">
                Level {level} - {difficulty.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-6 rounded-xl border border-blue-300/30">
                  <Trophy className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white">{finalScore}</div>
                  <div className="text-blue-200">Poin Diperoleh</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6 rounded-xl border border-green-300/30">
                  <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white">{percentage}%</div>
                  <div className="text-green-200">Akurasi</div>
                </div>
              </div>

              <div className="space-y-4">
                {passed && level < 12 && (
                  <Link href={`/game/${level + 1}`}>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg text-lg py-3">
                      <Zap className="h-5 w-5 mr-2" />
                      Lanjut ke Level {level + 1}
                    </Button>
                  </Link>
                )}

                <Button
                  variant="outline"
                  className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                  onClick={handleRetryLevel}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Ulangi Level {level}
                </Button>

                <Link href="/">
                  <Button variant="ghost" className="w-full text-purple-200 hover:text-white hover:bg-white/10">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Menu Utama
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>

          <div className="flex items-center space-x-4">
            <Badge className={`bg-gradient-to-r ${difficulty.color} text-white border-0 shadow-lg px-4 py-2`}>
              Level {level} - {difficulty.name}
            </Badge>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 rounded-full shadow-lg">
              <Trophy className="h-5 w-5 text-white" />
              <span className="font-bold text-white">{gameState.score} poin</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-8 bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-medium text-lg">
                Pertanyaan {gameState.currentQuestion + 1} dari {questions.length}
              </span>
              <div className="flex items-center space-x-3">
                <Clock className={`h-6 w-6 ${gameState.timeLeft <= 10 ? "text-red-400" : "text-blue-400"}`} />
                <span
                  className={`font-bold text-2xl ${gameState.timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-white"}`}
                >
                  {gameState.timeLeft}s
                </span>
              </div>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-3 bg-white/20" />
              <div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-white leading-relaxed">{currentQ?.question}</CardTitle>
          </CardHeader>
          <CardContent>
            {!showResult ? (
              <div className="space-y-6">
                <RadioGroup
                  value={selectedAnswer?.toString()}
                  onValueChange={(value) => setSelectedAnswer(Number.parseInt(value))}
                  className="space-y-4"
                >
                  {currentQ?.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 border border-white/30 rounded-xl hover:bg-white/10 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                      onClick={() => setSelectedAnswer(index)}
                    >
                      <RadioGroupItem
                        value={index.toString()}
                        id={`option-${index}`}
                        className="border-white/50 text-purple-400"
                      />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-white text-lg">
                        <span className="font-medium text-purple-300 mr-3">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <Button
                  onClick={handleAnswerSubmit}
                  disabled={selectedAnswer === null}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg text-lg py-4"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Jawab Pertanyaan
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div
                  className={`p-6 rounded-xl border ${
                    gameState.isCorrect ? "bg-green-500/20 border-green-300/30" : "bg-red-500/20 border-red-300/30"
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    {gameState.isCorrect ? (
                      <CheckCircle className="h-8 w-8 text-green-400" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-400" />
                    )}
                    <span className={`font-bold text-xl ${gameState.isCorrect ? "text-green-300" : "text-red-300"}`}>
                      {gameState.isCorrect ? "🎉 Jawaban Benar! (+10 poin)" : "❌ Jawaban Salah!"}
                    </span>
                  </div>

                  {!gameState.isCorrect && (
                    <p className="text-white mb-3">
                      <strong>Jawaban yang benar:</strong>
                      <span className="text-green-300 ml-2 font-medium">
                        {String.fromCharCode(65 + currentQ?.correct_answer)} -{" "}
                        {currentQ?.options[currentQ.correct_answer]}
                      </span>
                    </p>
                  )}

                  {currentQ?.explanation && (
                    <div className="bg-white/10 p-4 rounded-lg mt-4">
                      <p className="text-white">
                        <strong className="text-blue-300">💡 Penjelasan:</strong>
                        <span className="ml-2">{currentQ.explanation}</span>
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleNextQuestion}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg text-lg py-4"
                >
                  {gameState.currentQuestion + 1 >= questions.length ? (
                    <>
                      <Trophy className="h-5 w-5 mr-2" />
                      Selesaikan Level
                    </>
                  ) : (
                    <>
                      <ArrowLeft className="h-5 w-5 mr-2 rotate-180" />
                      Pertanyaan Berikutnya
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
