import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    const { data: leaderboardData, error } = await supabase
      .from("leaderboard")
      .select(`
        *,
        users (
          username,
          device_id
        )
      `)
      .order("total_score", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Error fetching leaderboard:", error)
      return NextResponse.json({ leaderboard: [] })
    }

    const formattedLeaderboard =
      leaderboardData?.map((entry) => ({
        id: entry.user_id,
        username: entry.users?.username || `Player ${entry.user_id.slice(-4)}`,
        totalScore: entry.total_score,
        levelsCompleted: entry.levels_completed,
        averageScore: entry.average_score,
        lastPlayed: entry.last_played,
      })) || []

    return NextResponse.json({ leaderboard: formattedLeaderboard })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ leaderboard: [] })
  }
}
