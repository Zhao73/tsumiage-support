// Korean pages.
import { esc, appUrl, ICON, faq, faqLd, abs, motif, seeded, heroFigure, EMAIL, crumbs, breadcrumbLd } from './lib.mjs';
import { challengePage } from './challenge.mjs';
import { cumulative, cumulativeReverse } from './math.mjs';
import { shotsSection } from './pages-ja.mjs';

const fmt = (n) => n.toLocaleString('en-US');
const w = (n) => fmt(n) + '원';

export const SIBLINGS_KO = [
  ['ko/52ju-jeogeum/', '52주 저금 챌린지', '1,378,000원'],
  ['ko/100bongtu/', '100봉투 챌린지', '5,050,000원'],
];

const COMMON = {
  lang: 'ko',
  crumbHome: 'Tsumiage',
  factsHeading: '한눈에 보기',
  pdfButton: '표 다운로드 (PDF)',
  appButton: '앱으로 기록하기',
  faqHeading: '자주 묻는 질문',
  siblingsHeading: '다른 저축 챌린지',
  siblings: SIBLINGS_KO,
};

const trackerCommon = {
  suffix: '원',
  countFmt: '{done} / {all}칸 (전체 {total})',
  resetLabel: '체크 모두 지우기',
  resetConfirm: '체크를 모두 지울까요?',
  note: '칸을 누르면 체크돼요. 체크는 이 브라우저에만 저장돼요.',
};

