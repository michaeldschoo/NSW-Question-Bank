# NSW Question Bank - Stage 1~6 로컬 문제은행 (100% Offline)

> 지속적인 최신 호주 교육 실태 조사 및 수업 자료 수집을 통해서 NSW 학생들의 학교 성적향상 및 우수한 대학에 진학할 수 있도록 학원에서 학생들을 위한 문제은행을 구축

**Perplexity / 외부 API / 클라우드 의존성 0% - 선생님 컴퓨터에서 100% 로컬 실행**

[![NSW Syllabus](https://img.shields.io/badge/NESA-NSW%20Syllabus-blue)](https://educationstandards.nsw.edu.au)
[![Stage](https://img.shields.io/badge/Stage-1~6-green)]()
[![Offline](https://img.shields.io/badge/Run-Offline%20Only-orange)]()

---

## 🚀 10초 실행 방법 (더블클릭만)

1. 이 저장소를 다운로드: `Code > Download ZIP` 또는 `git clone https://github.com/michaeldschoo/NSW-Question-Bank.git`
2. Open `index.html` for English or `index_kr.html` for Korean.
3. 인터넷 없이 동작, 설치 불필요

---

## 📁 폴더 구조

```
NSW-Question-Bank/
├── index.html                      ← English version (default)
├── index_kr.html                   ← Korean version
├── json_to_excel.bat               ← 윈도우: 엑셀로 변환 더블클릭
├── data/
│   ├── problem_bank.json           ← 모든 문항 DB (핵심)
│   ├── problem_bank_editable.xlsx  ← 엑셀 편집본 (자동 생성)
│   ├── collected/                  ← 온라인 수집 결과 (자동 생성)
│   └── updates.md                  ← 최신 NSW 동향 수동 메모
├── tools/
│   ├── excel_to_json.py            ← 엑셀 → JSON 변환기
│   ├── json_to_excel.py            ← JSON → 엑셀 변환기
│   ├── online_collector.py         ← NSW 최신 자료 온라인 수집기
│   ├── requirements.txt
│   └── run_excel_to_json.bat
└── README.md
```

---

## 🔄 핵심 워크플로우: 엑셀로 편집 → JSON으로 저장

### 왜 엑셀이 필요한가?
- 학원 선생님들은 엑셀이 가장 편함
- 프로그램(index.html)은 JSON이 가장 빠름
- 두 세계를 양방향으로 연결

### STEP 1: JSON → 엑셀로 변환 (편집용)

**Windows:**
```
json_to_excel.bat 더블클릭
```

**Mac / Linux:**
```bash
python3 tools/json_to_excel.py
```

→ `data/problem_bank_editable.xlsx` 파일이 생성됨
→ 엑셀 컬럼: `QuestionID | Stage | Subject | Topic | SubType | Difficulty | SkillType | TimeTarget_sec | QuestionStem_KR | QuestionStem_EN | Rule1 | Correct | Explanation`

### STEP 2: 엑셀에서 문항 추가/수정

엑셀에서 자유롭게 편집:
- 행 추가: 새로운 문항 ID (예: MA-S4-001)
- Stage: `Stage 1 (K-2)` ~ `Stage 6 (11-12 HSC)`
- Subject: `수학 | 영어 | 과학 | Thinking Skill | Thinking Ability`
- Difficulty: 1~5 (★ 표시)
- SkillType: `Skill` (단일 기술 훈련) vs `Ability` (융합 전이)

### STEP 3: 엑셀 → JSON으로 저장 (프로그램 반영)

**Windows:**
```
tools/run_excel_to_json.bat 더블클릭
```

**Mac / Linux:**
```bash
python3 tools/excel_to_json.py
# 또는 특정 엑셀 지정
python3 tools/excel_to_json.py data/my_custom.xlsx
```

→ `data/problem_bank.json` 자동 업데이트
→ `index.html` 새로고침하면 바로 반영됨
→ ID 중복은 자동 제거, 신규 문항만 병합

---

## 🌐 온라인 수집 방법 (Perplexity 없이 로컬 수집)

### 개념
Perplexity API를 쓰지 않고, Python `requests`로 NESA/NSW DoE 공개 페이지를 직접 읽어옵니다. 인터넷이 필요하지만, 수집 결과는 로컬에 저장되어 이후에는 오프라인으로 사용.

### 설치 (최초 1회만)
```bash
pip install -r tools/requirements.txt
# 또는
pip install pandas openpyxl requests beautifulsoup4
```

### 실행
```bash
python3 tools/online_collector.py
```

### 동작
1. `https://educationstandards.nsw.edu.au` (NESA) 최신 Syllabus 페이지 체크
2. `https://education.nsw.gov.au` Selective/OC 시험 안내 페이지 체크
3. 결과 저장: `data/collected/nsw_collect_YYYYMMDD_HHMMSS.json`
4. 자동 병합: `data/problem_bank.json`의 `meta.last_online_collect` + `meta.latest_news` 필드에 병합
5. `index.html` 오른쪽 패널 "최신 동향"에 반영

### 수집 사이트 추가 방법
`tools/online_collector.py` 파일 하단 `urls` 리스트에 추가:
```python
urls = [
    "https://educationstandards.nsw.edu.au/...",
    "https://www.acara.edu.au/",  # 추가 예시
]
```

---

## 📊 NSW Selective Thinking Skills 40문항 구조

본 문제은행은 NSW Selective High School Placement Test 공식 스펙을 기준으로 설계:

- **40문항, 40분, 4지선다, 전체 점수의 25%**
- 내부 유형은 NSW DoE 비공개 → 기출 복원 기반 6대 유형으로 분류

| 대분류 | 세부 유형 | 예상 문항수 | 태그 |
|---|---|---|---|
| A. Non-Verbal | Pattern Matrix 3x3 | 5-6 | A1-Matrix |
| A. Non-Verbal | Figure Series | 4-5 | A2-Series |
| A. Non-Verbal | Spatial Reasoning | 3-4 | A3-Spatial |
| B. Verbal | Word Analogy | 5-6 | B1-Analogy |
| B. Verbal | Odd One Out / Code | 4-5 | B2-OddOneOut |
| C. Logical | Syllogism & Conditional | 7-8 | C1-Deduction |

---

## 🎯 Thinking Skill vs Thinking Ability 구분

- **Thinking Skill (기술)**: 가르칠 수 있는 단일 도구 (예: 분류하기, 추론하기) - `Cambridge Thinking Skills`, `Excel Basic Skills` 교재 기준
- **Thinking Ability (능력)**: Skill을 융합해 새로운 상황에 전이하는 역량 - `Selective Thinking Skills 40Q`, `NAPLAN Critical & Creative Thinking` 기준

문제은행에서는 `SkillType` 컬럼으로 구분.

---

## 💻 로컬 개발자용

```bash
# 클론
git clone https://github.com/michaeldschoo/NSW-Question-Bank.git
cd NSW-Question-Bank

# 변환기 테스트
python3 tools/json_to_excel.py
python3 tools/excel_to_json.py

# 온라인 수집 (선택)
python3 tools/online_collector.py
```

---

## 📝 라이선스 및 문의

- 본 프로젝트는 NSW NESA Syllabus를 준수하여 교육 목적으로 제작
- Issues 탭에 문항 오류 제보 가능
- Contact: michaeldschoo (GitHub)

---

## 🔜 Roadmap

- [ ] Stage 6 HSC Band 6 기출 태그 추가
- [ ] 학생 진단 리포트 자동 생성 (약점 처방전)
- [ ] CBT 타이머 모드 (실전 60초/문항)
- [ ] 엑셀 → JSON 자동 변환 GitHub Action
