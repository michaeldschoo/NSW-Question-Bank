import json
import subprocess

with open('data/problem_bank.json', encoding='utf-8') as f:
    data = json.load(f)

questions = data['questions']
print(f"총 {len(questions)}개 문제 마이그레이션 시작... (중복 ID 해결)")

# 기존 데이터 전체 삭제 - 깨끗하게 다시 시작
subprocess.run(['wrangler', 'd1', 'execute', 'nsw-question-bank-db', '--remote', '--command', "DELETE FROM problems"], shell=True)

# SQL 파일로 생성
sql_lines = []
for i, q in enumerate(questions):
    def esc(v):
        if v is None:
            return "NULL"
        if isinstance(v, int):
            return str(v)
        s = str(v).replace("'", "''")
        return f"'{s}'"
    
    # 여기가 핵심: 인덱스를 붙여서 유니크 ID 생성
    original_id = q.get('id') or f"q-{i}"
    unique_id = f"{original_id}-{i+1}"  # 예: math-y7-001-1, math-y7-001-2 ...
    
    sql = f"""INSERT OR REPLACE INTO problems (id, stage, subject, topic, subtype, difficulty, skill_type, source, time_sec, q_kr, q_en, rule1, rule2, answer, explanation_kr) 
VALUES ({esc(unique_id)}, {esc(q.get('stage'))}, {esc(q.get('subject'))}, {esc(q.get('topic'))}, {esc(q.get('subtype'))}, {q.get('difficulty') or 0}, {esc(q.get('skill_type'))}, {esc(q.get('source'))}, {q.get('time') or q.get('time_sec') or 60}, {esc(q.get('q_kr'))}, {esc(q.get('q_en'))}, {esc(q.get('rule1'))}, {esc(q.get('rule2'))}, {esc(q.get('answer'))}, {esc(q.get('explanation_kr'))});"""
    sql_lines.append(sql)

# 파일 저장
with open('migrations/seed_problems.sql', 'w', encoding='utf-8') as out:
    out.write("\n".join(sql_lines))

print(f"seed_problems.sql 생성 완료 ({len(sql_lines)}개 유니크 ID)")

# D1에 실행
print("D1 원격 실행 중...")
result = subprocess.run(['wrangler', 'd1', 'execute', 'nsw-question-bank-db', '--remote', '--file=./migrations/seed_problems.sql'], shell=True)

if result.returncode == 0:
    print("✅ 완료!")
    # 확인
    subprocess.run(['wrangler', 'd1', 'execute', 'nsw-question-bank-db', '--remote', '--command', "SELECT COUNT(*) as count FROM problems"], shell=True)
else:
    print("❌ 오류 발생")