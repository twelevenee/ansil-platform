export interface RegionData {
  id: string;
  name: string;
  programCount: number;
  categories: {
    주거안전: number;
    귀가안전: number;
    생활지원: number;
    건강: number;
    커뮤니티: number;
  };
}

export const regionData: Record<string, RegionData> = {
  seoul: { id: "seoul", name: "서울특별시", programCount: 42, categories: { 주거안전: 15, 귀가안전: 10, 생활지원: 8, 건강: 5, 커뮤니티: 4 } },
  busan: { id: "busan", name: "부산광역시", programCount: 10, categories: { 주거안전: 3, 귀가안전: 2, 생활지원: 2, 건강: 2, 커뮤니티: 1 } },
  daegu: { id: "daegu", name: "대구광역시", programCount: 15, categories: { 주거안전: 5, 귀가안전: 3, 생활지원: 3, 건강: 2, 커뮤니티: 2 } },
  incheon: { id: "incheon", name: "인천광역시", programCount: 18, categories: { 주거안전: 6, 귀가안전: 4, 생활지원: 4, 건강: 2, 커뮤니티: 2 } },
  gwangju: { id: "gwangju", name: "광주광역시", programCount: 8, categories: { 주거안전: 3, 귀가안전: 2, 생활지원: 1, 건강: 1, 커뮤니티: 1 } },
  daejeon: { id: "daejeon", name: "대전광역시", programCount: 12, categories: { 주거안전: 4, 귀가안전: 3, 생활지원: 2, 건강: 2, 커뮤니티: 1 } },
  ulsan: { id: "ulsan", name: "울산광역시", programCount: 7, categories: { 주거안전: 2, 귀가안전: 2, 생활지원: 1, 건강: 1, 커뮤니티: 1 } },
  sejong: { id: "sejong", name: "세종특별자치시", programCount: 5, categories: { 주거안전: 2, 귀가안전: 1, 생활지원: 1, 건강: 1, 커뮤니티: 0 } },
  gyeonggi: { id: "gyeonggi", name: "경기도", programCount: 35, categories: { 주거안전: 12, 귀가안전: 8, 생활지원: 7, 건강: 5, 커뮤니티: 3 } },
  gangwon: { id: "gangwon", name: "강원특별자치도", programCount: 6, categories: { 주거안전: 2, 귀가안전: 1, 생활지원: 1, 건강: 1, 커뮤니티: 1 } },
  chungbuk: { id: "chungbuk", name: "충청북도", programCount: 7, categories: { 주거안전: 2, 귀가안전: 2, 생활지원: 1, 건강: 1, 커뮤니티: 1 } },
  chungnam: { id: "chungnam", name: "충청남도", programCount: 8, categories: { 주거안전: 3, 귀가안전: 2, 생활지원: 1, 건강: 1, 커뮤니티: 1 } },
  jeonbuk: { id: "jeonbuk", name: "전북특별자치도", programCount: 6, categories: { 주거안전: 2, 귀가안전: 1, 생활지원: 1, 건강: 1, 커뮤니티: 1 } },
  jeonnam: { id: "jeonnam", name: "전라남도", programCount: 7, categories: { 주거안전: 2, 귀가안전: 2, 생활지원: 1, 건강: 1, 커뮤니티: 1 } },
  gyeongbuk: { id: "gyeongbuk", name: "경상북도", programCount: 8, categories: { 주거안전: 3, 귀가안전: 2, 생활지원: 1, 건강: 1, 커뮤니티: 1 } },
  gyeongnam: { id: "gyeongnam", name: "경상남도", programCount: 7, categories: { 주거안전: 2, 귀가안전: 2, 생활지원: 1, 건강: 1, 커뮤니티: 1 } },
  jeju: { id: "jeju", name: "제주특별자치도", programCount: 5, categories: { 주거안전: 2, 귀가안전: 1, 생활지원: 1, 건강: 1, 커뮤니티: 0 } },
};

export const nationalCategories = {
  주거안전: 85,
  귀가안전: 45,
  생활지원: 35,
  건강: 30,
  커뮤니티: 15,
};

export const categoryColors: Record<string, string> = {
  주거안전: "hsl(var(--primary))",
  귀가안전: "hsl(var(--secondary))",
  생활지원: "hsl(var(--accent))",
  건강: "hsl(var(--success))",
  커뮤니티: "hsl(var(--muted-foreground))",
};

export const categoryColorClasses: Record<string, string> = {
  주거안전: "bg-primary",
  귀가안전: "bg-secondary",
  생활지원: "bg-accent",
  건강: "bg-success",
  커뮤니티: "bg-muted-foreground",
};

