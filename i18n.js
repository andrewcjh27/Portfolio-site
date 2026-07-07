/* ══════════════════════════════════════════════════════════════════════
   i18n.js — site-wide English ⇄ Korean toggle
   ──────────────────────────────────────────────────────────────────────
   • Language choice lives in localStorage ('site-lang') and applies on
     every page load, so the toggle persists as you navigate.
   • Korean strings live only in this file (the KO map below). English is
     read straight from the existing DOM, so the original site is the
     source of truth and is never edited destructively — toggling back to
     English restores exactly what was authored.
   • Zero layout/style changes: only text content, placeholders, and a
     single <html class="lang-ko"> hook are touched.

   How elements opt in (add these attributes in the HTML):
     data-i18n="key"        → swaps textContent
     data-i18n-html="key"   → swaps innerHTML (use when text has <br>, &amp;, …)
     data-i18n-ph="key"     → swaps the placeholder attribute
   JS-generated text calls  i18n.pick(englishString, koreanString).
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var STORAGE_KEY = 'site-lang';

  /* ── Korean dictionary ─────────────────────────────────────────────
     Keyed by the same string used in data-i18n on the element. If a key
     is missing here, the element simply stays in English. */
  var KO = {
    /* Shared nav + footer */
    'nav.about': '소개',
    'nav.resume': '이력서',
    'nav.experience': '경력',
    'nav.more': '더보기',
    'nav.categories': '카테고리',
    'nav.design': '디자인',
    'nav.photography': '사진',
    'nav.cafes': '카페',
    'nav.codes': '코드',
    'nav.soccer': '축구',
    'nav.feature.title': '사진 &rarr;',
    'nav.feature.desc': '도시와 물, 그리고 고요한 순간들을 담아가는 비주얼 다이어리.',
    'nav.footer.resume': '이력서',
    'nav.footer.contact': '연락처',
    'footer.email': '이메일',
    'footer.pdf': 'PDF',

    /* ── index.html ── */
    'index.title': '최준호',
    'index.hero.first': '준호',
    'index.hero.last': '최',
    'index.hero.sub': '이 사이트는 제 작업물과 취미, 그리고 일상 사진을 모아두는 공간입니다',
    'index.about.title': '소개',
    'index.about.p1': '저는 UC 버클리에서 데이터 사이언스와 통합생물학, 그리고 디자인을 공부하는 학생 최준호입니다. 저는 이 분야들이 겹치는 지점 &mdash; 데이터로 창의적인 결정을 이끌고, 디자인으로 기술을 인간적으로 만드는 지점에 끌립니다. 그런 호기심은 제 프로젝트에도 드러납니다. 서울에서 가장 짧은 카페 투어 경로를 짜는 최적화 프로그램을 만들거나, 조기축구 팀의 포메이션을 실시간으로 코치해 주는 AI를 학습시키는 일처럼요.',
    'index.about.p2': '학업 외에는 방문한 장소들을 사진으로 담고, 눈에 띄는 카페를 하나하나 평가하고, 제 방을 어떻게 꾸밀지 다시 고민하며 시간을 보냅니다. 이 사이트는 그 모든 것 &mdash; 제가 공부하는 것들, 제가 만드는 도구들, 제가 아끼는 것들을 모아둔 곳입니다. 무언가 눈에 들어온다면, 언제든 편하게 연락 주세요.',
    'index.values.heading': '저의 가치는 ...',
    'index.value1.name': '창의성',
    'index.value1.desc': '여러 분야의 아이디어를 잇고, 예상치 못한 곳에서 디자인을 발견하는 것을 즐깁니다.',
    'index.value2.name': '성장',
    'index.value2.desc': '코드, 데이터, 디자인을 넘나들며 늘 배우고, 만들고, 다듬어 갑니다.',
    'index.value3.name': '이타심',
    'index.value3.desc': '제가 만드는 것이 기술적으로 흥미로운 데 그치지 않고, 다른 사람에게 진짜 쓸모 있기를 바랍니다.',
    'index.explore.title': '저의 세계를 둘러보세요.',
    'index.explore.sub': '디자인, 사진, 코드, 카페 투어, 그리고 더 많은 것들 &mdash; 한곳에 모았습니다.',
    'index.pill.codes': '코드',
    'index.pill.designs': '디자인',
    'index.pill.photos': '사진',
    'index.pill.cafes': '카페',
    'index.pill.soccer': '축구',
    'index.help.heading': '이런 것들을 도와드릴 수 있어요 ...',
    'index.contact.title': '연락하기',
    'index.contact.sub': '프로젝트든, 궁금한 점이든, 그냥 인사든 &mdash; 편하게 연락 주세요.',

    /* ── resume.html (English side labels; Korean resume is separate) ── */
    'resume.title': '이력서 | 최준호',

    /* Page <title>s */
    'exp.pageTitle': '경력 | 최준호',
    'cat.uiux.pageTitle': 'UI / UX | 디자인 | 최준호',
    'cat.3d.pageTitle': '3D / 모션 | 디자인 | 최준호',
    'cat.art.pageTitle': '아트 | 디자인 | 최준호',

    /* ── experience.html ── */
    'exp.hint': '스크롤하거나 클릭해서 둘러보세요',
    'exp.footer.resume': '이력서',
    'exp.0.company': 'Urban<br>Conga',
    'exp.0.role': 'UX 디자인<br>컨설턴트',
    'exp.0.summary': '사용 패턴을 포착하고 해석하는 인터랙티브 공공 설치물 시스템을 기획하여, 행동 가시성의 제약을 개선했습니다.',
    'exp.1.company': 'Mozilla<br>Firefox',
    'exp.1.role': 'IT<br>컨설턴트',
    'exp.1.summary': 'React + Vite로 50개 이상의 탭을 실시간 추적하는 성능 확장 프로그램을 제작했습니다. 사용자 조사를 진행하고, 그 결과를 Figma UI로 옮겨 12명 팀과 함께 출시했습니다.',
    'exp.2.company': 'Asan<br>Medical',
    'exp.2.role': 'AI 연구<br>인턴',
    'exp.2.summary': '간세포암 분류를 위한 3D 영상 파이프라인을 구축했습니다. SHAP와 Grad-CAM으로 모델의 판단을 임상의가 이해할 수 있게 만들었고, 다기관 챌린지에서 7위를 기록했습니다.',
    'exp.3.company': 'Braven',
    'exp.3.role': 'UI/UX<br>컨설턴트',
    'exp.3.summary': '8명 팀과 함께 Braven의 설문, 벤치마킹, 어피니티 데이터를 종합해 &mdash; 참여도와 사용성을 끌어올린 모바일 앱 개선을 이끌었습니다.',
    'exp.4.company': 'Biosolution',
    'exp.4.role': '연구<br>인턴',
    'exp.4.summary': 'PCR, FACS, HPLC 등 마이크로RNA 어세이를 설계해 골관절염 타깃을 규명했습니다. 세포 배양과 생체 내 실험을 수행하며 CAR-T 세포 프로그램을 지원했습니다.',
    'exp.5.company': 'US 8th<br>Army',
    'exp.5.role': '부사관',
    'exp.5.summary': '40명 규모의 이중언어 소대를 이끌었습니다. ACFT 교육을 번역·전달해 96% 합격률을 달성했고, 미 육군 표창장을 수상했습니다.',
    'exp.6.company': 'UCSF',
    'exp.6.role': '원격의료<br>코디네이터',
    'exp.6.summary': '원격의료 이용 데이터를 종단 분석해, 임상 전달 체계와 자원 배분을 다시 설계하게 한 병목 지점을 밝혀냈습니다.',

    /* Experience detail panels */
    'exp.p0.tag': '2026년 1월 / 2026년 6월',
    'exp.p0.title': 'Urban Conga',
    'exp.p0.role': 'UX 디자인 컨설턴트',
    'exp.p0.org': 'Invention Corps of Berkeley &middot; 버클리, CA',
    'exp.p1.tag': '2025년 8월 / 2026년 2월',
    'exp.p1.title': 'Mozilla Firefox',
    'exp.p1.role': 'IT 컨설턴트',
    'exp.p1.org': 'Invention Corps of Berkeley &middot; 버클리, CA',
    'exp.p2.tag': '2025년 5월 / 2025년 8월',
    'exp.p2.title': '서울아산병원',
    'exp.p2.role': 'AI 연구 인턴',
    'exp.p2.org': 'AMC · 서울',
    'exp.p3.tag': '2025년 1월 / 2025년 5월',
    'exp.p3.title': 'Braven',
    'exp.p3.role': 'UI/UX 컨설턴트',
    'exp.p3.org': 'Invention Corps of Berkeley &middot; 버클리, CA',
    'exp.p4.tag': '2024년 5월 / 2024년 8월',
    'exp.p4.title': 'Biosolution',
    'exp.p4.role': '연구 인턴',
    'exp.p4.org': 'Biosolution Co., Ltd.',
    'exp.p5.tag': '2022년 9월 / 2024년 3월',
    'exp.p5.title': '미 8군',
    'exp.p5.role': '부사관 · 소대장',
    'exp.p5.org': '미 8군, 2사단 HHBN',
    'exp.p6.tag': '2021년 8월 / 2022년 5월',
    'exp.p6.title': 'UCSF',
    'exp.p6.role': '원격의료 코디네이터',
    'exp.p6.org': '캘리포니아대학교 샌프란시스코',
    'exp.workflow.heading': '프로젝트 진행 과정',
    'exp.pb0.1': '9명의 컨설턴트와 협업해, 기존 설치물의 사용 패턴을 포착하고 해석할 수 있는 데이터 기반 인터랙티브 공공 설치 시스템을 기획했습니다. 참여도 분석과 행동 가시성 향상에 초점을 맞췄습니다.',
    'exp.pb0.2': '저비용·저부하 센싱 방식을 위한 데이터 기반 디자인 제약을 정의하여, 정성적인 행동 가시성 목표를 구조화되고 정량화 가능한 데이터 스키마로 성공적으로 옮겼습니다.',
    'exp.pb0.3': '<strong>Rhino</strong>로 공간 데이터 개념과 3D 구성을 개발해, 물리적 설치 배치를 추론된 데이터 흐름과 정렬하고 커뮤니티 참여의 <strong>체계적 측정</strong> 역량을 최적화했습니다.',
    'exp.pb1.1': '<strong>React와 Vite</strong>로 Firefox 성능 모니터링 확장 프로그램을 개발해, <strong>50개 이상의 동시 탭</strong>을 메모리·CPU 사용량 기준으로 실시간 추적·필터·정렬하여 사용자가 고부하 프로세스를 관리하도록 도왔습니다.',
    'exp.pb1.2': '설문을 통한 사용자 조사를 이끌어 Adaptive Performance에 대한 인식을 파악하고, 그 결과를 <strong>Figma</strong>의 기능 요구사항과 UI 디자인으로 옮기며 프런트엔드·백엔드 트랙에 걸쳐 12명 팀과 협업했습니다.',
    'exp.pb2.1': 'Python과 Jupyter로 고차원 임상 데이터를 처리·분석해 핵심 패턴을 찾아냈고, 다기관 분류 챌린지에서 특징 선택과 팀 전략에 기여해 <strong>7위</strong>를 기록했습니다.',
    'exp.pb2.2': '<strong>3D 의료 영상과 임상 기록</strong>을 위한 자동 전처리 파이프라인을 구축해, 여러 모달리티의 데이터 준비를 간소화하고 연구팀의 수작업 처리 시간을 줄였습니다.',
    'exp.pb2.3': '해석 기법(<strong>SHAP, Grad-CAM</strong>)을 적용해 모델 출력을 검증하고 비전문 이해관계자에게 특징 중요도를 전달하여, 데이터 기반 임상 예측에 대한 신뢰를 높였습니다.',
    'exp.pb3.1': '<strong>8명의 컨설턴트</strong>와 협업해 설문 데이터, 경쟁사 벤치마킹, 어피니티 매핑 등 Braven의 다채널 UX 리서치를 종합하고, 사용자 페인 포인트를 정량화해 데이터 기반 디자인 전략을 세웠습니다.',
    'exp.pb3.2': '엄밀한 <strong>정성·정량 분석</strong>으로 사용자 니즈를 검증하며 모바일 앱 디자인을 체계적으로 반복 개선해, 참여도와 인터페이스 사용성을 측정 가능한 수준으로 끌어올렸습니다.',
    'exp.pb4.1': '<strong>PCR, FACS 분석, HPLC</strong> 등 분자생물학 어세이를 설계·수행해 <strong>골관절염</strong>의 <strong>마이크로RNA(mirBase)</strong> 조절 인자를 세포 수준에서 규명했습니다.',
    'exp.pb4.2': '전임상 워크플로 전반에 걸쳐 <strong>세포 배양</strong>과 <strong>생체 내 랫 실험</strong>을 수행하며, 재현 가능한 실험 데이터로 치료 가설 검증을 지원했습니다.',
    'exp.pb4.3': "면역 어세이와 공정 문서화를 도와 회사의 <strong>CAR-T 세포 치료</strong> 프로그램을 지원하며, 초기 단계 중개연구에 기여했습니다.",
    'exp.pb5.1': '<strong>40명 이상의 병사</strong>로 구성된 소대를 이중언어(한·영) 소대장으로 이끌며 ACFT 교육과 기초 군사 교육을 번역·전달해, 소대 전체 <strong>96% 합격률</strong>을 달성했습니다.',
    'exp.pb5.2': '뛰어난 리더십과 이중언어 소통 능력으로 <strong>미 육군 표창장</strong>(2024년 3월)을 수상했습니다.',
    'exp.pb6.1': '환자 데이터의 수집과 정리를 체계화해 <strong>원격의료 이용 추이</strong>를 정량화하고, <strong>종단 분석</strong>으로 핵심 워크플로 병목을 규명했습니다.',
    'exp.pb6.2': '서비스 지표에 데이터 기반 통찰을 적용해 UCSF의 임상 전달 체계를 최적화하고, 원격의료 시스템의 <strong>운영 효율과 자원 배분</strong>을 향상시켰습니다.',

    /* ── design.html (carousel labels handled in JS via pick) ── */
    'design.title': '디자인 | 최준호',

    /* ── design category pages ── */
    'cat.about.title.uiux': '진짜 사람을 위한<br>디자인.',
    'cat.about.title.3d': '형태와 움직임을<br>위한 공간.',
    'cat.about.title.art': '만드는 즐거움을<br>위해.',
    'cat.uiux.eyebrow': '디자인 &mdash; 카테고리 02',
    'cat.uiux.lead': '제품 디자인, 인터페이스 실험, 그리고 사용자 경험 작업 &mdash; 리서치와 사용자 니즈를 명확하고 쓸모 있는 화면으로 옮깁니다.',
    'cat.uiux.p1': '저는 UI/UX를 리서치와 완성도가 만나는 지점으로 봅니다 &mdash; 한쪽에는 설문, 어피니티 매핑, 벤치마킹이, 다른 쪽에는 레이아웃, 타이포, 컴포넌트 디자인이 있습니다.',
    'cat.uiux.p2': '제가 가장 좋아하는 작업은 디자인 결정 하나하나가 실제 사용자 행동으로 설명될 수 있을 때 나옵니다. 목표는 홀로 예뻐 보이는 것이 아니라, 쓰는 사람에게 옳은 일을 더 쉽게 만드는 것입니다.',
    'cat.uiux.feature.eyebrow': '대표 프로젝트',
    'cat.uiux.feature.title': 'Braven Connect',
    'cat.uiux.feature.desc1': 'Berkeley Consulting Collaborative를 통한 Braven과의 컨설팅 프로젝트입니다. 8명 팀과 함께 설문 데이터, 경쟁사 벤치마킹, 어피니티 매핑 등 다채널 UX 리서치를 종합해 모바일 앱을 위한 집중된 디자인 전략을 세웠습니다.',
    'cat.uiux.feature.desc2': '정성·정량 분석 양쪽으로 사용자 니즈를 검증한 뒤, 모바일 인터페이스를 반복 개선해 참여도와 사용성을 측정 가능한 수준으로 끌어올렸습니다.',
    'cat.3d.eyebrow': '디자인 &mdash; 카테고리 01',
    'cat.3d.lead': '렌더, 모델링, 공간 실험 &mdash; 디지털 공간에서 형태와 빛, 움직임이 어떻게 어우러지는지 탐구합니다.',
    'cat.3d.p1': '이 카테고리는 제가 평면 레이아웃을 넘어 3차원에서 살아 숨 쉬는 작업으로 나아가기 시작한 곳입니다 &mdash; 작은 오브젝트를 모델링하고, 타이포를 움직이고, 재질과 조명이 말보다 먼저 아이디어를 전달하는 법을 배웁니다.',
    'cat.3d.p2': '저는 3D와 모션을 같은 대화로 다룹니다: 타이밍, 무게감, 그리고 카메라가 대상 주위를 움직이는 방식. 여기 있는 대부분은 아직 작업 중이며, 완성작은 곧 올라올 예정입니다.',
    'cat.3d.empty.title': '작품을 준비하고 있습니다.',
    'cat.3d.empty.sub': '현재 3D & 모션 섹션을 채워가는 중입니다. 곧 다시 확인해 주시거나, 그동안 UI/UX와 아트 작업을 둘러보세요.',
    'cat.art.eyebrow': '디자인 &mdash; 카테고리 03',
    'cat.art.lead': '포스터, 스케치, 로고, 그리고 여러 비주얼 실험 &mdash; 일러스트와 타이포, 그리고 약간의 장난기가 만나는 작업들.',
    'cat.art.p1': '아트는 브리프로 스스로를 정당화할 필요가 없는 제 작업의 한 부분입니다. 어떤 것들은 개인 로고이고, 어떤 것들은 친구를 위한 포스터이며, 어떤 것들은 머릿속을 떠나지 않던 낙서 하나에서 시작됐습니다.',
    'cat.art.p2': '저는 연필과 종이, 벡터 도구, 그리고 그때그때 책상에 있는 무엇이든 넘나들며 그리고, 스케치하고, 디자인합니다. 타일을 클릭하면 원본 크기로 볼 수 있습니다.',
    'cat.art.gallery.heading': '선별한 작품',
    'cat.art.gallery.count': '005 &mdash; 작품',
    'cat.cta.title.more': '더 둘러보기.',
    'cat.cta.title.keep': '계속 둘러보기.',
    'cat.cta.sub.threads': '디자인 세계의 또 다른 갈래들.',
    'cat.cta.sub.categories': '더 많은 카테고리, 더 많은 작업 &mdash; 갈래를 골라보세요.',
    'cat.pill.backToDesign': '&larr; 디자인으로 돌아가기',
    'cat.pill.3d': '3D / 모션',
    'cat.pill.uiux': 'UI / UX',
    'cat.pill.art': '아트',
    'cat.pill.about': '소개',

    /* ── photo.html ── */
    'photo.title': '사진 | 최준호',
    'photo.eyebrow': '사진 &nbsp;&middot;&nbsp; 최준호',
    'photo.desc': '학업 외에는 방문한 장소들을 사진으로 담고, 눈에 띄는 카페를 하나하나 평가하고, 제 방을 어떻게 꾸밀지 고민하며 시간을 보냅니다. 이 사이트는 그 모든 것을 모아둔 곳입니다 &mdash; 제가 공부하는 것들, 만드는 도구들, 그리고 아끼는 것들. 무언가 눈에 들어온다면 편하게 <a href="mailto:andrewc27@berkeley.edu">연락 주세요</a>.',
    'photo.label.people': '사람들',
    'photo.label.city': '도시',
    'photo.label.scenes': '풍경',
    'photo.label.water': '물',
    'photo.label.nature': '자연',
    'photo.label.sky': '하늘',
    'photo.label.moments': '순간',

    /* ── cafes.html ── */
    'cafes.title': '카페 투어 | 최준호',
    'cafes.intro.h1': '리스트에 담은<br>모든 카페.',
    'cafes.intro.p1': '저는 카페를 모아둔 네이버 즐겨찾기 폴더를 계속 관리합니다 &mdash; 다녀온 곳도, 가보고 싶은 곳도 많습니다. 이 페이지는 그 폴더를 읽어 실제로 둘러볼 수 있게 만든 것입니다: 검색하고, 필터링하고, 지역별로 묶고, 모든 곳을 지도에서 봅니다.',
    'cafes.intro.p2': '경로 플래너는 작은 TSP 솔버를 사용해 여러분이 고른 카페 3~7곳을 직선거리 기준 최단 경로로 정렬합니다. 오후에 여유가 있어 두세 곳을 한 번에 걷고 싶을 때 유용합니다.',
    'cafes.stat1.label': '전체 카페',
    'cafes.stat2.label': '지역 그룹',
    'cafes.stat3.value': '백만+',
    'cafes.stat3.label': '가능한 투어 조합',
    'cafes.plotted.h2': '<span class="naver-word">네이버</span>에 표시.',
    'cafes.plotted.p': '공유 즐겨찾기 폴더를 맞춤 마커로 지도에 표시했습니다. 마커나 목록 카드를 클릭하면 지도 초점이 함께 이동합니다.',
    'cafes.plotted.link': '공유 리스트 열기 &rarr;',
    'cafes.sidebar.search': '리스트 검색',
    'cafes.sidebar.route': '투어 짜기',
    'cafes.searchLabel': '이름으로 검색',
    'cafes.searchPh': '예: 테라로사, 커스텀커피, onion...',
    'cafes.empty': '검색과 일치하는 카페가 없습니다. 더 짧은 이름으로 검색하거나 전체 지역으로 돌아가 보세요.',
    'cafes.route.summary': '투어를 짜려면 리스트에서 카페 3~7곳을 골라주세요.',
    'cafes.route.optimize': '경로 최적화',
    'cafes.route.clear': '지우기',

    /* ── codes.html ── */
    'codes.title': '코드 | 최준호',
    'codes.hero.title': '코드 컬렉션',
    'codes.hero.sub': '아이디어를 논리로 옮기다. 제 프로젝트 포트폴리오에 오신 것을 환영합니다.',
    'codes.searchPh': '프로젝트 검색',
    'codes.submit': '검색',

    /* ── soccer.html ── */
    'soccer.title': '축구 | 최준호',
    'soccer.cine.title': '미래를 향해 슛',
    'soccer.cine.sub': '경기를 기록하고, 포메이션을 실험하고, 다음 경기를 함께 고민할 AI 코치를 만듭니다. 절반은 일기, 절반은 전술판.',
    'soccer.cine.hint': '스크롤해서 입장',
    'soccer.about.label': '01 &mdash; 이 섹션에 대하여',
    'soccer.about.title': '생각을 소리 내어<br>이어가는 필드.',
    'soccer.about.p1': '축구는 제 안의 덜 다듬어지고 더 집요한 면입니다 &mdash; 팀과 함께 뛰는 아마추어 경기, 냅킨에 끄적이는 포메이션, 놓친 골을 연습 때까지 머릿속으로 되감는 순간들.',
    'soccer.about.p2': '이 페이지는 그 흔적들을 모읍니다: 경기마다 편집하는 스코어 기록과, 팀 절반이 못 나올 때 선발 라인업을 함께 궁리하려고 만든 작은 AI 코치.',
    'soccer.scores.label': '02 &mdash; 경기 스코어',
    'soccer.scores.h2': '최근 경기.',
    'soccer.scores.p': '아무 칸이나 클릭해서 편집하세요. W, L, D를 입력하면 결과가 자동으로 갱신됩니다.',
    'soccer.scores.add': '+ 경기 추가',
    'soccer.coach.label': '03 &mdash; AI 코치',
    'soccer.coach.h2': '축구 AI 코치.',
    'soccer.coach.p': '다가오는 아마추어 경기의 라인업, 포메이션, 게임 플랜을 코치에게 물어보세요.',
    'soccer.coach.status': '연결 중...',
    'soccer.coach.ph': '예: 선수가 6명이고 수비수 한 명이 못 나옵니다. 오늘 최선의 포메이션은 무엇일까요?',
    'soccer.coach.hintHtml': '로컬 브리지: Ollama 실행 상태에서 <code>python3 soccer_chat_server.py</code>.',
    'soccer.coach.end': '대화 종료',
    'soccer.coach.send': '코치에게 묻기',
    'soccer.cta.title': '더 둘러보기.',
    'soccer.cta.sub': '사이트의 다른 부분들도 둘러보세요.',
    'soccer.ai.credit': 'Gemini Veo (AI)로 생성한 영상',

    /* ── room.html ── */
    'room.title': '내 방 | 최준호',
    'room.hint': '드래그해서 회전 &nbsp;·&nbsp; 스크롤/핀치로 확대 &nbsp;·&nbsp; · 을 탭해서 둘러보기',
    'room.lb.eyebrow': '내 방',
    'room.back': '← 방으로 돌아가기'
  };

  /* Dynamic strings used by page JS, addressed through i18n.pick(). Kept
     here only for reference; the JS passes both languages inline. */

  var lang = 'en';
  try { lang = localStorage.getItem(STORAGE_KEY) === 'ko' ? 'ko' : 'en'; } catch (e) {}

  /* Apply the <html> hook immediately (before DOMContentLoaded) so the
     Korean-resume CSS swap and lang attribute take effect without a flash
     of the wrong resume layout. */
  document.documentElement.lang = lang === 'ko' ? 'ko' : 'en';
  document.documentElement.classList.toggle('lang-ko', lang === 'ko');

  function decodeEntities(str) {
    // KO strings may contain HTML entities (&mdash; etc). For textContent
    // targets we want them rendered, so decode via a scratch element.
    var el = document.createElement('div');
    el.innerHTML = str;
    return el.textContent;
  }

  function captureAndApply() {
    // Text nodes
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      if (el._i18nEn === undefined) el._i18nEn = el.textContent;
      var key = el.getAttribute('data-i18n');
      if (lang === 'ko' && KO[key] != null) el.textContent = decodeEntities(KO[key]);
      else el.textContent = el._i18nEn;
    });
    // HTML fragments
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      if (el._i18nEnHtml === undefined) el._i18nEnHtml = el.innerHTML;
      var key = el.getAttribute('data-i18n-html');
      if (lang === 'ko' && KO[key] != null) el.innerHTML = KO[key];
      else el.innerHTML = el._i18nEnHtml;
    });
    // Placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      if (el._i18nEnPh === undefined) el._i18nEnPh = el.getAttribute('placeholder') || '';
      var key = el.getAttribute('data-i18n-ph');
      if (lang === 'ko' && KO[key] != null) el.setAttribute('placeholder', decodeEntities(KO[key]));
      else el.setAttribute('placeholder', el._i18nEnPh);
    });
    // <title>
    if (document.title) {
      var titleKey = document.documentElement.getAttribute('data-i18n-title');
      if (titleKey) {
        if (document.documentElement._i18nEnTitle === undefined) document.documentElement._i18nEnTitle = document.title;
        document.title = (lang === 'ko' && KO[titleKey] != null) ? decodeEntities(KO[titleKey]) : document.documentElement._i18nEnTitle;
      }
    }
  }

  function updateToggle(btn) {
    // Button shows the language you'll switch TO.
    btn.textContent = lang === 'ko' ? 'EN' : '한국어';
    btn.setAttribute('aria-label', lang === 'ko' ? 'Switch to English' : '한국어로 전환');
  }

  function injectToggleStyles() {
    if (document.getElementById('i18n-toggle-style')) return;
    var s = document.createElement('style');
    s.id = 'i18n-toggle-style';
    s.textContent =
      '.lang-toggle{border:1px solid currentColor;background:none;font:inherit;' +
      'cursor:pointer;opacity:0.85;letter-spacing:0.02em;line-height:1;}' +
      '.lang-toggle:hover{opacity:1;}' +
      /* On phones the nav is a vertical column — keep the toggle compact */
      '@media (max-width:640px){.lang-toggle{align-self:flex-start;}}';
    document.head.appendChild(s);
  }

  function injectToggle() {
    var navs = document.querySelectorAll('.nav');
    navs.forEach(function (nav) {
      if (nav.querySelector('.lang-toggle')) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nav-link lang-toggle';
      updateToggle(btn);
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        setLang(lang === 'ko' ? 'en' : 'ko');
      });
      nav.appendChild(btn);
    });
  }

  function setLang(next) {
    lang = next === 'ko' ? 'ko' : 'en';
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    document.documentElement.lang = lang === 'ko' ? 'ko' : 'en';
    document.documentElement.classList.toggle('lang-ko', lang === 'ko');
    captureAndApply();
    document.querySelectorAll('.lang-toggle').forEach(updateToggle);
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  // Public API for page scripts that render text in JS.
  window.i18n = {
    get lang() { return lang; },
    set: setLang,
    t: function (key) {
      if (lang === 'ko' && KO[key] != null) return decodeEntities(KO[key]);
      return null;
    },
    pick: function (en, ko) { return lang === 'ko' ? ko : en; }
  };

  function init() {
    injectToggleStyles();
    injectToggle();
    captureAndApply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
