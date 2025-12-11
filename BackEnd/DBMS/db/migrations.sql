-- ===================================
-- Users Table
-- ===================================
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
  research_consent INTEGER DEFAULT 0,  -- NEW: 0 = no consent, 1 = consented
  status TEXT DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_research_consent ON users(research_consent);  -- NEW: Index for filtering consented users

-- Add research_consent column to existing users table if it doesn't exist
-- SQLite doesn't support IF NOT EXISTS for ALTER TABLE, so we handle this gracefully
-- This will fail silently if column already exists when run through migrations
-- ALTER TABLE users ADD COLUMN research_consent INTEGER DEFAULT 0;

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


-- ===================================
-- SEED DISEASES FOR TEST USERS
-- ===================================

-- Insert default system admin user (if not exists)
INSERT OR IGNORE INTO users (
    id, 
    email, 
    password, 
    role, 
    first_name, 
    last_name, 
    status,
    research_consent,
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
    0,
    datetime('now'),
    datetime('now')
);

-- Insert default security admin user (if not exists)
INSERT OR IGNORE INTO users (
    id, 
    email, 
    password, 
    role, 
    first_name, 
    last_name, 
    status,
    research_consent,
    created_at,
    updated_at
) VALUES (
    'secadmin_default',
    'security@privagene.com',
    'security123',
    'security_admin',
    'Security',
    'Administrator',
    'active',
    0,
    datetime('now'),
    datetime('now')
);

-- Insert test patient user (with research consent)
INSERT OR IGNORE INTO users (
    id, 
    email, 
    password, 
    role, 
    first_name, 
    last_name,
    date_of_birth,
    status,
    research_consent,
    created_at,
    updated_at
) VALUES (
    'patient_test_1',
    'patient@test.com',
    'test123',
    'patient',
    'Test',
    'Patient',
    '1989-09-23',
    'active',
    1,
    datetime('now'),
    datetime('now')
);

INSERT OR IGNORE INTO users (
    id, 
    email, 
    password, 
    role, 
    first_name, 
    last_name,
    date_of_birth,
    status,
    research_consent,
    created_at,
    updated_at
) VALUES (
    'patient_test_2',
    'john.doe@email.com',
    'patient123',
    'patient',
    'John',
    'Doe',
    '2004-02-10',
    'active',
    1,
    datetime('now'),
    datetime('now')
);

INSERT OR IGNORE INTO users (
    id, 
    email, 
    password, 
    role, 
    first_name, 
    last_name,
    date_of_birth,
    status,
    research_consent,
    created_at,
    updated_at
) VALUES (
    'patient_test_3',
    'jane.smith@email.com',
    'patient123',
    'patient',
    'Jane',
    'Smith',
    '1995-12-03',
    'active',
    1,
    datetime('now'),
    datetime('now')
);

INSERT OR IGNORE INTO users (
    id, 
    email, 
    password, 
    role, 
    first_name, 
    last_name,
    date_of_birth,
    phone,
    status,
    research_consent,
    created_at,
    updated_at
) VALUES (
    'patient_test_4',
    'mike.wong@email.com',
    'patient123',
    'patient',
    'Mike',
    'Wong',
    '1985-09-23',
    '99995555',
    'active',
    1,
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
    phone,
    organization_name,
    license_number,
    status,
    research_consent,
    created_at,
    updated_at
) VALUES (
    'hospital_test_1',
    'hospital@test.com',
    'hospital123',
    'hospital',
    'Test',
    'Hospital',
    '+ 65 88886666',
    'City General Hospital',
    'LIC123456',
    'active',
    0,
    datetime('now'),
    datetime('now')
);

INSERT OR IGNORE INTO users (
    id, 
    email, 
    password, 
    role, 
    organization_name,
    status,
    research_consent,
    created_at,
    updated_at
) VALUES (
    'hospital_admin_1',
    'cghadmin@sgh.com.sg',
    'admin123',
    'hospital_admin',
    'City General Hospital',
    'active',
    0,
    datetime('now'),
    datetime('now')
);


INSERT OR IGNORE INTO users (
    id, 
    email, 
    password, 
    role, 
    organization_name,
    status,
    research_consent,
    created_at,
    updated_at
) VALUES (
    'hospital_admin_2',
    'sghadmin@sgh.com.sg',
    'admin123',
    'hospital_admin',
    'Singapore General Hospital',
    'active',
    0,
    datetime('now'),
    datetime('now')
);