export const categoryBadgeClasses: Record<string, string> = {
  주거안전: "bg-primary/10 text-primary",
  귀가안전: "bg-secondary/10 text-secondary",
  생활지원: "bg-accent/10 text-accent",
  건강: "bg-success/10 text-success",
  커뮤니티: "bg-muted text-muted-foreground",
};

export interface Program {
  id: string;
  name: string;
  region: string;
  category: string;
  supportDetail: string;
  cost: string;
  costType: "free" | "paid";
  status: "open" | "closed";
  howToApply: string;
  applyPeriod: string;
  targetCondition: string;
  contact: string;
  applyUrl: string;
  sourceUrl: string;
}

export const mockPrograms: Record<string, Program[]> = {
  seoul: [
    { id: "se1", name: "안심홈세트 설치", region: "seoul", category: "주거안전", supportDetail: "현관 디지털 도어락, 창문 잠금장치, 현관 CCTV를 무료 설치합니다.", cost: "무료", costType: "free", status: "open", howToApply: "서울시 안심홈 홈페이지 온라인 신청", applyPeriod: "상시 (예산 소진 시 마감)", targetCondition: "서울시 거주 여성 1인가구", contact: "02-120", applyUrl: "https://www.seoul.go.kr", sourceUrl: "https://www.seoul.go.kr" },
    { id: "se2", name: "안심이 앱 귀가 서비스", region: "seoul", category: "귀가안전", supportDetail: "안심이 앱을 통해 실시간 위치 공유 및 긴급 신고가 가능합니다.", cost: "무료", costType: "free", status: "open", howToApply: "안심이 앱 다운로드 후 회원가입", applyPeriod: "상시", targetCondition: "서울시 거주 여성", contact: "02-120", applyUrl: "https://www.seoul.go.kr", sourceUrl: "https://www.seoul.go.kr" },
    { id: "se3", name: "병원 안심 동행 서비스", region: "seoul", category: "건강", supportDetail: "혼자 병원 방문이 어려운 분께 동행 매니저가 병원까지 함께합니다. 접수, 수납, 약 수령까지 도와드립니다.", cost: "무료", costType: "free", status: "open", howToApply: "서울시 120 다산콜 전화 예약", applyPeriod: "상시", targetCondition: "서울시 거주 1인가구", contact: "02-120", applyUrl: "https://www.seoul.go.kr", sourceUrl: "https://www.seoul.go.kr" },
    { id: "se4", name: "주택 안전점검 서비스", region: "seoul", category: "주거안전", supportDetail: "전문 점검반이 가스, 전기, 소방 시설 등 주택 안전상태를 무료 점검합니다.", cost: "무료", costType: "free", status: "open", howToApply: "동주민센터 방문 신청", applyPeriod: "2026.03 ~ 2026.11", targetCondition: "서울시 거주 여성 1인가구", contact: "02-120", applyUrl: "https://www.seoul.go.kr", sourceUrl: "https://www.seoul.go.kr" },
  ],
  daejeon: [
    { id: "dj1", name: "안심홈세트 설치", region: "daejeon", category: "주거안전", supportDetail: "현관 디지털 도어락, CCTV, 창문 잠금장치 등 안심홈세트를 무료로 설치해드립니다.", cost: "무료", costType: "free", status: "open", howToApply: "대전시청 여성정책과 방문 또는 온라인 신청", applyPeriod: "2026.01.01 ~ 2026.12.31", targetCondition: "대전시 거주 만 19세 이상 여성 1인가구", contact: "042-270-4561", applyUrl: "https://www.daejeon.go.kr", sourceUrl: "https://www.daejeon.go.kr" },
    { id: "dj2", name: "밤길 안심 귀가 서비스", region: "daejeon", category: "귀가안전", supportDetail: "야간 10시~새벽 1시 사이 안심 귀가 동행 서비스를 제공합니다.", cost: "무료", costType: "free", status: "open", howToApply: "안심귀가 앱 또는 전화 신청", applyPeriod: "상시 운영", targetCondition: "대전시 거주 여성", contact: "042-270-4562", applyUrl: "https://www.daejeon.go.kr", sourceUrl: "https://www.daejeon.go.kr" },
    { id: "dj3", name: "긴급 돌봄 서비스", region: "daejeon", category: "생활지원", supportDetail: "갑작스러운 질병이나 부상 시 긴급 돌봄 인력을 파견하여 생활을 지원합니다.", cost: "월 9,900원", costType: "paid", status: "open", howToApply: "대전시 돌봄콜센터 전화 신청", applyPeriod: "2026.03.01 ~ 2026.11.30", targetCondition: "대전시 거주 1인가구", contact: "042-270-4563", applyUrl: "https://www.daejeon.go.kr", sourceUrl: "https://www.daejeon.go.kr" },
    { id: "dj4", name: "마음건강 상담 프로그램", region: "daejeon", category: "건강", supportDetail: "전문 심리상담사가 1:1 대면/비대면 상담을 제공합니다. 연간 8회까지 무료.", cost: "무료", costType: "free", status: "open", howToApply: "대전시 정신건강복지센터 전화 또는 방문 예약", applyPeriod: "상시 (선착순 200명)", targetCondition: "대전시 거주 만 19~39세 여성 1인가구", contact: "042-270-4564", applyUrl: "https://www.daejeon.go.kr", sourceUrl: "https://www.daejeon.go.kr" },
    { id: "dj5", name: "1인가구 커뮤니티 모임", region: "daejeon", category: "커뮤니티", supportDetail: "같은 동네 1인가구끼리 소모임을 만들어 정기적으로 교류할 수 있는 프로그램입니다.", cost: "무료", costType: "free", status: "closed", howToApply: "대전시 자원봉사센터 온라인 신청", applyPeriod: "2026.04.01 ~ 2026.04.30 (모집 마감)", targetCondition: "대전시 거주 1인가구", contact: "042-270-4565", applyUrl: "https://www.daejeon.go.kr", sourceUrl: "https://www.daejeon.go.kr" },
    { id: "dj6", name: "귀가 안심택시 할인", region: "daejeon", category: "귀가안전", supportDetail: "야간 시간대 택시 이용 시 50% 할인 쿠폰을 월 4매 제공합니다.", cost: "무료", costType: "free", status: "open", howToApply: "대전시 교통과 앱에서 쿠폰 발급", applyPeriod: "2026.01.01 ~ 2026.12.31", targetCondition: "대전시 거주 만 19세 이상 여성", contact: "042-270-4566", applyUrl: "https://www.daejeon.go.kr", sourceUrl: "https://www.daejeon.go.kr" },
  ],
  daegu: [
    { id: "dg1", name: "여성안심귀갓길", region: "daegu", category: "귀가안전", supportDetail: "야간 귀가 시 경비원이 동행하는 안심귀갓길 서비스를 운영합니다.", cost: "무료", costType: "free", status: "open", howToApply: "대구시 안전콜센터 전화", applyPeriod: "상시", targetCondition: "대구시 거주 여성", contact: "053-120", applyUrl: "https://www.daegu.go.kr", sourceUrl: "https://www.daegu.go.kr" },
    { id: "dg2", name: "스마트 안심벨 설치", region: "daegu", category: "주거안전", supportDetail: "현관에 스마트 안심벨을 설치하여 위급 시 경비실과 바로 연결됩니다.", cost: "무료", costType: "free", status: "open", howToApply: "동주민센터 방문 신청", applyPeriod: "2026.01 ~ 2026.12", targetCondition: "대구시 거주 여성 1인가구", contact: "053-120", applyUrl: "https://www.daegu.go.kr", sourceUrl: "https://www.daegu.go.kr" },
  ],
  gyeonggi: [
    { id: "gg1", name: "경기 안심홈 보안 강화", region: "gyeonggi", category: "주거안전", supportDetail: "경기도 내 여성 1인가구에 현관 보안장치, 창문 잠금장치를 무료 설치합니다.", cost: "무료", costType: "free", status: "open", howToApply: "경기도청 온라인 신청", applyPeriod: "상시", targetCondition: "경기도 거주 여성 1인가구", contact: "031-120", applyUrl: "https://www.gg.go.kr", sourceUrl: "https://www.gg.go.kr" },
    { id: "gg2", name: "심리상담 바우처", region: "gyeonggi", category: "건강", supportDetail: "전문 심리상담 10회 바우처를 지원합니다. 대면/비대면 선택 가능.", cost: "무료", costType: "free", status: "open", howToApply: "경기도 정신건강센터 전화 예약", applyPeriod: "2026.01 ~ 2026.06", targetCondition: "경기도 거주 만 19~45세 1인가구", contact: "031-120", applyUrl: "https://www.gg.go.kr", sourceUrl: "https://www.gg.go.kr" },
    { id: "gg3", name: "반찬 배달 서비스", region: "gyeonggi", category: "생활지원", supportDetail: "주 2회 영양 반찬을 가정까지 배달합니다. 독거 여성 대상 맞춤 식단 제공.", cost: "월 15,000원", costType: "paid", status: "open", howToApply: "읍면동 주민센터 방문 신청", applyPeriod: "상시", targetCondition: "경기도 거주 1인가구", contact: "031-120", applyUrl: "https://www.gg.go.kr", sourceUrl: "https://www.gg.go.kr" },
  ],
  incheon: [
    { id: "ic1", name: "여성 안심 주거지원", region: "incheon", category: "주거안전", supportDetail: "인천시 여성 1인가구에 도어락, CCTV, 창문 잠금장치를 설치합니다.", cost: "무료", costType: "free", status: "open", howToApply: "인천시청 온라인 신청", applyPeriod: "상시", targetCondition: "인천시 거주 여성 1인가구", contact: "032-120", applyUrl: "https://www.incheon.go.kr", sourceUrl: "https://www.incheon.go.kr" },
    { id: "ic2", name: "1인가구 건강검진 지원", region: "incheon", category: "건강", supportDetail: "연 1회 종합건강검진 비용을 최대 20만원까지 지원합니다.", cost: "무료", costType: "free", status: "closed", howToApply: "인천시 보건소 방문 신청", applyPeriod: "2026.01 ~ 2026.03 (마감)", targetCondition: "인천시 거주 만 19~39세 1인가구", contact: "032-120", applyUrl: "https://www.incheon.go.kr", sourceUrl: "https://www.incheon.go.kr" },
  ],
  busan: [
    { id: "bs1", name: "안심 무인택배함", region: "busan", category: "주거안전", supportDetail: "1인가구 밀집 지역에 무인택배함을 설치하여 택배 도난을 방지합니다.", cost: "무료", costType: "free", status: "open", howToApply: "부산시청 온라인 신청", applyPeriod: "상시", targetCondition: "부산시 거주 1인가구", contact: "051-120", applyUrl: "https://www.busan.go.kr", sourceUrl: "https://www.busan.go.kr" },
    { id: "bs2", name: "이웃 연결 프로그램", region: "busan", category: "커뮤니티", supportDetail: "같은 아파트·동네 1인가구를 연결하여 정기 모임과 긴급 연락망을 구축합니다.", cost: "무료", costType: "free", status: "open", howToApply: "부산시 자원봉사센터 신청", applyPeriod: "상시", targetCondition: "부산시 거주 1인가구", contact: "051-120", applyUrl: "https://www.busan.go.kr", sourceUrl: "https://www.busan.go.kr" },
  ],
};

