-- users table: stores user registration and login information
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  date_of_birth TEXT,
  address TEXT,
  organization_name TEXT,
  organization_id TEXT,
  license_number TEXT,
  specialty TEXT,
  institution TEXT,
  research_area TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- documents table: stores metadata only (no sensitive genetic data)
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TEXT NOT NULL,
  checksum_hash TEXT,
  size_bytes INTEGER
);

CREATE INDEX IF NOT EXISTS idx_documents_session ON documents(session_id);

-- Insert default system admin user (if not exists)
INSERT OR IGNORE INTO users (
    id, 
    email, 
    password, 
    role, 
    first_name, 
    last_name, 
    status,
    created_at,
    updated_at
) VALUES (
    'sysadmin_default',
    'sysadmin@privagene.com',
    'admin123',
    'system_admin',
    'System',
    'Administrator',
    'active',
    datetime('now'),
    datetime('now')
);

-- TEMPORARY, delete later
-- Insert test patient user
INSERT OR IGNORE INTO users (
    id, 
    email, 
    password, 
    role, 
    first_name, 
    last_name, 
    status,
    created_at,
    updated_at
) VALUES (
    'patient_test_1',
    'patient@test.com',
    'test123',
    'patient',
    'Test',
    'Patient',
    'active',
    datetime('now'),
    datetime('now')
);

-- Insert test hospital user
INSERT OR IGNORE INTO users (
    id, 
    email, 
    password, 
    role, 
    first_name, 
    last_name, 
    organization_name,
    license_number,
    status,
    created_at,
    updated_at
) VALUES (
    'hospital_test_1',
    'hospital@test.com',
    'hospital123',
    'hospital',
    'Test',
    'Hospital',
    'City General Hospital',
    'LIC123456',
    'active',
    datetime('now'),
    datetime('now')
);

-- Insert test researcher user
INSERT OR IGNORE INTO users (
    id, 
    email, 
    password, 
    role, 
    first_name, 
    last_name, 
    institution,
    research_area,
    status,
    created_at,
    updated_at
) VALUES (
    'researcher_test_1',
    'researcher@test.com',
    'researcher123',
    'researcher',
    'Test',
    'Researcher',
    'Research University',
    'Genomics',
    'active',
    datetime('now'),
    datetime('now')
);

-- risk_assessments table: stores patient risk assessment results
CREATE TABLE IF NOT EXISTS risk_assessments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  overall_risk REAL NOT NULL,
  disease_name TEXT,
  match_count INTEGER,
  matched_genes TEXT,
  risk_percentage REAL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_risk_assessments_user ON risk_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_created ON risk_assessments(created_at DESC);