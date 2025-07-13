-- Buat tabel questions dengan struktur yang benar
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  option_a VARCHAR(500) NOT NULL,
  option_b VARCHAR(500) NOT NULL,
  option_c VARCHAR(500) NOT NULL,
  option_d VARCHAR(500) NOT NULL,
  correct_answer INTEGER NOT NULL CHECK (correct_answer IN (0, 1, 2, 3)),
  explanation TEXT,
  level_id INTEGER NOT NULL CHECK (level_id BETWEEN 1 AND 12),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buat index untuk performa
CREATE INDEX IF NOT EXISTS idx_questions_level_id ON questions(level_id);
CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(is_active);

-- Hapus data lama jika ada
DELETE FROM questions;

-- Insert soal contoh untuk testing
INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, level_id) VALUES
('Apa ibu kota Indonesia?', 'Jakarta', 'Bandung', 'Surabaya', 'Medan', 0, 'Jakarta adalah ibu kota Indonesia sejak kemerdekaan.', 1),
('Siapa presiden pertama Indonesia?', 'Soekarno', 'Soeharto', 'Habibie', 'Megawati', 0, 'Soekarno adalah presiden pertama Republik Indonesia.', 1),
('Kapan Indonesia merdeka?', '17 Agustus 1945', '17 Agustus 1944', '17 Agustus 1946', '17 Agustus 1947', 0, 'Indonesia merdeka pada tanggal 17 Agustus 1945.', 1),
('Apa nama mata uang Indonesia?', 'Rupiah', 'Ringgit', 'Baht', 'Peso', 0, 'Mata uang Indonesia adalah Rupiah.', 1),
('Berapa jumlah pulau di Indonesia?', 'Lebih dari 17.000', 'Sekitar 10.000', 'Sekitar 5.000', 'Sekitar 20.000', 0, 'Indonesia memiliki lebih dari 17.000 pulau.', 1);

-- Tampilkan hasil
SELECT 'Questions table created and seeded successfully!' as status;
SELECT level_id, COUNT(*) as question_count FROM questions GROUP BY level_id ORDER BY level_id;