function page52() {
  const weeks = [1, 4, 13, 26, 39, 52];
  return challengePage({
    ...COMMON,
    group: 'c52', campaign: 'ko-52ju',
    path: 'ko/52ju-jeogeum/',
    title: '52주 저금 챌린지 표 (무료 PDF) | Tsumiage',
    ogTitle: '52주 저금 챌린지 표 (무료 PDF)',
    description: '52주 저금 챌린지는 1주 차에 1,000원, 매주 1,000원씩 늘려 52주 차에 52,000원을 모으는 방법이에요. 1년 합계는 1,378,000원. 방법, 계산표, 인쇄용 A4 표(PDF)를 정리했어요.',
    og: 'assets/og/ko-52ju.png', ogAlt: '52주 저금 챌린지 표. 1년에 1,378,000원',
    h1: '52주 저금 챌린지 방법과 표',
    lead: '매주 저금액을 1,000원씩 늘려 가는 1년짜리 저축 챌린지예요. 칸에 체크하면서 하면 얼마나 남았는지 한눈에 보여요.',
    total: '1,378,000원', totalLabel: '1년(52주) 동안 모이는 금액 (1칸 1,000원 기준)',
    crumbName: '52주 저금 챌린지',
    facts: [
      '52주 저금 챌린지는 1주 차에 1,000원, 2주 차에 2,000원처럼 <strong>매주 1,000원씩</strong> 늘려 모으는 방법이에요.',
      '52주 차에는 <strong>52,000원</strong>, 1년 합계는 <strong>1,378,000원</strong>이에요.',
      '계산: 1,000원 × (1 + 2 + … + 52) = 1,000원 × 1,378 = <strong>1,378,000원</strong>.',
      '순서대로 하면 26주 차까지 모인 금액은 <strong>351,000원</strong>(전체의 약 25%)이에요.',
      '거꾸로 하거나 아무 칸부터 채워도 합계는 똑같이 1,378,000원이에요.',
    ],
    howHeading: '52주 저금 챌린지 하는 법',
    how: [
      ['표를 준비해요.', '1,000원부터 52,000원까지 52칸짜리 표를 써요. 아래 PDF를 인쇄하거나 앱에서 52주 챌린지를 고르면 돼요.'],
      ['매주 한 칸을 골라 저금해요.', '고른 칸의 금액을 저금통이나 저축 통장에 넣어요.'],
      ['넣은 칸에 체크해요.', '체크가 늘수록 합계가 쌓여요.'],
      ['52칸을 다 채우면 끝.', '1칸 1,000원이면 1,378,000원이 모여요.'],
    ],
    formula: '합계 = 1,000원 × (1 + 2 + … + 52) = 1,000원 × 52 × 53 ÷ 2 = 1,378,000원',
    sheetHeading: '52주 저금 표 (체크할 수 있어요)',
    sheetIntro: '한 칸이 그 주의 금액이에요. 순서는 자유예요. 누른 칸의 합계가 위에 나와요.',
    tracker: {
      ...trackerCommon, id: 'ko-52ju', n: 52, step: 1000, label: 'amount', cols: 13, colsM: 7,
      groupLabel: '52주 저금 52칸', aria: (k) => `${k}주 차 ${w(k * 1000)}`,
    },
    mathHeading: '얼마나 모일까? 계산표',
    mathIntro: '순서대로 하면 처음엔 가볍고 뒤로 갈수록 한 번에 넣는 금액이 커져요. 거꾸로 하면 그 반대예요.',
    table: {
      caption: '1칸 1,000원 기준',
      head: ['경과', '순서대로: 그 주', '순서대로: 합계', '거꾸로: 그 주', '거꾸로: 합계'],
      rows: weeks.map((k) => [`${k}주 차`, w(k * 1000), w(cumulative(k, 1000)), w((53 - k) * 1000), w(cumulativeReverse(k, 52, 1000))]),
    },
    mathNote: '금액을 바꾼 예: 1칸 500원이면 689,000원, 1칸 2,000원이면 2,756,000원이에요.',
    variationsHeading: '4가지 진행 방법',
    variationsIntro: '어떤 방법이든 52칸을 다 채우면 합계는 같아요.',
    variations: [
      ['순서대로', '1,000원, 2,000원, 3,000원… 시작은 쉽지만 연말에는 한 주에 5만 원대가 돼요. 연말 지출도 미리 생각해 두세요.'],
      ['거꾸로', '52,000원부터 시작해 1,000원씩 줄여요. 의욕이 있을 때 큰 금액을 끝내 두면 연말이 편해요.'],
      ['아무 칸부터', '그 주에 낼 수 있는 금액의 칸을 골라요. 월급날 뒤에는 큰 칸, 빠듯한 주에는 작은 칸.'],
      ['랜덤', '남은 칸 중 하나를 무작위로 골라요. 앱에서도 남은 칸을 랜덤으로 고를 수 있어요.'],
    ],
    tipsHeading: '끝까지 하는 팁',
    tips: [
      '시작일을 정해 두세요. 1월 1일, 생일, 월급날 무엇이든 괜찮아요. 시작한 주가 1주 차예요.',
      '매주 같은 요일에 저금해요. 통장이라면 월급날에 먼저 옮겨 두면 잊지 않아요.',
      '못 낸 주가 있으면 작은 칸을 고르거나 다음 주에 두 칸을 채워요. 멈추지 않는 게 가장 중요해요.',
      '표는 눈에 띄는 곳에 붙여 두세요. 앱에서는 홈 화면 위젯으로 진행 상황을 볼 수 있어요.',
    ],
    pdf: {
      pdfs: [['52ju-jeogeum.pdf', '표 다운로드 (PDF)']],
      heading: '52주 저금 챌린지 표 (A4 인쇄용)',
      text: '1,000원부터 52,000원까지 52칸에 시작일과 합계 칸을 넣은 A4 한 장짜리 표예요. 흑백으로 인쇄해도 잘 보여요. 무료로 받을 수 있어요.',
      preview: '52ju-jeogeum.png', previewAlt: '52주 저금 챌린지 표 PDF 첫 페이지',
    },
    app: { heading: 'iPhone에서 칸을 채우며 기록해요', text: 'Tsumiage에서는 52주 챌린지를 이 표와 같은 칸으로 기록할 수 있어요. 홈 화면·잠금 화면 위젯에서 한 번에 기록하고, 광고는 나오지 않아요.' },
    faq: [
      ['52주 저금 챌린지로 1년에 얼마가 모이나요?', '1주 차 1,000원에서 매주 1,000원씩 늘리면 52주에 1,378,000원이에요.'],
      ['중간에 시작해도 되나요?', '네. 시작한 주를 1주 차로 세면 돼요. 52주가 지나면 합계는 같아요.'],
      ['한 주를 못 넣었어요.', '작은 금액의 칸을 고르거나 다음 주에 두 칸을 채우면 돼요. 순서는 자유라서 합계는 변하지 않아요.'],
      ['표는 어디서 받나요?', '이 페이지에서 A4 PDF를 무료로 받을 수 있어요. 페이지의 표를 그대로 체크해서 써도 돼요(체크는 이 브라우저에 저장돼요).'],
    ],
    howTo: { name: '52주 저금 챌린지 하는 법', totalTime: 'P52W', supply: ['52주 저금 챌린지 표 (A4)', '저금통 또는 저축 통장'], tool: 'Tsumiage (iPhone 앱) 또는 필기구' },
  });
}

