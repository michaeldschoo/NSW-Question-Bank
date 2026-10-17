# NSW 로컬 문제은행 - 100% Offline Version

Perplexity API / 외부 서버 / 클라우드 의존성 없음.

## 실행 방법 (더블클릭만)
1. 이 폴더 전체를 USB나 선생님 컴퓨터에 복사
2. index.html 더블클릭 → 브라우저에서 바로 열림 (Chrome 권장)
3. 인터넷 연결 없이 동작

## GitHub Pages 배포

`main` 브랜치에 푸시하면 GitHub Actions가 사이트를 자동 배포합니다.
배포 주소: https://michaeldschoo.github.io/NSW-Question-Bank/

## 폴더 구조
NSW_Local_ProblemBank/
├── index.html            ← 메인 프로그램 (이 파일만 열면 됨)
├── data/
│   ├── problem_bank.json ← 모든 문항 DB (여기만 수정하면 문항 추가)
│   └── updates.md        ← 최신 NSW 교육 동향 직접 메모 (선택)
└── README.md

## 문항 추가 방법
data/problem_bank.json 파일을 메모장/VSCode로 열어 questions 배열에 추가:
{
  "id":"MA-S4-001",
  "stage":"Stage 4 (7-8)",
  "subject":"수학",
  "topic":"대수",
  "subtype":"방정식",
  "difficulty":3,
  "skill_type":"Skill",
  "source":"HSC",
  "time":90,
  "q_kr":"문제 한글",
  "q_en":"Question English",
  "rule1":"Working Mathematically",
  "answer":"B",
  "explanation_kr":"해설"
}

## 이전 버전과 차이점
- Perplexity API 연동 제거: 모든 로직이 브라우저 JS에서 동작
- 도메인 업로드 제거: container:// 링크가 아닌 로컬 파일 시스템
- CSV 내보내기: 서버 없이 브라우저에서 직접 다운로드

## 다음 단계 (선택)
- data/problem_bank.json을 엑셀로 변환해 학원 선생님들이 공동 편집
- Stage 6 HSC는 Band 6 기출 태그 추가

---
## 신규 추가: 엑셀 ↔ JSON 변환기 + 온라인 수집기

### 폴더 tools/ 안에 3개 스크립트
1. json_to_excel.py : JSON -> 엑셀 (편집용)
2. excel_to_json.py : 엑셀 -> JSON (저장용)
3. online_collector.py : NSW 최신 자료 온라인 수집

### 사용 흐름 (선생님용)
STEP 1: 엑셀로 편집
  더블클릭: json_to_excel.bat  (또는 python tools/json_to_excel.py)
  → data/problem_bank_editable.xlsx 생성됨
  → 엑셀에서 문항 추가/수정 (한글 컬럼)

STEP 2: JSON으로 저장
  더블클릭: tools/run_excel_to_json.bat (또는 python tools/excel_to_json.py)
  → data/problem_bank.json 자동 업데이트
  → index.html 새로고침하면 바로 반영

STEP 3: (선택) 온라인 수집
  python tools/online_collector.py
  → NESA, NSW DoE 최신 페이지 수집
  → data/collected/ 폴더에 json 저장
  → problem_bank.json meta.latest_news에 자동 병합

### 설치 (최초 1회)
pip install -r tools/requirements.txt
또는
pip install pandas openpyxl requests beautifulsoup4

### 왜 이렇게 만들었나?
- 학원 선생님들은 엑셀이 편함 → 엑셀로 편집
- 프로그램은 JSON이 편함 → JSON으로 실행
- 두 방식을 양방향으로 연결 + 온라인 수집은 별도 옵션으로 분리하여 Perplexity 의존성 제거
