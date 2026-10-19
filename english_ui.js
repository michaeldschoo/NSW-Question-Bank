(() => {
  const pairs = [
    ["학생 로그인 (로컬 세션)","Student Login (Local Session)"],["비밀번호 없음 · 브라우저 메모리에만 저장 · 새로고침 시 초기화","No password · Browser memory only · Resets on refresh"],
    ["학생 이름","Student Name"],["학년 (Year)","Year Level"],["Stage (자동 매핑)","Stage (Automatic Mapping)"],["로컬 세션 시작","Start Local Session"],["로그아웃","Log Out"],
    ["진단 개요","Assessment Overview"],["진단 시작 (20문항)","Start Assessment (20 Questions)"],["학생 진단","Student Assessment"],["진단 기록","Assessment History"],["최근 진단 기록 (메모리)","Recent Assessments (Memory)"],
    ["문제은행에서 20문항 적응형 추출","20 adaptive questions selected from the question bank"],["과목 혼합 (Math/English/Science/Thinking)","Mixed subjects (Math/English/Science/Thinking)"],["문항당 60초 타이머","60-second timer per question"],["종료 후 약점 처방 리포트 자동 생성","A learning recommendations report is generated at the end"],
    ["200문항 자동 확장 제어판","200-Question Expansion Dashboard"],["Stage별 200문항 목표, 로컬 템플릿 + Perplexity 모의 연동","200-question goal per Stage; local templates + simulated Perplexity"],["대상 Stage","Target Stage"],["생성 모드","Generation Mode"],
    ["A) 로컬 템플릿 모드 (기본)","A) Local Template Mode (Default)"],["규칙 기반, API 불필요, Math/English/Science/Thinking 템플릿","Rule-based; no API required; Math/English/Science/Thinking templates"],
    ["B) Perplexity API 모드 (선택)","B) Perplexity API Mode (Optional)"],["API 키 입력 시 더 다양한 문항 시뮬레이션","More varied question simulation with an API key"],["pplx-... (모의 입력, 실제 전송 없음)","pplx-... (simulation only; nothing is sent)"],
    ["전체 진행 현황","Overall Progress"],["미리보기 (최근 12문항)","Preview (Last 12 Questions)"],["전체과목","All Subjects"],["이전","Previous"],["다음","Next"],["건너뛰기 →","Skip →"],
    ["전체 진행 현황","Overall Progress"],["완료","Complete"],["진행 중","In Progress"],["총합","Total"],["전체과목","All Subjects"],["로컬 템플릿 모드","Local Template Mode"],
    ["로그인 정보는 서버로 전송되지 않습니다. 진단 기록도 메모리 전용입니다.","Login details are never sent to a server. Assessment records stay in memory only."],
    ["최신 동향","Latest Updates"],["현재 Stage ","Current Stage "],["문항 수: ","Question count: "],["문항","questions"],["문제은행","Question Bank"],["NSW 문제은행","NSW Question Bank"],
    ["학생:","Student:"],["점수:","Score:"],["약점:","Areas to improve:"],["처방:","Recommendation:"],["없음","None"],["정답","Correct"],["오답","Incorrect"],["무응답","Unanswered"],["선택:","Selected:"],
    ["TXT 내보내기 (로컬)","Export TXT (Local)"],["JSON 내보내기 (로컬 파일)","Export JSON (Local File)"],["내보내기","Export"],["다시 진단","Retake Assessment"],
    ["학습 로드맵","Learning Roadmap"],["1주차","Week 1"],["2주차","Week 2"],["3주차","Week 3"],["4주차","Week 4"],["오답 재도전 + 해설 정독","Retry Incorrect Answers + Review Explanations"],["HSC Band 6 연계 학습","HSC Band 6 Study Pathway"],
    ["A1-도형추론","A1-Visual Reasoning"],["B1-수리논리","B1-Mathematical Reasoning"],["C3-수열패턴","C3-Sequence Patterns"],["A2-언어추론","A2-Verbal Reasoning"],["C1-독해력","C1-Reading Comprehension"],["C2-어휘추론","C2-Vocabulary Reasoning"],["C2-과학탐구","C2-Scientific Inquiry"],["B1-인과추론","B1-Causal Reasoning"],["A1-자료해석","A1-Data Interpretation"],["B2-코드패턴","B2-Code Patterns"],["B1-논리연역","B1-Logical Deduction"],["A1-행렬추론","A1-Matrix Reasoning"],
    ["안정","Safer"],["도전","Reach"],["상향","Ambitious"],
    ["NSW 문제은행 처방 리포트","NSW Question Bank - Learning Recommendations"],["처방 리포트","Learning Recommendations"],["처방 예시","Recommendation Examples"],["처방","Recommendation"],["약점","Areas to Improve"],["진단 개요","Assessment Overview"],["진단 시작 (20문항)","Start Assessment (20 Questions)"],["진단 대기 중 · 처방 리포트 미리보기 구조","Assessment pending · report preview"],["학생 진단","Student Assessment"],["진단 기록","Assessment History"],["최근 진단 기록 (메모리)","Recent Assessments (Memory)"],["학습 로드맵","Learning Roadmap"],
    ["문제은행에서 20문항 적응형 추출","20 adaptive questions selected from the question bank"],["과목 혼합 (Math/English/Science/Thinking)","Mixed subjects (Math/English/Science/Thinking)"],["문항당 60초 타이머","60-second timer per question"],["종료 후 약점 처방 리포트 자동 생성","A learning recommendations report is generated at the end"],["로그인 정보는 서버로 전송되지 않습니다. 진단 기록도 메모리 전용입니다.","Login details are never sent to a server. Assessment records stay in memory only."],
    ["HSC Band 6 대학 진학 연계 분석","HSC Band 6 University Pathway Analysis"],["문제은행 점수 → 예상 HSC 정렬 점수 → ATAR 추정 → NSW 주요 대학 컷오프로 이어지는 진학 시뮬레이션. Stage 6 데이터 기반, 2025-2026 입시 컷 하드코딩.","Pathway simulation: question-bank score → estimated HSC scaled mark → estimated ATAR → NSW university cut-offs. Stage 6-based; 2025–26 estimates."],["Band 6 기준","Band 6 Benchmark"],["과목 스케일링 (UAC)","Subject Scaling (UAC)"],["현재 학생 예측","Current Student Estimate"],["예상 정렬 점수 / 밴드","Estimated Scaled Mark / Band"],["ATAR 추정 (문제은행 기반)","ATAR Estimate (Question-Bank Based)"],["진학 가능성","Admission Prospects"],["일반 진입","General Entry"],["모의 연계","Simulated Pathway"],["출처: UAC Guide 2025","Source: UAC Guide 2025"],["내 ATAR 대비","Compared with My ATAR"],["ATAR 사다리 · 목표 대학까지 거리","ATAR Ladder · Distance to Target University"],["현재 Stage ","Current Stage "],["문항 수: ","Question count: "],["Stage 6 전용","Stage 6 only"],["✓ HSC 대상","✓ HSC candidate"],["· Stage 6 권장","· Stage 6 recommended"],["출처: UAC Guide 2025","Source: UAC Guide 2025"],
    ["수열","sequence"],["문장 빈칸:","Complete the sentence:"],["가장 적절한 어휘는?","Which word fits best?"],["실험에서 독립변수는","The independent variable is"],["이고 종속변수는 성장률이다. 통제변수가 아닌 것은?","and the dependent variable is growth rate. Which variable is not controlled?"],["모든 Z는 Y이다. 일부 Y는 X이다. 따라서?","All Z are Y. Some Y are X. What follows?"],["논리:","Reasoning:"],["타당한 결론은?","Which conclusion is valid?"],["모든 P는 Q이다. R은 P가 아니다.","All P are Q. R is not P."],["경우의 수:","Counting:"],["명 중","people: How many ways can"],["명 뽑아 일렬로 세우는 경우? (중복 X)","be selected and arranged in a line? (No repeats)"],["순서추론:","Ordering:"],["명 키 순서, A는 B보다 크고 C보다 작다...","people ranked by height; A is taller than B and shorter than C..."],["코드 패턴","Code pattern"],["행렬추론","Matrix Reasoning"],["Stage ${V?.stage} 모의고사 2회","Stage ${V?.stage} - Practice Test 2"],["처방리포트_","recommendations_"],["없음","None"],["없음","None"],
    ["확장-어휘심화","Extended Vocabulary"],["의 문맥적 반의어가 가장 적절한 문장은?","Which sentence uses a contextual antonym of"],["수준 독해","reading level"],["밑줄 친","underlined"],["의 문맥상 동의어는?","What is the contextual synonym of"],["광합성 실험에서 CO₂ 농도를","In a photosynthesis experiment, CO₂ concentration increased by"],["높였더니...","..."],["증발","evaporation"],["응축","condensation"],["광합성","photosynthesis"],["호흡","respiration"],["과정에서 에너지 변화는?","process, how does energy change?"],["모든 P는 Q이다. R은 P가 아니다.","All P are Q. R is not P."],["타당한 결론은?","Which conclusion is valid?"],["도형:","Geometry:"],["직사각형","rectangle"],["도형","geometry"],["다른 변이","other side"],["연결 시 둘레 최댓값?","Find the greatest perimeter when joined?"],
    ["실험군 크기","Control group size"],["측정 도구","Measurement tool"],["가설 자체","The hypothesis itself"],["환경 조건","Environmental conditions"],["모든 Z는 X이다","All Z are X"],["일부 Z는 X일 수 있다","Some Z may be X"],["Z는 X가 아니다","Z are not X"],["판단 불가","Cannot be determined"],["독립변수만 변경","Change only the independent variable"],["종속변수만 측정","Measure only the dependent variable"],["통제변수 유지 실패","Fail to keep control variables constant"],["가설 재설정","Revise the hypothesis"],["흡열 반응","Endothermic reaction"],["발열 반응","Exothermic reaction"],["에너지 불변","Energy remains constant"],["물질 소멸","Matter disappears"],["R은 Q이다","R is Q"],["R은 Q가 아닐 수도 있다","R may not be Q"],["R은 Q가 아니다","R is not Q"],["A 2등","A is second"],["B 1등","B is first"],["C 3등","C is third"],["결정 불가","Cannot be determined"],
  ];
  const translate = value => {
    for (const [ko, en] of pairs) value = value.split(ko).join(en);
    return value;
  };
  const visit = node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const next = translate(node.nodeValue);
      if (next !== node.nodeValue) node.nodeValue = next;
    } else if (node.nodeType === Node.ELEMENT_NODE && !/^(SCRIPT|STYLE)$/.test(node.tagName)) {
      for (const attr of ["placeholder", "title", "aria-label"]) if (node.hasAttribute(attr)) node.setAttribute(attr, translate(node.getAttribute(attr)));
      node.childNodes.forEach(visit);
    }
  };
  const app = document.getElementById("root");
  if (!app) return;
  visit(app);
  new MutationObserver(records => records.forEach(record => {
    if (record.type === "characterData") visit(record.target);
    else record.addedNodes.forEach(visit);
  })).observe(app, {subtree:true, childList:true, characterData:true});
})();