function page100() {
  const marks = [10, 25, 50, 75, 100];
  return challengePage({
    ...COMMON,
    group: 'c100', campaign: 'ko-100bongtu',
    path: 'ko/100bongtu/',
    title: '100봉투 챌린지 방법과 표 (무료 PDF) | Tsumiage',
    ogTitle: '100봉투 챌린지 방법과 표 (무료 PDF)',
    description: '100봉투 챌린지는 1~100번 봉투에 "번호 × 1,000원"을 넣는 저축 방법이에요. 100봉투를 다 채우면 5,050,000원. 방법, 계산표, 인쇄용 A4 표(PDF)를 정리했어요.',
    og: 'assets/og/ko-100bongtu.png', ogAlt: '100봉투 챌린지 표. 합계 5,050,000원',
    h1: '100봉투 챌린지 방법과 표',
    lead: '1부터 100까지 번호를 붙인 봉투를 하나씩 골라 번호만큼 넣는 저축 챌린지예요. 봉투가 없어도 표에 체크하면 똑같이 할 수 있어요.',
    total: '5,050,000원', totalLabel: '봉투 1개 = 번호 × 1,000원으로 100봉투를 다 채웠을 때',
    crumbName: '100봉투 챌린지',
    facts: [
      '100봉투 챌린지는 <strong>1~100번</strong> 봉투에 "번호 × 단위" 금액을 넣는 저축 방법이에요.',
      '1,000원 단위면 합계는 <strong>5,050,000원</strong>(1,000원 × (1 + 2 + … + 100))이에요.',
      '하루 한 봉투면 <strong>100일</strong>, 일주일에 두 봉투면 <strong>50주</strong>가 걸려요.',
      '가장 큰 100번 봉투는 100,000원, 평균은 50,500원이에요.',
      '원래 미국에서 시작된 방식은 1달러 단위로, 합계 5,050달러예요.',
    ],
    howHeading: '100봉투 챌린지 하는 법',
    how: [
      ['봉투나 표를 준비해요.', '1~100번까지 번호를 붙여요. 봉투 100장이 없어도 아래 표에 체크하면 돼요.'],
      ['하나를 골라요.', '봉투를 섞어서 뽑는 게 원래 방식이에요. 원하는 번호를 골라도 괜찮아요.'],
      ['번호 × 1,000원을 넣어요.', '37번이면 37,000원이에요. 넣고 나면 표에 체크해요.'],
      ['100번까지 다 채우면 끝.', '합계 5,050,000원이 모여요.'],
    ],
    formula: '합계 = 1,000원 × (1 + 2 + … + 100) = 1,000원 × 5,050 = 5,050,000원',
    sheetHeading: '100봉투 표 (체크할 수 있어요)',
    sheetIntro: '칸의 숫자가 봉투 번호예요. 봉투 1개의 금액은 "번호 × 1,000원". 누른 봉투의 합계가 위에 나와요.',
    tracker: {
      ...trackerCommon, id: 'ko-100bongtu', n: 100, step: 1000, label: 'index', cols: 20, colsM: 10,
      countFmt: '{done} / {all}봉투 (전체 {total})',
      groupLabel: '100봉투', aria: (k) => `${k}번 봉투 ${w(k * 1000)}`,
    },
    mathHeading: '얼마나 모일까? 계산표',
    mathIntro: '순서대로 했을 때의 합계예요. 뽑기로 하면 중간 합계는 매번 달라져요.',
    table: {
      caption: '봉투 1개 = 번호 × 1,000원 기준',
      head: ['경과', '그 봉투', '합계', '하루 한 봉투일 때'],
      rows: marks.map((m) => [`${m}번까지`, w(m * 1000), w(cumulative(m, 1000)), `${m}일 차`]),
    },
    mathNote: '금액을 바꾼 예: 100원 단위면 505,000원, 500원 단위면 2,525,000원이에요.',
    variationsHeading: '4가지 진행 방법',
    variations: [
      ['순서대로', '1번부터 차례로 넣어요. 마지막 10봉투(91,000원~100,000원)가 가장 무거워요.'],
      ['거꾸로', '100번부터 시작해요. 보너스가 있는 달에 큰 번호를 끝내기 좋아요.'],
      ['원하는 봉투부터', '그날 낼 수 있는 금액의 봉투를 골라요.'],
      ['뽑기', '봉투를 섞어서 뽑는 원래 방식이에요. 앱에서도 남은 칸을 랜덤으로 고를 수 있어요.'],
    ],
    tipsHeading: '끝까지 하는 팁',
    tips: [
      '하루에 최대 100,000원이 될 수 있어요. 일주일에 두 봉투(50주)처럼 속도는 자유롭게 정하세요.',
      '현금을 봉투에 넣어 집에 둔다면, 금액이 커지기 전에 통장으로 옮겨 두면 안심이에요.',
      '부담스럽다면 100원 단위(합계 505,000원)로 시작해도 좋아요.',
    ],
    pdf: {
      pdfs: [['100bongtu-challenge.pdf', '표 다운로드 (PDF)']],
      heading: '100봉투 챌린지 표 (A4 인쇄용)',
      text: '봉투 모양 100칸에 번호와 금액(1,000원~100,000원)을 넣은 A4 한 장짜리 표예요. 무료로 받을 수 있어요.',
      preview: '100bongtu-challenge.png', previewAlt: '100봉투 챌린지 표 PDF 첫 페이지',
    },
    app: { heading: 'iPhone에서 봉투를 채우며 기록해요', text: 'Tsumiage에서는 100봉투 챌린지를 같은 100칸으로 기록할 수 있어요. 위젯이나 제어 센터에서 한 번에 기록하고, 광고는 나오지 않아요.' },
    faq: [
      ['100봉투 챌린지는 얼마가 모이나요?', '봉투 1개에 번호 × 1,000원을 넣으면 5,050,000원이에요. 100원 단위면 505,000원이에요.'],
      ['얼마나 걸리나요?', '하루 한 봉투면 100일, 일주일에 두 봉투면 50주예요. 속도는 자유예요.'],
      ['봉투 100장이 꼭 있어야 하나요?', '아니요. 표에 체크하면 봉투 없이도 똑같이 할 수 있어요.'],
    ],
    howTo: { name: '100봉투 챌린지 하는 법', totalTime: 'P100D', supply: ['100봉투 챌린지 표 (A4) 또는 봉투 100장', '저금통 또는 저축 통장'], tool: 'Tsumiage (iPhone 앱) 또는 필기구' },
  });
}

