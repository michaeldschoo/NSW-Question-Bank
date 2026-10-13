
import pandas as pd
import json
import sys
from pathlib import Path

# 사용법: python tools/excel_to_json.py data/NSW_Selective_Thinking_Skills_40Q_Analysis.xlsx
# 또는 그냥 python tools/excel_to_json.py 하면 data 폴더의 모든 xlsx를 변환

def convert_excel_to_json(excel_path, json_path):
    print(f"[변환] {excel_path} -> {json_path}")
    # Sheet2 Sample_30Q_DB 읽기, 없으면 첫 시트
    try:
        xls = pd.ExcelFile(excel_path)
        sheet_name = "Sample_30Q_DB" if "Sample_30Q_DB" in xls.sheet_names else xls.sheet_names[0]
        df = pd.read_excel(excel_path, sheet_name=sheet_name)
    except Exception as e:
        print(f"엑셀 읽기 실패: {e}")
        return

    questions = []
    for _, row in df.iterrows():
        # 빈 행 스킵
        if pd.isna(row.iloc[0]):
            continue
        q = {
            "id": str(row.get("QuestionID") or row.get("ID") or row.iloc[0]),
            "stage": str(row.get("Stage") or "Stage 3 (5-6)"),
            "subject": str(row.get("Subject") or row.get("Domain") or "Thinking Skill"),
            "topic": str(row.get("Topic") or row.get("SubType") or ""),
            "subtype": str(row.get("SubType") or row.get("subtype") or ""),
            "difficulty": int(row.get("Difficulty") or row.get("difficulty") or 3),
            "skill_type": str(row.get("SkillTag") or row.get("skill_type") or "Skill").replace("A1-","").replace("B1-","")[:6] or "Skill",
            "source": str(row.get("Source") or "Selective"),
            "time": int(row.get("TimeTarget_sec") or row.get("time") or 60),
            "q_kr": str(row.get("QuestionStem_KR") or row.get("q_kr") or ""),
            "q_en": str(row.get("QuestionStem_EN") or row.get("q_en") or ""),
            "rule1": str(row.get("Rule1") or ""),
            "rule2": str(row.get("Rule2") or ""),
            "answer": str(row.get("Correct") or row.get("answer") or ""),
            "explanation_kr": str(row.get("Explanation") or row.get("explanation_kr") or "")
        }
        # Skill/Ability 정규화
        st = str(row.get("skill_type") or row.get("SkillTag") or "").lower()
        if "ability" in st:
            q["skill_type"] = "Ability"
        else:
            q["skill_type"] = "Skill"
        questions.append(q)

    # 기존 problem_bank.json 로드해서 병합
    json_path = Path(json_path)
    if json_path.exists():
        with open(json_path, "r", encoding="utf-8") as f:
            existing = json.load(f)
        # ID 중복 제거 후 병합
        existing_ids = {q["id"] for q in existing.get("questions", [])}
        new_qs = [q for q in questions if q["id"] not in existing_ids]
        existing["questions"].extend(new_qs)
        print(f"기존 {len(existing_ids)}개 + 신규 {len(new_qs)}개 = 총 {len(existing['questions'])}개")
        out = existing
    else:
        out = {"meta":{"version":"local-v1.0"},"questions":questions}

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print(f"완료! {json_path} 저장됨")

if __name__ == "__main__":
    base_dir = Path(__file__).parent.parent
    if len(sys.argv) > 1:
        excel_path = Path(sys.argv[1])
        json_path = base_dir / "data" / "problem_bank.json"
    else:
        # data 폴더에서 가장 최근 xlsx 자동 찾기
        data_dir = base_dir / "data"
        xlsx_files = list(data_dir.glob("*.xlsx"))
        if not xlsx_files:
            print("data 폴더에 xlsx 파일이 없습니다. 엑셀 파일 경로를 인자로 넘기세요.")
            sys.exit(1)
        excel_path = max(xlsx_files, key=lambda p: p.stat().st_mtime)
        json_path = data_dir / "problem_bank.json"
    convert_excel_to_json(excel_path, json_path)
