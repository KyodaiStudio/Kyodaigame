-- Script untuk memastikan database schema benar
-- Jalankan script ini di Supabase SQL Editor

-- 1. Cek apakah kolom device_id sudah ada
DO $$
BEGIN
    -- Tambahkan kolom device_id jika belum ada
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'device_id'
    ) THEN
        ALTER TABLE users ADD COLUMN device_id VARCHAR(100);
        RAISE NOTICE 'Kolom device_id berhasil ditambahkan';
    ELSE
        RAISE NOTICE 'Kolom device_id sudah ada';
    END IF;
END $$;

-- 2. Tambahkan constraint UNIQUE untuk device_id
DO $$
BEGIN
    -- Cek apakah constraint sudah ada
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'users' AND constraint_name = 'users_device_id_key'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT users_device_id_key UNIQUE (device_id);
        RAISE NOTICE 'Constraint UNIQUE untuk device_id berhasil ditambahkan';
    ELSE
        RAISE NOTICE 'Constraint UNIQUE untuk device_id sudah ada';
    END IF;
END $$;

-- 3. Buat index untuk performa
CREATE INDEX IF NOT EXISTS idx_users_device_id ON users(device_id);

-- 4. Verifikasi struktur tabel
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- 5. Tampilkan constraint yang ada
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'users';