function landing(ctx) {
  const path = 'ko/';
  const r2 = seeded(11);
  const cards = [
    ['52ju-jeogeum/', '52주 저금 챌린지', '1,378,000원', '1년', '1,000원에서 시작해 매주 1,000원씩. 52주 차는 52,000원.', motif({ cols: 26, rows: 2, on: (i) => i < 21 })],
    ['100bongtu/', '100봉투 챌린지', '5,050,000원', '1,000원 단위', '번호 × 1,000원을 봉투에. 하루 한 봉투면 100일.', motif({ cols: 25, rows: 4, on: () => r2() < 0.35 })],
  ];
  const faqItems = [
    ['Pro를 사지 않아도 쓸 수 있나요?', '네. Pro 없이도 진행 중인 목표 3개, 모든 저축 챌린지, 위젯, 백업을 쓸 수 있어요. Tsumiage Pro는 1회 구매로 목표 무제한 등을 더해 줘요. 정기 결제는 없어요. 가격은 국가·지역마다 다르며 App Store에 표시돼요.'],
    ['광고가 나오나요?', '아니요. 기록할 때도, 앱을 열 때도 광고는 나오지 않아요.'],
    ['어떤 iPhone에서 쓸 수 있나요?', 'iOS 26 이상의 iPhone에서 쓸 수 있어요.'],
    ['기록은 어디에 저장되나요?', '사용 중인 iPhone 안과, 백업을 켰다면 내 iCloud Drive에 저장돼요. 개발자에게 전달되는 데이터는 없어요. 회원 가입도 필요 없어요.'],
    ['새 iPhone으로 옮길 수 있나요?', '네. 매일 자동으로 iCloud Drive에 백업되므로 기기를 바꾸거나 앱을 다시 설치한 뒤 복원할 수 있어요. CSV 파일 가져오기도 지원해요.'],
    ['돈 말고 다른 것도 기록할 수 있나요?', '네. 달린 거리, 읽은 책, 공부 시간, 횟수, 직접 정한 단위도 기록할 수 있어요. 공부나 운동 시간은 타이머로 재서 바로 기록돼요.'],
    ['Tsumiage Pro에는 무엇이 있나요?', '목표 무제한, 정기 적립 알림, 모든 그래프와 위젯 스타일, 자세한 분석, Face ID 잠금, CSV 내보내기예요. 가족 공유를 지원해요.'],
  ];
  const shots = ctx.shots('ko');
  const main = `<section class="hero">
<div class="wrap hero-grid">
<div>
<p class="store-name"><img src="../assets/icon-68.png" width="28" height="28" alt="">Tsumiage · iPhone 앱</p>
<h1><span class="nb">저축을 한 칸씩</span> <span class="nb">쌓아 올려요.</span></h1>
<p class="lead">Tsumiage는 52주 저금, 100봉투 챌린지 같은 저축 챌린지와 목표 저축을 기록하는 iPhone 앱이에요. 목표 금액을 정하고, 모은 만큼 한 번의 탭으로 쌓아 가요.</p>
<div class="actions">
<a class="btn btn-primary" href="${esc(appUrl('ko-hero'))}">${ICON.store}App Store에서 받기</a>
<a class="btn btn-secondary" href="#challenges">챌린지 표 보기</a>
</div>
<ul class="trust">
<li><b>광고 없음</b><span>기록할 때 광고가 나오지 않아요.</span></li>
<li><b>1회 구매</b><span>Pro는 한 번 사면 계속 써요. 정기 결제 없음.</span></li>
<li><b>가입 없음</b><span>계정도 이메일도 필요 없어요.</span></li>
</ul>
</div>
${heroFigure({ prefix: '₩', total: 1378000, caption: '52주 저금을 1,000원부터 시작했을 때 1년 합계' })}
</div>
</section>

<section class="section band" id="how" aria-labelledby="how-h">
<div class="wrap">
<div class="section-head reveal"><h2 id="how-h">사용법은 3단계</h2></div>
<ol class="steps">
<li class="reveal"><h3>이름만 쓰면 목표가 돼요</h3><p><span class="example">제주도 여행 200만원 12월까지</span>라고 쓰면 종류·목표 금액·기한이 들어가고, 하루에 얼마씩 모으면 되는지 보여 줘요.</p></li>
<li class="reveal"><h3>한 번의 탭으로 기록</h3><p>홈 화면과 잠금 화면 위젯, 제어 센터, 단축어나 Siri에서. 앱을 열지 않아도 돼요.</p></li>
<li class="reveal"><h3>쌓이는 걸 봐요</h3><p>그래프로 진행 상황을, 메달과 배지로 꾸준함을 확인해요. 쓴 돈은 '꺼내기'로 기록해요.</p></li>
</ol>
</div>
</section>
${shots ? shotsSection(shots, '앱 화면', path) : ''}
<section class="section" id="challenges" aria-labelledby="ch-h">
<div class="wrap">
<div class="section-head reveal"><h2 id="ch-h">저축 챌린지 방법과 표</h2><p>챌린지마다 방법, 계산, 인쇄용 A4 표(PDF)를 정리했어요. 앱에서는 같은 칸을 눌러 기록해요.</p></div>
<div class="challenge-grid">
${cards.map(([p, name, total, small, text, svg]) => `<a class="ch-card reveal" href="${p}">${svg}<h3>${name}</h3><p class="total">${total}<small>${small}</small></p><p>${text}</p><span class="go">방법과 표 보기</span></a>`).join('\n')}
<div class="ch-card reveal" style="box-shadow:none;background:transparent;padding-inline:4px"><h3>앱에는 이것도 있어요</h3><p>365일 챌린지, 100일 챌린지, 동전 200개 챌린지, 그리고 "커피 참기 5,000원" 같은 버튼으로 기록하는 아낀 돈 저축.</p></div>
</div>
</div>
</section>

<section class="section band" id="features" aria-labelledby="feat-h">
<div class="wrap">
<div class="section-head reveal"><h2 id="feat-h">꾸준히 하도록 돕는 기능</h2><p>기록은 1초면 끝나고, 기록은 사라지지 않게.</p></div>
<div class="features">
<div class="feature reveal"><h3>앱을 열지 않고 기록</h3><p>모았으면 그 자리에서 한 번 탭. 기록할 수 있는 곳:</p><ul class="places"><li>홈 화면 위젯</li><li>잠금 화면 위젯</li><li>제어 센터</li><li>단축어·Siri</li></ul></div>
<div class="feature reveal"><h3>버튼으로 아낀 돈 기록</h3><p>"커피 참기 5,000원" 같은 버튼을 만들어 두면 누르기만 하면 돼요. 위젯에도 버튼이 나와요.</p></div>
<div class="feature reveal"><h3>돈 말고도 쌓기</h3><p>거리, 책, 공부 시간, 횟수, 직접 정한 단위. 시간은 타이머로 재고, 재는 동안 실시간 현황으로 보여요.</p></div>
<div class="feature reveal"><h3>원하는 알림만</h3><p>매일 리마인더, 월급날, 주간 돌아보기, 기한까지의 페이스. 켠 알림만 와요.</p></div>
<div class="feature reveal"><h3>수정·취소·꺼내기</h3><p>잘못된 기록은 나중에 고치거나 지우고, 기록 직후엔 취소할 수 있어요. 쓴 돈은 꺼내기로 기록해요.</p></div>
<div class="feature reveal"><h3>데이터는 내 손에</h3><p>iPhone 안과 내 iCloud Drive에 매일 자동 백업. 기기를 바꾸거나 다시 설치해도 복원돼요. CSV 가져오기도 지원해요.</p></div>
</div>
</div>
</section>

<section class="section" id="pro" aria-labelledby="pro-h">
<div class="wrap">
<div class="section-head reveal"><h2 id="pro-h">Tsumiage Pro는 1회 구매</h2><p>정기 결제가 없어요. 같은 Apple 계정의 iPhone과 가족 공유 구성원이 쓸 수 있어요.</p></div>
<div class="plan">
<div class="reveal"><h3>Pro 없이 쓸 수 있는 것</h3><ul><li>진행 중인 목표 3개</li><li>모든 저축 챌린지</li><li>위젯과 원탭 기록</li><li>iCloud Drive 백업과 복원</li><li>꺼내기·수정·알림·배지</li></ul></div>
<div class="pro reveal"><h3>Pro로 늘어나는 것</h3><ul><li>목표 무제한</li><li>정기 적립 알림</li><li>모든 그래프와 위젯 스타일</li><li>자세한 분석</li><li>Face ID 잠금</li><li>CSV 내보내기</li></ul><p class="note">가격은 국가·지역마다 다르며 App Store에 표시돼요.</p></div>
</div>
</div>
</section>

${faq(faqItems, { heading: '자주 묻는 질문', band: true, intro: `사용법 질문은 <a href="support.html">지원 페이지</a>에도 정리돼 있어요.` })}

<section class="section-tight" id="contact" aria-labelledby="contact-h">
<div class="wrap">
<div class="contact reveal">
<div><h2 id="contact-h">문의</h2><p>오류나 요청 사항은 메일로 알려 주세요. iPhone 기종과 iOS 버전을 함께 적어 주시면 큰 도움이 돼요.<br><a class="mail" href="mailto:${EMAIL}?subject=Tsumiage">${EMAIL}</a></p></div>
<a class="btn btn-secondary" href="support.html">지원 페이지 열기</a>
</div>
</div>
</section>`;
  return {
    lang: 'ko', path, group: 'home', type: 'landing',
    title: 'Tsumiage: 저축 챌린지·저축 목표 iPhone 앱',
    ogTitle: 'Tsumiage — 저축 챌린지·저축 목표',
    description: '52주 저금, 100봉투 챌린지 같은 저축 챌린지와 목표 저축을 칸을 채우며 기록하는 iPhone 앱. 광고 없음, 1회 구매, 가입 없음. 챌린지 방법과 인쇄용 표(PDF)도 있어요.',
    og: 'assets/og/ko.png', ogAlt: 'Tsumiage: 저축을 한 칸씩 쌓아 올려요',
    main,
    jsonld: ctx.landingLd({
      lang: 'ko', path, name: 'Tsumiage', alt: ['ツミアゲ', '츠미아게'], currency: 'KRW',
      description: '저축 챌린지(52주 저금, 100봉투, 365일, 100일, 동전 200개, 아낀 돈 저축)와 목표 저축을 기록하는 iPhone 앱. 광고, 계정, 데이터 수집 없음. 기본 기능은 그대로 쓸 수 있고, 목표 무제한 등을 더하는 1회 구매 인앱 결제 Tsumiage Pro가 있어요(정기 결제 없음).',
      features: ['52주 저금, 100봉투, 365일, 100일, 동전 챌린지', '이름으로 목표 금액과 기한을 정하고 하루 페이스 표시', '홈 화면·잠금 화면 위젯, 제어 센터, 단축어/Siri로 원탭 기록', '그래프, 메달과 배지, 꺼내기, 수정과 취소', '공부·운동 시간 타이머 기록과 실시간 현황', '매일 iCloud Drive 자동 백업과 복원, CSV 가져오기'],
      faqItems,
    }),
  };
}