// Generate simple programs for other regions
const defaultPrograms = (regionId: string, regionName: string): Program[] => [
  { id: `${regionId}-1`, name: "안심홈세트 설치", region: regionId, category: "주거안전", supportDetail: `${regionName} 거주 여성 1인가구 대상 현관 보안장치 무료 설치 지원사업입니다.`, cost: "무료", costType: "free", status: "open", howToApply: "시청 여성정책과 방문 신청", applyPeriod: "상시", targetCondition: `${regionName} 거주 여성 1인가구`, contact: "1588-0000", applyUrl: "#", sourceUrl: "#" },
  { id: `${regionId}-2`, name: "안심 귀가 서비스", region: regionId, category: "귀가안전", supportDetail: "야간 귀가 시 안심 동행 서비스를 제공합니다.", cost: "무료", costType: "free", status: "open", howToApply: "전화 신청", applyPeriod: "상시", targetCondition: `${regionName} 거주 여성`, contact: "1588-0000", applyUrl: "#", sourceUrl: "#" },
];

Object.entries(regionData).forEach(([id, data]) => {
  if (!mockPrograms[id]) {
    mockPrograms[id] = defaultPrograms(id, data.name);
  }
});

export function getAllPrograms(): Program[] {
  return Object.values(mockPrograms).flat();
}