INSERT OR IGNORE INTO users (
    id, 
    email, 
    password, 
    role, 
    first_name, 
    last_name,
    phone,
    organization_name,
    license_number,
    status,
    research_consent,
    created_at,
    updated_at
) VALUES (
    'hospital_test_2',
    'dr.chen@sgh.com.sg',
    'hospital123',
    'hospital',
    'Test',
    'Hospital',
    '+65 91234567',
    'Singapore General Hospital',
    'LIC654321',
    'active',
    0,
    datetime('now'),
    datetime('now')
);

INSERT OR IGNORE INTO users (
    id, 
    email, 
    password, 
    role, 
    first_name, 
    last_name,
    phone,
    organization_name,
    license_number,
    status,
    research_consent,
    created_at,
    updated_at
) VALUES (
    'hospital_test_3',
    'dr.wong@sgh.com.sg',
    'hospital123',
    'hospital',
    'Bob',
    'Wong',
    '+65 92345678',
    'Singapore General Hospital',
    'LIC654555',
    'active',
    0,
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
    research_consent,
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
    0,
    datetime('now'),
    datetime('now')
);

-- ===================================
-- Risk Assessments Table
-- ===================================
-- risk_assessments table: stores patient risk assessment results
CREATE TABLE IF NOT EXISTS risk_assessments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  overall_risk REAL NOT NULL,
  disease_id TEXT,
  match_count INTEGER,
  matched_genes TEXT,
  risk_percentage REAL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_risk_assessments_user ON risk_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_created ON risk_assessments(created_at DESC);

-- ===================================
-- Diseases Table
-- ===================================
-- diseases table: stores disease records for hospital PSI (renamed from gene_entries)
CREATE TABLE IF NOT EXISTS diseases (
  id TEXT PRIMARY KEY,
  hospital_id TEXT NOT NULL,
  disease_name TEXT NOT NULL,
  disease_code TEXT NOT NULL,
  description TEXT,
  constant REAL NOT NULL DEFAULT 50.0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (hospital_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_diseases_hospital ON diseases(hospital_id);
CREATE INDEX IF NOT EXISTS idx_diseases_disease_code ON diseases(disease_code);
CREATE INDEX IF NOT EXISTS idx_diseases_created ON diseases(created_at DESC);

-- disease_genes table: stores individual gene symbols linked to a disease
CREATE TABLE IF NOT EXISTS disease_genes (
  id TEXT PRIMARY KEY,
  disease_id TEXT NOT NULL, -- Foreign key linking to diseases (renamed from gene_entry_id)
  gene_symbol TEXT NOT NULL,
  hash_value TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  
  -- Ensures that a specific gene symbol is not duplicated for the same disease
  UNIQUE (disease_id, gene_symbol), 
  
  FOREIGN KEY (disease_id) REFERENCES diseases(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_disease_genes_disease_id ON disease_genes(disease_id);
CREATE INDEX IF NOT EXISTS idx_disease_genes_symbol ON disease_genes(gene_symbol);
CREATE INDEX IF NOT EXISTS idx_disease_genes_hash ON disease_genes(hash_value);

-- ===================================
-- SEED DISEASES FOR TEST HOSPITAL
-- ===================================

-- Disease 1: Breast Cancer
INSERT OR IGNORE INTO diseases (
    id,
    hospital_id,
    disease_name,
    disease_code,
    description,
    constant,
    created_at,
    updated_at
) VALUES (
    'disease_breast_cancer_1',
    'hospital_test_1',
    'Breast Cancer',
    'BRCA-2024',
    'Hereditary breast cancer associated with BRCA1 and BRCA2 mutations',
    75.0,
    datetime('now'),
    datetime('now')
);

-- Disease 1 Genes
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_brca1_1', 'disease_breast_cancer_1', 'BRCA1', 
        'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_brca2_1', 'disease_breast_cancer_1', 'BRCA2', 
        'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_tp53_1', 'disease_breast_cancer_1', 'TP53', 
        'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4', datetime('now'), datetime('now'));


-- Disease 2: Type 2 Diabetes
INSERT OR IGNORE INTO diseases (
    id,
    hospital_id,
    disease_name,
    disease_code,
    description,
    constant,
    created_at,
    updated_at
) VALUES (
    'disease_diabetes_1',
    'hospital_test_1',
    'Type 2 Diabetes',
    'T2D-2024',
    'Genetic risk factors for type 2 diabetes mellitus',
    60.0,
    datetime('now'),
    datetime('now')
);

-- Disease 2 Genes
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_tcf7l2_1', 'disease_diabetes_1', 'TCF7L2', 
        'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_pparg_1', 'disease_diabetes_1', 'PPARG', 
        'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_fto_1', 'disease_diabetes_1', 'FTO', 
        'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_kcnj11_1', 'disease_diabetes_1', 'KCNJ11', 
        'a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8', datetime('now'), datetime('now'));


-- Disease 3: Alzheimer's Disease
INSERT OR IGNORE INTO diseases (
    id,
    hospital_id,
    disease_name,
    disease_code,
    description,
    constant,
    created_at,
    updated_at
) VALUES (
    'disease_alzheimers_1',
    'hospital_test_1',
    'Alzheimer''s Disease',
    'ALZ-2024',
    'Genetic predisposition markers for late-onset Alzheimer''s disease',
    80.0,
    datetime('now'),
    datetime('now')
);

-- Disease 3 Genes
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_apoe_1', 'disease_alzheimers_1', 'APOE', 
        'd77e33d56f7a3e7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_psen1_1', 'disease_alzheimers_1', 'PSEN1', 
        'e88f44e67a8b4f8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_psen2_1', 'disease_alzheimers_1', 'PSEN2', 
        'f99a55f78b9c5a9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_app_1', 'disease_alzheimers_1', 'APP', 
        'a00b66a89c0d6b0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e', datetime('now'), datetime('now'));


-- Disease 4: Cardiovascular Disease
INSERT OR IGNORE INTO diseases (
    id,
    hospital_id,
    disease_name,
    disease_code,
    description,
    constant,
    created_at,
    updated_at
) VALUES (
    'disease_cardiovascular_1',
    'hospital_test_1',
    'Cardiovascular Disease',
    'CVD-2024',
    'Genetic markers associated with heart disease and stroke risk',
    65.0,
    datetime('now'),
    datetime('now')
);

-- Disease 4 Genes
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_apoe_2', 'disease_cardiovascular_1', 'APOE', 
        'd77e33d56f7a3e7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_mthfr_1', 'disease_cardiovascular_1', 'MTHFR', 
        'b11c77b90d1e7c1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_ace_1', 'disease_cardiovascular_1', 'ACE', 
        'c22d88c01e2f8d2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_ldlr_1', 'disease_cardiovascular_1', 'LDLR', 
        'd33e99d12f3a9e3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_pcsk9_1', 'disease_cardiovascular_1', 'PCSK9', 
        'e44f00e23a4b0f4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c', datetime('now'), datetime('now'));


