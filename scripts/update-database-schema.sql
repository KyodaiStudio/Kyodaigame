-- Tambahkan kolom device_id ke tabel users
ALTER TABLE users ADD COLUMN IF NOT EXISTS device_id VARCHAR(100) UNIQUE;

-- Buat index untuk device_id
CREATE INDEX IF NOT EXISTS idx_users_device_id ON users(device_id);

-- Update trigger untuk users table jika belum ada
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Pastikan trigger ada
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Tambahkan beberapa data dummy jika diperlukan untuk testing
-- INSERT INTO users (device_id, username) VALUES 
-- ('test_device_001', 'Test Player 1'),
-- ('test_device_002', 'Test Player 2')
-- ON CONFLICT (device_id) DO NOTHING;
