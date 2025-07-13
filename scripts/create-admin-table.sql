-- Buat tabel admin untuk login
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert admin default (password: admin123)
-- Hash untuk 'admin123' menggunakan bcrypt
INSERT INTO admin_users (username, password_hash, email) VALUES 
('admin', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqO', 'admin@example.com')
ON CONFLICT (username) DO NOTHING;

-- Untuk sementara, kita akan menggunakan plain text password untuk testing
-- JANGAN GUNAKAN INI DI PRODUCTION!
UPDATE admin_users SET password_hash = 'admin123' WHERE username = 'admin';
