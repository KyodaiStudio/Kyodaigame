-- Hapus data lama jika ada
DELETE FROM questions WHERE level_id BETWEEN 1 AND 12;

-- Insert soal untuk Level 1 (Mudah) - 10 soal
INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, level_id) VALUES
('Apa ibu kota Indonesia?', 'Jakarta', 'Bandung', 'Surabaya', 'Medan', 0, 'Jakarta adalah ibu kota Indonesia sejak kemerdekaan.', 1),
('Siapa presiden pertama Indonesia?', 'Soekarno', 'Soeharto', 'Habibie', 'Megawati', 0, 'Soekarno adalah presiden pertama Republik Indonesia.', 1),
('Kapan Indonesia merdeka?', '17 Agustus 1945', '17 Agustus 1944', '17 Agustus 1946', '17 Agustus 1947', 0, 'Indonesia merdeka pada tanggal 17 Agustus 1945.', 1),
('Apa nama mata uang Indonesia?', 'Rupiah', 'Ringgit', 'Baht', 'Peso', 0, 'Mata uang Indonesia adalah Rupiah.', 1),
('Berapa jumlah pulau di Indonesia?', 'Lebih dari 17.000', 'Sekitar 10.000', 'Sekitar 5.000', 'Sekitar 20.000', 0, 'Indonesia memiliki lebih dari 17.000 pulau.', 1),
('Apa nama lagu kebangsaan Indonesia?', 'Indonesia Raya', 'Garuda Pancasila', 'Bagimu Negeri', 'Tanah Airku', 0, 'Lagu kebangsaan Indonesia adalah Indonesia Raya.', 1),
('Siapa yang menciptakan lagu Indonesia Raya?', 'Wage Rudolf Supratman', 'Ismail Marzuki', 'Gesang', 'Cornel Simanjuntak', 0, 'Lagu Indonesia Raya diciptakan oleh Wage Rudolf Supratman.', 1),
('Apa nama bendera Indonesia?', 'Merah Putih', 'Sang Saka', 'Dwiwarna', 'Pusaka', 0, 'Bendera Indonesia disebut Merah Putih.', 1),
('Berapa jumlah sila dalam Pancasila?', '5', '4', '6', '7', 0, 'Pancasila terdiri dari 5 sila.', 1),
('Apa nama rumah adat Jawa?', 'Joglo', 'Gadang', 'Tongkonan', 'Honai', 0, 'Rumah adat Jawa adalah Joglo.', 1);

-- Insert soal untuk Level 2 (Mudah) - 10 soal
INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, level_id) VALUES
('Siapa wakil presiden pertama Indonesia?', 'Mohammad Hatta', 'Adam Malik', 'Try Sutrisno', 'Hamzah Haz', 0, 'Mohammad Hatta adalah wakil presiden pertama Indonesia.', 2),
('Apa nama organisasi pemuda yang didirikan pada 1908?', 'Budi Utomo', 'Jong Java', 'Indische Partij', 'Sarekat Islam', 0, 'Budi Utomo didirikan pada tahun 1908.', 2),
('Kapan Sumpah Pemuda diikrarkan?', '28 Oktober 1928', '28 Oktober 1927', '28 Oktober 1929', '28 Oktober 1930', 0, 'Sumpah Pemuda diikrarkan pada 28 Oktober 1928.', 2),
('Apa nama pahlawan wanita dari Aceh?', 'Cut Nyak Dhien', 'Kartini', 'Dewi Sartika', 'Christina Martha Tiahahu', 0, 'Cut Nyak Dhien adalah pahlawan wanita dari Aceh.', 2),
('Siapa yang dijuluki Bapak Pendidikan Nasional?', 'Ki Hajar Dewantara', 'Mohammad Hatta', 'Soekarno', 'Tan Malaka', 0, 'Ki Hajar Dewantara dijuluki Bapak Pendidikan Nasional.', 2),
('Apa nama kerajaan Hindu pertama di Indonesia?', 'Kutai', 'Majapahit', 'Sriwijaya', 'Mataram', 0, 'Kerajaan Kutai adalah kerajaan Hindu pertama di Indonesia.', 2),
('Di pulau mana Candi Borobudur berada?', 'Jawa', 'Sumatra', 'Bali', 'Kalimantan', 0, 'Candi Borobudur berada di Pulau Jawa.', 2),
('Apa nama selat yang memisahkan Jawa dan Sumatra?', 'Selat Sunda', 'Selat Malaka', 'Selat Bali', 'Selat Lombok', 0, 'Selat Sunda memisahkan Jawa dan Sumatra.', 2),
('Siapa pendiri kerajaan Majapahit?', 'Raden Wijaya', 'Ken Arok', 'Hayam Wuruk', 'Gajah Mada', 0, 'Raden Wijaya adalah pendiri kerajaan Majapahit.', 2),
('Apa nama tarian tradisional dari Bali?', 'Kecak', 'Saman', 'Pendet', 'Legong', 2, 'Tari Pendet adalah salah satu tarian tradisional dari Bali.', 2);

-- Insert soal untuk Level 3 (Mudah) - 10 soal
INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, level_id) VALUES
('Apa nama gunung tertinggi di Indonesia?', 'Puncak Jaya', 'Gunung Kerinci', 'Gunung Semeru', 'Gunung Rinjani', 0, 'Puncak Jaya adalah gunung tertinggi di Indonesia.', 3),
('Berapa jumlah provinsi di Indonesia saat ini?', '38', '34', '36', '40', 0, 'Indonesia memiliki 38 provinsi.', 3),
('Apa nama danau terbesar di Indonesia?', 'Danau Toba', 'Danau Sentani', 'Danau Maninjau', 'Danau Singkarak', 0, 'Danau Toba adalah danau terbesar di Indonesia.', 3),
('Siapa yang menulis novel Laskar Pelangi?', 'Andrea Hirata', 'Pramoedya Ananta Toer', 'Tere Liye', 'Dee Lestari', 0, 'Novel Laskar Pelangi ditulis oleh Andrea Hirata.', 3),
('Apa nama makanan khas Gudeg berasal dari?', 'Yogyakarta', 'Solo', 'Semarang', 'Surabaya', 0, 'Gudeg adalah makanan khas Yogyakarta.', 3),
('Kapan Konferensi Asia Afrika diadakan?', '1955', '1954', '1956', '1957', 0, 'Konferensi Asia Afrika diadakan pada tahun 1955.', 3),
('Apa nama senjata tradisional dari Jawa?', 'Keris', 'Mandau', 'Badik', 'Rencong', 0, 'Keris adalah senjata tradisional dari Jawa.', 3),
('Siapa pelukis terkenal Indonesia yang melukis "Penangkapan Diponegoro"?', 'Raden Saleh', 'Affandi', 'Basuki Abdullah', 'Sudjojono', 0, 'Raden Saleh melukis "Penangkapan Diponegoro".', 3),
('Apa nama tari tradisional dari Aceh?', 'Saman', 'Kecak', 'Pendet', 'Jaipong', 0, 'Tari Saman adalah tari tradisional dari Aceh.', 3),
('Berapa lama masa penjajahan Belanda di Indonesia?', '3,5 abad', '2,5 abad', '4 abad', '3 abad', 0, 'Belanda menjajah Indonesia selama sekitar 3,5 abad.', 3);