function support() {
  const path = 'ko/support.html';
  const items = [
    ['위젯은 어떻게 추가하나요?', '홈 화면의 빈 곳을 길게 누르기 → "편집" → "위젯 추가" → "Tsumiage"를 선택하세요. 중간 크기는 버튼만 눌러도 기록돼요. 표시할 목표와 그래프는 위젯을 길게 누르기 → "위젯 편집"에서 고를 수 있어요. 잠금 화면과 제어 센터에도 추가할 수 있어요.'],
    ['기록을 잘못 입력했어요', '기록한 직후라면 위에 나오는 "취소"로 되돌릴 수 있어요. 나중에는 목표의 기록 목록에서 왼쪽으로 밀어서 수정·삭제할 수 있어요.'],
    ['쓴 돈은 어떻게 기록하나요?', '기록 화면에서 모으기 대신 쓰기로 바꾸고 금액을 넣으면 꺼내기로 기록되고 합계에서 빠져요.'],
    ['목표는 몇 개까지 만들 수 있나요?', 'Pro 없이 진행 중인 목표를 3개까지 만들 수 있어요. Tsumiage Pro(1회 구매)는 무제한이에요.'],
    ['Pro를 샀는데 적용되지 않아요', '설정 → "구매 복원"을 눌러 주세요. 같은 Apple 계정이라면 다른 iPhone에서도 추가 비용 없이 쓸 수 있어요. 가족 공유도 지원해요.'],
    ['통화와 거리 단위는 어떻게 정해지나요?', 'iPhone의 지역 설정을 따라요. 원·달러·엔, 킬로미터·마일이 자동으로 바뀌어요.'],
    ['새 iPhone으로 데이터를 옮길 수 있나요?', '백업을 켜 두면 매일 자동으로 내 iCloud Drive에 사본이 저장돼요. 새 iPhone에 같은 Apple 계정으로 앱을 설치하고 백업에서 복원하세요. CSV 파일 가져오기도 할 수 있어요.'],
    ['앱을 삭제하면 어떻게 되나요?', 'iPhone 안의 목표와 기록은 삭제돼요. iCloud Drive 백업이 있으면 다시 설치한 뒤 복원할 수 있어요. 백업이 없으면 되돌릴 수 없어요.'],
  ];
  const page = { lang: 'ko', path, group: 'support', type: 'doc', title: '지원·문의 | Tsumiage', description: 'Tsumiage 사용법, 자주 묻는 질문, 문의. 위젯 추가, 기록 수정, iCloud Drive 백업으로 새 iPhone에 옮기기, Pro 복원.', og: 'assets/og/ko.png', ogAlt: 'Tsumiage 지원' };
  page.main = `${crumbs(page, [['Tsumiage', 'ko/'], ['지원', path]])}
<div class="narrow doc">
<div class="page-head"><h1>지원</h1><p class="lead">Tsumiage 사용법과 문의처예요.</p></div>
<section aria-labelledby="c-h"><h2 id="c-h">문의</h2><p>오류나 요청 사항은 메일로 알려 주세요. iPhone 기종과 iOS 버전을 함께 적어 주시면 큰 도움이 돼요.</p><p><a class="mail" href="mailto:${EMAIL}?subject=Tsumiage">${EMAIL}</a></p></section>
<section aria-labelledby="f-h"><h2 id="f-h">자주 묻는 질문</h2>
${items.map(([q, a]) => `<h3>${q}</h3><p>${a}</p>`).join('\n')}
</section>
<section aria-labelledby="l-h"><h2 id="l-h">관련 페이지</h2><ul><li><a href="privacy.html">개인정보 처리방침</a></li><li><a href="terms.html">이용약관</a></li><li><a href="./#challenges">저축 챌린지 방법과 표</a></li></ul></section>
</div>`;
  page.jsonld = [faqLd(items, abs(path)), breadcrumbLd([['Tsumiage', 'ko/'], ['지원', path]])];
  return page;
}

