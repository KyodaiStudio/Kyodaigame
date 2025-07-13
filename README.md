# Game Kuis Indonesia 🎯

Aplikasi game kuis edukasi berbasis web dengan 12 level yang menantang, dilengkapi dengan dashboard admin untuk mengelola soal secara real-time.

## 🚀 Fitur Utama

### Untuk Pemain
- **12 Level Permainan** dengan tingkat kesulitan bertingkat
- **Sistem Poin dan Skor** yang komprehensif
- **Progress Tracking** per level
- **Sistem Mengulang Level** yang gagal
- **Interface Responsif** untuk mobile dan desktop
- **Papan Skor (Leaderboard)** untuk kompetisi

### Untuk Admin
- **Dashboard Admin** untuk mengelola soal
- **CRUD Soal** secara real-time
- **Manajemen Level** dan kategori
- **Statistik Pemain** dan performa
- **Sistem Autentikasi** admin

## 🛠️ Teknologi

- **Frontend**: Next.js 14 dengan TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📱 Struktur Level

- **Level 1-3**: Mudah (10 soal per level)
- **Level 4-6**: Sedang (15 soal per level)  
- **Level 7-9**: Sulit (20 soal per level)
- **Level 10-12**: Sangat Sulit (25 soal per level)

## 🎮 Cara Bermain

1. **Mulai Permainan**: Pilih level yang tersedia
2. **Jawab Soal**: Setiap soal memiliki batas waktu
3. **Dapatkan Poin**: 10 poin per jawaban benar
4. **Lulus Level**: Capai skor minimum untuk lanjut ke level berikutnya
5. **Ulangi Jika Gagal**: Bisa mengulang level yang gagal

## 🔧 Setup Development

### Prerequisites
- Node.js 18+
- Akun Supabase
- Git

### Instalasi

1. **Clone Repository**
\`\`\`bash
git clone <repository-url>
cd game-kuis-indonesia
\`\`\`

2. **Install Dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Setup Environment Variables**
Buat file `.env.local`:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

4. **Setup Database**
Jalankan script SQL di Supabase:
- `scripts/create-database.sql`
- `scripts/seed-data.sql`

5. **Run Development Server**
\`\`\`bash
npm run dev
\`\`\`

Buka [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

### Tables
- **users**: Data pem
