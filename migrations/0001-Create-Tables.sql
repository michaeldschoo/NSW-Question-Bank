
-- Migration: 0001_create_tables.sql
-- Cloudflare D1 마이그레이션

CREATE TABLE IF NOT EXISTS problems (
  id TEXT PRIMARY KEY,
  stage TEXT,
  subject TEXT,
  topic TEXT,
  subtype TEXT,
  difficulty INTEGER,
  skill_type TEXT,
  source TEXT,
  time_sec INTEGER,
  q_kr TEXT,
  q_en TEXT,
  rule1 TEXT,
  rule2 TEXT,
  answer TEXT,
  explanation_kr TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT,
  year_level TEXT,
  target_uni TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attempts (
  id TEXT PRIMARY KEY,
  student_id TEXT,
  problem_id TEXT,
  is_correct BOOLEAN,
  time_spent INTEGER,
  attempt_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(student_id) REFERENCES students(id),
  FOREIGN KEY(problem_id) REFERENCES problems(id)
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id TEXT PRIMARY KEY,
  student_id TEXT,
  weak_topic TEXT,
  weak_rate REAL,
  prescribed_count INTEGER,
  generated_worksheet_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_problems_stage ON problems(stage);
CREATE INDEX IF NOT EXISTS idx_problems_subject ON problems(subject);
CREATE INDEX IF NOT EXISTS idx_attempts_student ON attempts(student_id);