function privacy() {
  const path = 'ko/privacy.html';
  const page = { lang: 'ko', path, group: 'privacy', type: 'doc', title: '개인정보 처리방침 | Tsumiage', description: 'Tsumiage는 사용자의 정보를 수집하지 않아요. 기록은 iPhone 안과, 백업을 켰다면 내 iCloud Drive에만 저장돼요.', og: 'assets/og/ko.png', ogAlt: 'Tsumiage 개인정보 처리방침' };
  page.main = `${crumbs(page, [['Tsumiage', 'ko/'], ['개인정보 처리방침', path]])}
<div class="narrow doc">
<div class="page-head"><h1>개인정보 처리방침</h1><p class="lead">Tsumiage는 사용자의 정보를 전혀 수집하지 않아요.<br>최종 수정일: 2026년 11월 14일</p></div>
<section><h2>저장하는 정보</h2><ul>
<li>목표, 기록(숫자·메모·날짜), 화면 설정은 사용 중인 iPhone 안에 저장돼요. 홈 화면과 잠금 화면 위젯도 같은 iPhone 안의 데이터를 읽어요.</li>
<li>백업을 켜면 사본을 내 iCloud Drive(내 Apple 계정의 iCloud)에 저장해요. 개발자는 그 내용을 볼 수 없어요.</li>
<li>개발자 서버도, 회원 가입도 없어요.</li>
<li>앱을 삭제하면 iPhone 안의 데이터는 사라져요. iCloud Drive 백업은 직접 지울 때까지 남아 있어요.</li>
</ul></section>
<section><h2>사용하는 기능</h2><ul>
<li><b>알림</b>: 리마인더 등 알림을 켰을 때만 iPhone 안에서 예약한 알림을 보내요. 외부로 보내지 않아요.</li>
<li><b>Face ID / Touch ID</b>: 앱 잠금을 켰을 때만 iOS가 본인 확인을 해요. 앱은 얼굴이나 지문 데이터를 받지 않아요.</li>
<li><b>iCloud Drive</b>: 백업을 켰을 때만 기록 사본을 내 iCloud Drive에 저장하고, 복원할 때 읽어 와요.</li>
<li><b>CSV 내보내기·가져오기</b>: 직접 선택했을 때만 기록을 파일로 만들어 공유 시트에 넘기거나, 고른 파일에서 기록을 가져와요.</li>
<li><b>구매</b>: Tsumiage Pro 결제는 Apple이 처리해요. 개발자는 결제 정보를 받지 않아요.</li>
</ul></section>
<section><h2>수집하지 않는 정보</h2><p>광고, 추적, 분석, 충돌 수집 도구를 사용하지 않아요. 앱이 개발자에게 정보를 보내는 일은 없어요. 인터넷은 App Store 구매와, 백업을 켰을 때의 iCloud Drive(Apple 서비스)에만 사용해요.</p></section>
<section><h2>문의</h2><p>이 방침에 대한 문의: <a href="mailto:${EMAIL}">${EMAIL}</a>. 내용이 바뀌면 이 페이지에서 알려 드려요.</p></section>
</div>`;
  page.jsonld = [breadcrumbLd([['Tsumiage', 'ko/'], ['개인정보 처리방침', path]])];
  return page;
}