-- Disease 5: Lung Cancer
INSERT OR IGNORE INTO diseases (
    id,
    hospital_id,
    disease_name,
    disease_code,
    description,
    constant,
    created_at,
    updated_at
) VALUES (
    'disease_lung_cancer_1',
    'hospital_test_1',
    'Lung Cancer',
    'LUNG-2024',
    'Genetic susceptibility markers for lung cancer development',
    70.0,
    datetime('now'),
    datetime('now')
);

-- Disease 5 Genes
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_egfr_1', 'disease_lung_cancer_1', 'EGFR', 
        'f55a11f34b5c1a5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_kras_1', 'disease_lung_cancer_1', 'KRAS', 
        'a66b22a45c6d2b6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_alk_1', 'disease_lung_cancer_1', 'ALK', 
        'b77c33b56d7e3c7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_tp53_2', 'disease_lung_cancer_1', 'TP53', 
        'c00d66c89e0f6d0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_ros1_1', 'disease_lung_cancer_1', 'ROS1', 
        'c88d44c67e8f4d8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a', datetime('now'), datetime('now'));


-- Disease 6: Inflammatory Conditions
INSERT OR IGNORE INTO diseases (
    id,
    hospital_id,
    disease_name,
    disease_code,
    description,
    constant,
    created_at,
    updated_at
) VALUES (
    'disease_inflammatory_1',
    'hospital_test_1',
    'Chronic Inflammatory Disease',
    'INFLAM-2024',
    'Genetic markers for chronic inflammation and autoimmune conditions',
    55.0,
    datetime('now'),
    datetime('now')
);

-- Disease 6 Genes
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_tnf_1', 'disease_inflammatory_1', 'TNF', 
        'd99e55d78f9a5e9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_il6_1', 'disease_inflammatory_1', 'IL6', 
        'e00f66e89a0b6f0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_il1b_1', 'disease_inflammatory_1', 'IL1B', 
        'f11a77f90b1c7a1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_crp_1', 'disease_inflammatory_1', 'CRP', 
        'a22b88a01c2d8b2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e', datetime('now'), datetime('now'));


