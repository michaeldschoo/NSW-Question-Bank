# Legacy entry point: use the canonical bilingual build to avoid stale replacements.
from pathlib import Path
import runpy

root = Path(__file__).resolve().parent
runpy.run_path(str(root / "build_bilingual_pages.py"), run_name="__main__")
raise SystemExit(0)


from pathlib import Path
import re
import zipfile

root = Path(__file__).resolve().parent
page = root / "index.html"
kr_page = root / "index_kr.html"
with zipfile.ZipFile(root / "github_push_v3.zip") as archive:
    original = archive.read("index.html").decode("utf-8-sig")

# Restore the Korean app verbatim, changing only its document metadata.
korean = re.sub(r'<html\s+lang="[^"]*"', '<html lang="ko"', original, count=1, flags=re.I)
korean = korean.replace('<title>React Artifact</title>', '<title>NSW Question Bank - 한국어</title>')
kr_page.write_text(korean, encoding="utf-8")
s = original

# English replacements for visible Korean strings.
translations = {
    "수열 ": "sequence ",
    "에서 다음 항은?": " Find the next term?",
    "문장 빈칸: ": "Complete the sentence: ",
    "가장 적절한 어휘는?": "Which word fits best?",
    "실험에서 독립변수는 ": "In an experiment, the independent variable is ",
    "온도": "temperature",
    "농도": "concentration",
    "빛": "light",
    "시간": "time",
    "이고 종속변수는 성장률이다. 통제변수가 아닌 것은?": " and the dependent variable is growth rate. Which variable is not controlled?",
    "모든 Z는 Y이다. 일부 Y는 X이다. 따라서? (Stage ${t} 논리)": "All Z are Y. Some Y are X. Therefore? (Stage ${t} reasoning)",
    "근거": "Evidence",
    "가설": "Hypothesis",
    "결론": "Conclusion",
    "분석": "Analysis",
    "Stage ${t} ${o} 핵심: ${u} 능력을 평가. 정답은 패턴 ${r+1}번 규칙 적용.": "Stage ${t} ${o} core: assess ${u} skills. Apply pattern rule ${r+1} to find the answer.",
    "[Perplexity-확장] Stage ${e} 도형: 한 변이 ${M}cm, 다른 변이 ${s}cm인 직사각형들을 ${u%5+2}개 이어 붙였을 때 전체 둘레의 최댓값은?": "[Perplexity expansion] Stage ${e} geometry: Find the greatest perimeter when ${u%5+2} rectangles with sides ${M} cm and ${s} cm are joined.",
    "직사각형 한 변 ${M}cm, 다른 변 ${s}cm. ${u%5+2}개 연결 시 둘레 최댓값?": "Rectangles have sides ${M} cm and ${s} cm. Find the greatest perimeter when ${u%5+2} are joined.",
    "Stage ${e} 수열: ${M}, ${M+s}, ${M+s*2+u%3}, ...  n번째 항 일반식?": "Stage ${e} sequence: ${M}, ${M+s}, ${M+s*2+u%3}, ... What is the general rule for the nth term?",
    "Stage ${e} 경우의 수: ${M}명 중 ${s%4+2}명 뽑아 일렬로 세우는 경우? (중복 X)": "Stage ${e} counting: How many ways can ${s%4+2} of ${M} people be selected and arranged in a line? (No repeats)",
    "[확장-어휘심화] Stage ${e}: \"${M[0]}\"의 문맥적 반의어가 가장 적절한 문장은? Stage ${e} 수준 독해": "[Extended vocabulary] Stage ${e}: Which sentence uses a contextual antonym of \"${M[0]}\"? Stage ${e} reading level.",
    "밑줄 친 \"${M[0]}\" (${M[1]}) 의 문맥상 동의어는?": "What is the contextual synonym of the underlined \"${M[0]}\" (${M[1]})?",
    "[Perplexity-과학] Stage ${e}: 광합성 실험에서 CO₂ 농도를 ${10+u%8*5}% 높였더니... (Stage ${e} 탐구) 통제해야 할 변인은?": "[Perplexity science] Stage ${e}: In a photosynthesis experiment, CO₂ increased by ${10+u%8*5}%... Which variable should be controlled?",
    "${[\"증발\",\"응축\",\"광합성\",\"호흡\"][u%4]} 과정에서 에너지 변화는?": "${[\"evaporation\",\"condensation\",\"photosynthesis\",\"respiration\"][u%4]}: how does energy change?",
    "코드 패턴 AB${e} → ${e*2}BA, CD${e+1} → ?": "code pattern AB${e} → ${e*2}BA, CD${e+1} → ?",
    "논리: \"모든 P는 Q이다. R은 P가 아니다.\" 타당한 결론은?": "reasoning: \"All P are Q. R is not P.\" Which conclusion is valid?",
    "행렬, 중앙 제외 회전 규칙. 빈칸은? (A1-행렬추론)": "grid with a rotation rule excluding the centre. What belongs in the blank? (A1 matrix reasoning)",
    "Stage ${e} 순서추론: 5명 키 순서, A는 B보다 크고 C보다 작다... (Stage ${e} B1)": "Stage ${e} ordering: Five people are ranked by height; A is taller than B and shorter than C... (Stage ${e} B1)",
    "[Perplexity 다양화] Stage ${e} ${a}: 실전형 변형, 오개념 교정 포인트 포함.": "[Perplexity variation] Stage ${e} ${a}: exam-style variation with misconception-correction points.",
    "Stage ${e} 템플릿 기반: ${a}/${m} 훈련용. 규칙 ${u%7+1} 적용.": "Stage ${e} template-based ${a}/${m} practice. Apply rule ${u%7+1}.",
    "Stage ${E} 이미 200문항 달성 (${_}/200)": "Stage ${E} already has 200 questions (${_}/200)",
    "Perplexity 모드: Stage ${E} ${T}문항 다양화 생성 완료 (모의 응답, API키 ${h?\"감지됨\":\"미입력-시뮬레이션\"}). 총 ${d}/200": "Perplexity mode: Generated ${T} varied Stage ${E} questions (simulated response; API key ${h?\"detected\":\"not entered - simulation\"}). Total: ${d}/200",
    "로컬 템플릿: Stage ${E} ${T}문항 생성 완료. 총 ${d}/200": "Local templates: Generated ${T} Stage ${E} questions. Total: ${d}/200",
    "${E} → 200문항 자동 확장": "${E} → automatically expand to 200 questions",
    "약점 ${Object.keys(F.bySkill)[0]||\"A1\"} 20문항": "20 questions targeting ${Object.keys(F.bySkill)[0]||\"A1\"} weaknesses",
    "NSW 문제은행 처방 리포트": "NSW Question Bank - Learning Recommendations",
    "학생: ${V?.name}": "Student: ${V?.name}",
    "점수: ${F.score}/${F.total}": "Score: ${F.score}/${F.total}",
    "약점: ${Object.entries(F.bySkill).filter(([,Ne])=>Ne.correct/Ne.total<0.6).map(([Ne])=>Ne).join(\", \")||\"없음\"}": "Areas to improve: ${Object.entries(F.bySkill).filter(([,Ne])=>Ne.correct/Ne.total<0.6).map(([Ne])=>Ne).join(\", \")||\"None\"}",
    "처방: ${Object.entries(F.bySkill).filter(([,Ne])=>Ne.correct/Ne.total<0.7).length}개 영역 집중": "Recommendation: Focus on ${Object.entries(F.bySkill).filter(([,Ne])=>Ne.correct/Ne.total<0.7).length} skill areas",
    "처방리포트_${V?.name}_${new Date().toISOString().slice(0,10)}.txt": "recommendations_${V?.name}_${new Date().toISOString().slice(0,10)}.txt",
    "Stage ${V?.stage} 모의고사 2회": "Stage ${V?.stage} - Practice Test 2",
    "안정": "Safer",
    "도전": "Reach",
    "상향": "Ambitious",
}
def translate_literal(match):
    literal = match.group(0)
    # Keep these localized recommendation values because app logic compares them.
    for old, new in translations.items():
        if old not in ("안정", "도전", "상향"):
            literal = literal.replace(old, new)
    return literal

# Limit phrase replacement to template literals; never edit executable code.
s = re.sub(r'`[^`]*`', translate_literal, s, flags=re.S)
s = re.sub(r'<html\s+lang="[^"]*"', '<html lang="en"', s, count=1, flags=re.I)
s = s.replace('<title>React Artifact</title>', '<title>NSW Question Bank - Stage 1-6</title>')
s = s.replace('</body>', '<script>\n' + (root / "english_ui.js").read_text(encoding="utf-8") + '\n</script>\n</body>')
page.write_text(s, encoding="utf-8")

readme = root / "README.md"
text = readme.read_text(encoding="utf-8-sig")
text = text.replace('2. `index.html` 더블클릭 → Chrome에서 바로 열림', '2. Open `index.html` for English or `index_kr.html` for Korean.')
text = text.replace('├── index.html                      ← 메인 프로그램 (이 파일만 열면 됨)', '├── index.html                      ← English version (default)\\n├── index_kr.html                   ← Korean version')
readme.write_text(text, encoding="utf-8")
print("English page translated; Korean page preserved.")