export const filterRegions = [
  { id: "all", name: "전체" },
  { id: "seoul", name: "서울특별시" },
  { id: "daejeon", name: "대전광역시" },
  { id: "daegu", name: "대구광역시" },
  { id: "gyeonggi", name: "경기도" },
  { id: "incheon", name: "인천광역시" },
  { id: "busan", name: "부산광역시" },
];

export const gapAlerts: Record<string, string> = {
  daejeon: "병원동행서비스, 주택관리서비스",
  busan: "안심택시, 커뮤니티 프로그램",
  daegu: "귀가동행서비스, 긴급돌봄",
  incheon: "심리상담, 주택관리서비스",
  gwangju: "안심택시, 병원동행서비스",
  ulsan: "커뮤니티 프로그램, 심리상담",
  sejong: "귀가동행서비스, 병원동행서비스",
  gyeonggi: "긴급돌봄, 주택관리서비스",
  gangwon: "안심택시, 심리상담, 커뮤니티 프로그램",
  chungbuk: "병원동행서비스, 안심택시",
  chungnam: "커뮤니티 프로그램, 긴급돌봄",
  jeonbuk: "주택관리서비스, 안심택시",
  jeonnam: "심리상담, 커뮤니티 프로그램",
  gyeongbuk: "귀가동행서비스, 병원동행서비스",
  gyeongnam: "안심택시, 긴급돌봄",
  jeju: "주택관리서비스, 커뮤니티 프로그램",
};
