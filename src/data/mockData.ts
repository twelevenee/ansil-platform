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
