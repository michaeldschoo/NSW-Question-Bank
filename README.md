# NSW Question Bank - Stage 1~6 문제은행 (로컬 실행 및 웹 배포)

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

## 🌐 웹 배포 현황 및 Cloudflare 안내 (2026-10-20 기준)

이 저장소에는 정적 웹앱(`index.html`, `index_kr.html`)과 GitHub Pages 배포 워크플로가 있습니다. `main`에 푸시되면 `.github/workflows/deploy-pages.yml`이 실행되도록 설정되어 있지만, 실제 GitHub Pages 배포 성공 여부와 저장소 공개 범위는 아직 확인하지 못했습니다.

### 현재까지 확인된 상태

- Cloudflare Pages 연결 및 Cloudflare Access 정책은 아직 설정되지 않았습니다.
- Cloudflare에서 저장소를 선택한 뒤 표시된 화면은 **Workers 설정**이며, Pages 설정 화면이라고 확인된 것은 아닙니다. 화면의 뒤로 가기를 누르면 저장소 선택 화면으로 돌아간다고 보고되었습니다.
- 화면에 표시된 Workers 빌드 명령은 `npx wrangler deploy`, 미리보기 명령은 `npx wrangler preview`입니다. 하지만 저장소 루트에서 Wrangler 설정 파일(`wrangler.jsonc`/`wrangler.toml`)과 별도 정적 배포 폴더는 확인되지 않았습니다. 따라서 이 명령으로 바로 배포하지 말고, Cloudflare에 이 저장소의 정적 파일을 어떻게 배포해야 하는지 확인하세요.
- GitHub Pages 워크플로는 `_site`에 `index.html`, `index_kr.html`, `data/`를 복사해 배포합니다. 그러므로 `data/problem_bank.json`은 배포 결과에 포함됩니다.
- 허용할 이메일 주소: `elmundochoo@gmail.com`. 실제 Access 정책은 아직 만들어지지 않았습니다. 배포 후 운영 주소와 미리보기 주소 각각에 접근 제한이 적용되는지 확인해야 합니다.

### Cloudflare에 문의할 내용

> GitHub 저장소 `michaeldschoo/NSW-Question-Bank`의 `main` 브랜치에 있는 정적 웹앱을 배포하려고 합니다. 저장소에는 `index.html`, `index_kr.html`, `data/`가 있으며, 루트에 `wrangler.jsonc`/`wrangler.toml` 또는 `package.json`은 없습니다. GitHub에서 저장소를 선택한 후 Pages가 아니라 Workers 설정 폼이 표시됩니다. 이 저장소를 Cloudflare Pages로 연결하는 정확한 대시보드 경로를 안내해 주세요. Pages가 아니라 Workers를 사용해야 한다면, 필요한 Wrangler 설정, 정적 자산 디렉터리, 빌드/배포 명령을 알려주세요. 배포 후 `elmundochoo@gmail.com`만 운영 및 미리보기 사이트에 접근하도록 Cloudflare Access를 설정하고 싶습니다. 문항 데이터가 공개되지 않도록 해야 합니다.

**주의:** 저장소 공개 범위는 아직 확인되지 않았습니다. 저장소가 공개라면 저장소 파일과 `data/problem_bank.json`을 누구나 볼 수 있습니다. 비공개 저장소라도 공개 사이트에 포함해 배포한 파일은 사이트 방문자가 접근할 수 있으므로, 비공개 데이터라고 가정하지 마세요. 비밀 토큰이나 비밀번호를 저장소 또는 브라우저 코드에 넣지 마세요.

---

## 💾 문항 데이터 저장 및 백업

- `data/problem_bank.json`은 저장소에 있는 문항 데이터 파일입니다. 엑셀 변환 도구와 Git으로 관리할 수 있습니다.
- 현재 웹앱에는 **JSON 내보내기** 기능이 표시되며, 이를 통해 내려받은 파일은 사용자가 별도로 보관해야 합니다.
- 코드 검색에서 `localStorage`/`sessionStorage` 기반 저장이나 GitHub 자동 동기화는 확인되지 않았습니다. 웹앱에서 진행한 세션·진단 등 실행 중 생성 데이터는 브라우저 메모리에만 있을 수 있으므로, 새로고침/창 닫기 전 내보내고 백업하세요.
- Cloudflare Pages/Workers는 정적 파일을 배포하는 것만으로 앱의 새 데이터를 GitHub 저장소에 자동 저장하지 않습니다. 영구 저장·동기화가 필요하면 별도의 인증된 백엔드와 데이터 저장소를 설계해야 합니다.
- 로컬에서 문항 원본을 수정할 때는 이 README의 엑셀 ↔ JSON 워크플로를 사용하고, 변경된 `data/problem_bank.json`을 검토한 뒤 GitHub에 커밋·푸시하세요.

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