function terms() {
  const path = 'ko/terms.html';
  const page = { lang: 'ko', path, group: 'terms', type: 'doc', title: '이용약관 | Tsumiage', description: 'Tsumiage 이용약관. Tsumiage Pro(1회 구매)와 데이터에 관한 내용.', og: 'assets/og/ko.png', ogAlt: 'Tsumiage 이용약관' };
  page.main = `${crumbs(page, [['Tsumiage', 'ko/'], ['이용약관', path]])}
<div class="narrow doc">
<div class="page-head"><h1>이용약관</h1><p class="lead">최종 수정일: 2026년 11월 14일</p></div>
<section><h2>기본</h2><p>Tsumiage 이용에는 Apple의 표준 사용권 계약(<a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">Licensed Application End User License Agreement</a>)이 적용돼요. 이 페이지는 앱에 관한 내용을 추가로 설명해요.</p></section>
<section><h2>Tsumiage Pro</h2><ul>
<li>Tsumiage Pro는 1회 구매예요. 정기 결제가 없어요.</li>
<li>구매하면 목표 수 제한이 없어지고, 정기 적립 알림, 모든 그래프와 위젯 스타일, 자세한 분석, Face ID 잠금, CSV 내보내기를 쓸 수 있어요.</li>
<li>같은 Apple 계정의 기기와 가족 공유 구성원이 쓸 수 있어요. "구매 복원"으로 다시 켤 수 있어요.</li>
<li>환불은 Apple 규정에 따라 <a href="https://reportaproblem.apple.com/">reportaproblem.apple.com</a>에서 신청할 수 있어요.</li>
</ul></section>
<section><h2>데이터</h2><p>기록한 데이터는 iPhone 안과, 백업을 켰다면 내 iCloud Drive에 저장돼요. 기기 고장·분실·앱 삭제로 데이터가 사라져도 개발자는 책임지지 않아요. 중요한 기록은 iCloud Drive 백업이나 CSV 내보내기로 보관해 주세요.</p></section>
<section><h2>문의</h2><p><a href="mailto:${EMAIL}">${EMAIL}</a></p></section>
</div>`;
  page.jsonld = [breadcrumbLd([['Tsumiage', 'ko/'], ['이용약관', path]])];
  return page;
}

export function pagesKo(ctx) {
  return [landing(ctx), page52(), page100(), support(), privacy(), terms()];
}