-- Disease 7: Obesity Risk
INSERT OR IGNORE INTO diseases (
    id,
    hospital_id,
    disease_name,
    disease_code,
    description,
    constant,
    created_at,
    updated_at
) VALUES (
    'disease_obesity_1',
    'hospital_test_1',
    'Obesity Susceptibility',
    'OBS-2024',
    'Genetic factors contributing to obesity and metabolic disorders',
    50.0,
    datetime('now'),
    datetime('now')
);

-- Disease 7 Genes
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_fto_2', 'disease_obesity_1', 'FTO', 
        'f33a99f12b3c9a3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_mc4r_1', 'disease_obesity_1', 'MC4R', 
        'b33c99b12d3e9c3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_lepr_1', 'disease_obesity_1', 'LEPR', 
        'c44d00c23e4f0d4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_pomc_1', 'disease_obesity_1', 'POMC', 
        'd55e11d34f5a1e5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_adrb3_1', 'disease_obesity_1', 'ADRB3', 
        'e66f22e45a6b2f6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c', datetime('now'), datetime('now'));


-- Disease 8: Colorectal Cancer
INSERT OR IGNORE INTO diseases (
    id,
    hospital_id,
    disease_name,
    disease_code,
    description,
    constant,
    created_at,
    updated_at
) VALUES (
    'disease_colorectal_1',
    'hospital_test_1',
    'Colorectal Cancer',
    'CRC-2024',
    'Hereditary colorectal cancer syndrome genetic markers',
    72.0,
    datetime('now'),
    datetime('now')
);

-- Disease 8 Genes
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_apc_1', 'disease_colorectal_1', 'APC', 
        'f77a33f56b7c3a7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_mlh1_1', 'disease_colorectal_1', 'MLH1', 
        'a88b44a67c8d4b8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_msh2_1', 'disease_colorectal_1', 'MSH2', 
        'b99c55b78d9e5c9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_tp53_3', 'disease_colorectal_1', 'TP53', 
        'c00d66c89e0f6d0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_smad4_1', 'disease_colorectal_1', 'SMAD4', 
        'c99d55c78e9f5d9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a', datetime('now'), datetime('now'));


-- ===================================
-- Audit Logs Table
-- ===================================
-- audit_logs table: stores all system activity for security and compliance
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  user_id TEXT,
  user_email TEXT,
  user_role TEXT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'success',
  severity TEXT DEFAULT 'info',
  details TEXT,
  session_id TEXT,
  created_at TEXT NOT NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes for common audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_status ON audit_logs(status);
CREATE INDEX IF NOT EXISTS idx_audit_severity ON audit_logs(severity);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_logs(resource_type, resource_id);


-- ===================================
-- SEED RISK ASSESSMENTS
-- 30 past PSI risk assessments over the past 6 months (July 2025 - December 2025)
-- Distributed across the 4 seeded patients
-- ===================================

-- Patient 1: patient_test_1 (Test Patient) - 8 assessments
-- July 2025
INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_001', 'patient_test_1', 50.0, 'disease_breast_cancer_1', 2, '["BRCA1","TP53"]', 50.0, '2025-07-05T10:30:00.000Z');

INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_002', 'patient_test_1', 45.0, 'disease_diabetes_1', 3, '["TCF7L2","FTO","KCNJ11"]', 45.0, '2025-07-05T10:30:15.000Z');

-- August 2025
INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_003', 'patient_test_1', 40.0, 'disease_alzheimers_1', 2, '["APOE","PSEN1"]', 40.0, '2025-08-12T14:20:00.000Z');

INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_004', 'patient_test_1', 26.0, 'disease_cardiovascular_1', 2, '["MTHFR","LDLR"]', 26.0, '2025-08-12T14:20:30.000Z');

-- October 2025
INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_005', 'patient_test_1', 14.0, 'disease_lung_cancer_1', 1, '["TP53"]', 14.0, '2025-10-03T09:15:00.000Z');

INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_006', 'patient_test_1', 20.0, 'disease_obesity_1', 2, '["FTO","MC4R"]', 20.0, '2025-10-03T09:15:45.000Z');

-- November 2025
INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_007', 'patient_test_1', 28.8, 'disease_colorectal_1', 2, '["APC","TP53"]', 28.8, '2025-11-18T16:45:00.000Z');

INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_008', 'patient_test_1', 27.5, 'disease_inflammatory_1', 2, '["TNF","IL6"]', 27.5, '2025-11-18T16:45:30.000Z');


-- Patient 2: patient_test_2 (John Doe) - 8 assessments
-- July 2025
INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_009', 'patient_test_2', 75.0, 'disease_breast_cancer_1', 3, '["BRCA1","BRCA2","TP53"]', 75.0, '2025-07-20T11:00:00.000Z');

INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_010', 'patient_test_2', 60.0, 'disease_diabetes_1', 4, '["TCF7L2","PPARG","FTO","KCNJ11"]', 60.0, '2025-07-20T11:00:20.000Z');

-- August 2025
INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_011', 'patient_test_2', 60.0, 'disease_alzheimers_1', 3, '["APOE","PSEN1","APP"]', 60.0, '2025-08-25T13:30:00.000Z');

-- September 2025
INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_012', 'patient_test_2', 39.0, 'disease_cardiovascular_1', 3, '["APOE","ACE","PCSK9"]', 39.0, '2025-09-10T10:45:00.000Z');

INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_013', 'patient_test_2', 28.0, 'disease_lung_cancer_1', 2, '["EGFR","KRAS"]', 28.0, '2025-09-10T10:45:30.000Z');

-- October 2025
INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_014', 'patient_test_2', 30.0, 'disease_obesity_1', 3, '["FTO","MC4R","LEPR"]', 30.0, '2025-10-22T15:20:00.000Z');

-- November 2025
INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_015', 'patient_test_2', 43.2, 'disease_colorectal_1', 3, '["APC","MLH1","TP53"]', 43.2, '2025-11-05T08:30:00.000Z');

INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_016', 'patient_test_2', 41.25, 'disease_inflammatory_1', 3, '["TNF","IL6","CRP"]', 41.25, '2025-11-05T08:30:45.000Z');


-- Patient 3: patient_test_3 (Jane Smith) - 7 assessments
-- July 2025
INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_017', 'patient_test_3', 25.0, 'disease_breast_cancer_1', 1, '["BRCA2"]', 25.0, '2025-07-15T09:00:00.000Z');

-- August 2025
INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_018', 'patient_test_3', 30.0, 'disease_diabetes_1', 2, '["TCF7L2","PPARG"]', 30.0, '2025-08-08T11:15:00.000Z');

INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_019', 'patient_test_3', 20.0, 'disease_alzheimers_1', 1, '["APOE"]', 20.0, '2025-08-08T11:15:30.000Z');

-- September 2025
INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_020', 'patient_test_3', 52.0, 'disease_cardiovascular_1', 4, '["APOE","MTHFR","ACE","LDLR"]', 52.0, '2025-09-22T14:00:00.000Z');

-- October 2025
INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_021', 'patient_test_3', 0.0, 'disease_lung_cancer_1', 0, '[]', 0.0, '2025-10-15T16:30:00.000Z');

INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_022', 'patient_test_3', 10.0, 'disease_obesity_1', 1, '["FTO"]', 10.0, '2025-10-15T16:30:30.000Z');

-- December 2025
INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_023', 'patient_test_3', 14.4, 'disease_colorectal_1', 1, '["MSH2"]', 14.4, '2025-12-01T10:00:00.000Z');


-- Patient 4: patient_test_4 (Mike Wong) - 7 assessments
-- July 2025
INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_024', 'patient_test_4', 50.0, 'disease_breast_cancer_1', 2, '["BRCA1","BRCA2"]', 50.0, '2025-07-28T12:00:00.000Z');

INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_025', 'patient_test_4', 15.0, 'disease_diabetes_1', 1, '["FTO"]', 15.0, '2025-07-28T12:00:30.000Z');

-- September 2025
INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_026', 'patient_test_4', 80.0, 'disease_alzheimers_1', 4, '["APOE","PSEN1","PSEN2","APP"]', 80.0, '2025-09-05T09:30:00.000Z');

INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_027', 'patient_test_4', 13.0, 'disease_cardiovascular_1', 1, '["APOE"]', 13.0, '2025-09-05T09:30:45.000Z');

-- October 2025
INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_028', 'patient_test_4', 42.0, 'disease_lung_cancer_1', 3, '["EGFR","ALK","ROS1"]', 42.0, '2025-10-30T11:45:00.000Z');

-- November 2025
INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_029', 'patient_test_4', 40.0, 'disease_obesity_1', 4, '["FTO","MC4R","LEPR","POMC"]', 40.0, '2025-11-25T14:15:00.000Z');

INSERT OR IGNORE INTO risk_assessments (id, user_id, overall_risk, disease_id, match_count, matched_genes, risk_percentage, created_at)
VALUES ('seed_risk_030', 'patient_test_4', 57.6, 'disease_colorectal_1', 4, '["APC","MLH1","MSH2","SMAD4"]', 57.6, '2025-11-25T14:15:30.000Z');