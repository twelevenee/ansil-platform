import lockersRaw from "./safetyLockers.json";
import guardiansRaw from "./guardianHouses.json";

export interface SafetyLocker {
  시설명: string;
  시도명: string;
  시군구명: string;
  소재지도로명주소: string;
  소재지지번주소: string;
  위도: string;
  경도: string;
  평일운영시작시각: string;
  평일운영종료시각: string;
  토요일운영시작시각: string;
  토요일운영종료시각: string;
  공휴일운영시작시각: string;
  공휴일운영종료시각: string;
  칸개수: string;
  관리기관전화번호: string;
  관리기관명: string;
  고객센터전화번호: string;
}

export interface GuardianHouse {
  점포명: string;
  시도명: string;
  시군구명: string;
  소재지도로명주소: string;
  소재지지번주소: string;
  위도: string;
  경도: string;
  여성안심지킴이집전화번호: string;
  관할경찰서명: string;
  지정연도: string;
  운영여부: string;
}

export const safetyLockers: SafetyLocker[] = (lockersRaw as any).records ?? [];
export const guardianHouses: GuardianHouse[] = (guardiansRaw as any).records ?? [];

export function getFacilitiesByRegion(region: string) {
  const lockers = safetyLockers.filter((l) => l.시도명 === region);
  const guardians = guardianHouses.filter((g) => g.시도명 === region && g.운영여부 === "Y");
  return { lockers, guardians };
}

export function getFacilityCounts(): {
  lockers: Record<string, number>;
  guardians: Record<string, number>;
} {
  const lockers: Record<string, number> = {};
  const guardians: Record<string, number> = {};

  safetyLockers.forEach((l) => {
    lockers[l.시도명] = (lockers[l.시도명] || 0) + 1;
  });
  guardianHouses.forEach((g) => {
    if (g.운영여부 === "Y") {
      guardians[g.시도명] = (guardians[g.시도명] || 0) + 1;
    }
  });

  return { lockers, guardians };
}

export const totalLockers = safetyLockers.length;
export const totalGuardians = guardianHouses.filter((g) => g.운영여부 === "Y").length;
export const totalFacilities = totalLockers + totalGuardians;
