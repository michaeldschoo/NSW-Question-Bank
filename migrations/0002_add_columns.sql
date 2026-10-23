-- 현재 0001 스키마에 없는 컬럼 추가
ALTER TABLE problems ADD COLUMN question TEXT;
ALTER TABLE problems ADD COLUMN options TEXT;
ALTER TABLE problems ADD COLUMN explanation TEXT;
ALTER TABLE problems ADD COLUMN skill TEXT;
ALTER TABLE problems ADD COLUMN tag TEXT;

-- 중복 방지용 인덱스 (composite dedup)
CREATE INDEX IF NOT EXISTS idx_problems_question ON problems(question);
CREATE INDEX IF NOT EXISTS idx_problems_composite
ON problems(subject, stage, difficulty, question);

-- 기존 데이터 동기화 (q_en/q_kr → question)
UPDATE problems SET question = COALESCE(q_en, q_kr, '') WHERE question IS NULL;
UPDATE problems SET explanation = COALESCE(explanation_kr, '') WHERE explanation IS NULL;
UPDATE problems SET skill = COALESCE(skill_type, 'General') WHERE skill IS NULL;
