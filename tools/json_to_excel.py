
import json
import pandas as pd
from pathlib import Path

# 사용법: python tools/json_to_excel.py
# data/problem_bank.json -> data/problem_bank_editable.xlsx 생성

def convert_json_to_excel(json_path, excel_path):
    print(f"[변환] {json_path} -> {excel_path}")
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    questions = data.get("questions", [])
    if not questions:
        print("questions가 비어있습니다.")
        return
    df = pd.DataFrame(questions)
    # 엑셀 편집 친화적 컬럼 순서
    cols = ["id","stage","subject","topic","subtype","difficulty","skill_type","source","time","q_kr","q_en","rule1","rule2","answer","explanation_kr"]
    cols = [c for c in cols if c in df.columns] + [c for c in df.columns if c not in cols]
    df = df[cols]
    # 컬럼명 한글화 (편집용)
    rename_map = {
        "id":"QuestionID","stage":"Stage","subject":"Subject","topic":"Topic","subtype":"SubType",
        "difficulty":"Difficulty","skill_type":"SkillType","source":"Source","time":"TimeTarget_sec",
        "q_kr":"QuestionStem_KR","q_en":"QuestionStem_EN","rule1":"Rule1","rule2":"Rule2",
        "answer":"Correct","explanation_kr":"Explanation"
    }
    df.rename(columns=rename_map, inplace=True)
    with pd.ExcelWriter(excel_path, engine="openpyxl") as writer:
        df.to_excel(writer, sheet_name="Sample_30Q_DB", index=False)
        # 분석 시트도 생성
        analysis_df = pd.DataFrame([
            ["A. Non-Verbal","Pattern Matrix","5-6","행/열 회전","복합규칙","A1-Matrix"],
            ["A. Non-Verbal","Figure Series","4-5","회전,추가","순차추적","A2-Series"],
            ["B. Verbal","Word Analogy","5-6","관계 정의","정확한 관계","B1-Analogy"],
            ["C. Logical","Deduction","7-8","전제 결합","논리 격자","C1-Deduction"],
        ], columns=["대분류","세부유형","예상문항수","핵심규칙","난도포인트","태그"])
        analysis_df.to_excel(writer, sheet_name="Thinking_Skills_Analysis", index=False)
    print(f"완료! {excel_path} 생성됨 - 엑셀에서 편집 후 excel_to_json.py로 다시 변환하세요.")

if __name__ == "__main__":
    base_dir = Path(__file__).parent.parent
    json_path = base_dir / "data" / "problem_bank.json"
    excel_path = base_dir / "data" / "problem_bank_editable.xlsx"
    convert_json_to_excel(json_path, excel_path)
