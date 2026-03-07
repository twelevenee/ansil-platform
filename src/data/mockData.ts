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
  daejeon: [
    { id: "dj1", name: "안심홈세트 설치", region: "daejeon", category: "주거안전", supportDetail: "현관 디지털 도어락, CCTV, 창문 잠금장치 등 안심홈세트를 무료로 설치해드립니다. 1인가구 여성 대상으로 전문 업체가 방문 설치합니다.", cost: "무료", costType: "free", status: "open", howToApply: "대전시청 여성정책과 방문 또는 온라인 신청", applyPeriod: "2026.01.01 ~ 2026.12.31 (예산 소진 시 조기 마감)", targetCondition: "대전시 거주 만 19세 이상 여성 1인가구", contact: "042-270-4561", applyUrl: "https://www.daejeon.go.kr", sourceUrl: "https://www.daejeon.go.kr" },
    { id: "dj2", name: "밤길 안심 귀가 서비스", region: "daejeon", category: "귀가안전", supportDetail: "야간 10시~새벽 1시 사이 안심 귀가 동행 서비스를 제공합니다. 전화 한 통이면 안심 요원이 함께 걸어드립니다.", cost: "무료", costType: "free", status: "open", howToApply: "안심귀가 앱 또는 전화 신청", applyPeriod: "상시 운영", targetCondition: "대전시 거주 여성", contact: "042-270-4562", applyUrl: "https://www.daejeon.go.kr", sourceUrl: "https://www.daejeon.go.kr" },
    { id: "dj3", name: "긴급 돌봄 서비스", region: "daejeon", category: "생활지원", supportDetail: "갑작스러운 질병이나 부상 시 긴급 돌봄 인력을 파견하여 생활을 지원합니다. 최대 7일간 이용 가능합니다.", cost: "월 9,900원", costType: "paid", status: "open", howToApply: "대전시 돌봄콜센터 전화 신청", applyPeriod: "2026.03.01 ~ 2026.11.30", targetCondition: "대전시 거주 1인가구 (성별 무관)", contact: "042-270-4563", applyUrl: "https://www.daejeon.go.kr", sourceUrl: "https://www.daejeon.go.kr" },
    { id: "dj4", name: "마음건강 상담 프로그램", region: "daejeon", category: "건강", supportDetail: "전문 심리상담사가 1:1 대면/비대면 상담을 제공합니다. 연간 8회까지 무료로 이용할 수 있습니다.", cost: "무료", costType: "free", status: "open", howToApply: "대전시 정신건강복지센터 전화 또는 방문 예약", applyPeriod: "상시 운영 (선착순 200명)", targetCondition: "대전시 거주 만 19~39세 여성 1인가구", contact: "042-270-4564", applyUrl: "https://www.daejeon.go.kr", sourceUrl: "https://www.daejeon.go.kr" },
    { id: "dj5", name: "1인가구 커뮤니티 모임", region: "daejeon", category: "커뮤니티", supportDetail: "같은 동네 1인가구끼리 소모임을 만들어 정기적으로 교류할 수 있는 프로그램입니다. 월 1회 모임비 지원.", cost: "무료", costType: "free", status: "closed", howToApply: "대전시 자원봉사센터 온라인 신청", applyPeriod: "2026.04.01 ~ 2026.04.30 (모집 마감)", targetCondition: "대전시 거주 1인가구", contact: "042-270-4565", applyUrl: "https://www.daejeon.go.kr", sourceUrl: "https://www.daejeon.go.kr" },
    { id: "dj6", name: "귀가 안심택시 할인", region: "daejeon", category: "귀가안전", supportDetail: "야간 시간대 택시 이용 시 50% 할인 쿠폰을 월 4매 제공합니다. 대전시 인증 택시만 이용 가능합니다.", cost: "무료", costType: "free", status: "open", howToApply: "대전시 교통과 앱에서 쿠폰 발급", applyPeriod: "2026.01.01 ~ 2026.12.31", targetCondition: "대전시 거주 만 19세 이상 여성", contact: "042-270-4566", applyUrl: "https://www.daejeon.go.kr", sourceUrl: "https://www.daejeon.go.kr" },
  ],
  seoul: [
    { id: "se1", name: "안심홈세트 설치", region: "seoul", category: "주거안전", supportDetail: "현관 디지털 도어락, 창문 잠금장치, 현관 CCTV를 무료 설치합니다.", cost: "무료", costType: "free", status: "open", howToApply: "서울시 안심홈 홈페이지 온라인 신청", applyPeriod: "상시 (예산 소진 시 마감)", targetCondition: "서울시 거주 여성 1인가구", contact: "02-120", applyUrl: "https://www.seoul.go.kr", sourceUrl: "https://www.seoul.go.kr" },
    { id: "se2", name: "안심이 앱 귀가 서비스", region: "seoul", category: "귀가안전", supportDetail: "안심이 앱을 통해 실시간 위치 공유 및 긴급 신고가 가능합니다.", cost: "무료", costType: "free", status: "open", howToApply: "안심이 앱 다운로드 후 회원가입", applyPeriod: "상시", targetCondition: "서울시 거주 여성", contact: "02-120", applyUrl: "https://www.seoul.go.kr", sourceUrl: "https://www.seoul.go.kr" },
  ],
};

// Generate simple programs for other regions
const defaultPrograms = (regionId: string, regionName: string): Program[] => [
  { id: `${regionId}-1`, name: "안심홈세트 설치", region: regionId, category: "주거안전", supportDetail: `${regionName} 거주 여성 1인가구 대상 현관 보안장치 무료 설치 지원사업입니다.`, cost: "무료", costType: "free", status: "open", howToApply: "시청 여성정책과 방문 신청", applyPeriod: "상시", targetCondition: `${regionName} 거주 여성 1인가구`, contact: "1588-0000", applyUrl: "#", sourceUrl: "#" },
  { id: `${regionId}-2`, name: "안심 귀가 서비스", region: regionId, category: "귀가안전", supportDetail: `야간 귀가 시 안심 동행 서비스를 제공합니다.`, cost: "무료", costType: "free", status: "open", howToApply: "전화 신청", applyPeriod: "상시", targetCondition: `${regionName} 거주 여성`, contact: "1588-0000", applyUrl: "#", sourceUrl: "#" },
];

// Fill in missing regions
Object.entries(regionData).forEach(([id, data]) => {
  if (!mockPrograms[id]) {
    mockPrograms[id] = defaultPrograms(id, data.name);
  }
});

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
