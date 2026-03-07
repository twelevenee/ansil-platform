import { useState } from "react";
import { RegionData } from "@/data/mockData";

// Simplified SVG paths for South Korea's 17 regions
// These are approximate shapes positioned in a ~500x600 viewBox
const regionPaths: { id: string; d: string; cx: number; cy: number }[] = [
  // 서울
  { id: "seoul", d: "M185,165 L200,158 L215,162 L218,175 L210,185 L195,188 L185,180Z", cx: 200, cy: 173 },
  // 인천
  { id: "incheon", d: "M160,160 L175,155 L185,165 L185,180 L175,190 L162,185 L155,172Z", cx: 170, cy: 173 },
  // 경기도
  { id: "gyeonggi", d: "M155,120 L190,110 L230,115 L250,135 L248,160 L235,175 L218,175 L215,162 L200,158 L185,165 L185,180 L195,188 L210,185 L218,175 L235,175 L240,195 L225,210 L195,215 L170,205 L155,190 L150,170 L140,150Z", cx: 210, cy: 155 },
  // 강원도
  { id: "gangwon", d: "M230,115 L270,95 L320,90 L350,110 L340,150 L310,175 L280,185 L250,190 L240,195 L235,175 L248,160 L250,135Z", cx: 290, cy: 140 },
  // 충청북도
  { id: "chungbuk", d: "M195,215 L225,210 L250,190 L280,185 L290,200 L280,230 L260,245 L235,250 L210,240 L195,225Z", cx: 240, cy: 225 },
  // 세종
  { id: "sejong", d: "M185,228 L195,225 L200,235 L195,242 L185,240Z", cx: 192, cy: 234 },
  // 대전
  { id: "daejeon", d: "M195,242 L210,240 L218,250 L212,260 L198,258 L192,250Z", cx: 205, cy: 250 },
  // 충청남도
  { id: "chungnam", d: "M120,200 L155,190 L170,205 L185,228 L185,240 L192,250 L198,258 L190,275 L165,280 L140,265 L120,240 L110,220Z", cx: 155, cy: 240 },
  // 전북
  { id: "jeonbuk", d: "M140,265 L165,280 L190,275 L198,258 L212,260 L225,270 L230,290 L210,310 L180,315 L155,305 L135,290Z", cx: 180, cy: 290 },
  // 대구
  { id: "daegu", d: "M280,260 L295,255 L305,265 L300,280 L285,282 L275,272Z", cx: 290, cy: 270 },
  // 경상북도
  { id: "gyeongbuk", d: "M260,245 L280,230 L290,200 L310,175 L340,180 L365,200 L370,230 L355,255 L330,270 L305,265 L295,255 L280,260 L275,272 L260,268 L250,258Z", cx: 320, cy: 230 },
  // 울산
  { id: "ulsan", d: "M330,290 L350,280 L365,290 L360,305 L345,310 L330,300Z", cx: 348, cy: 295 },
  // 경상남도
  { id: "gyeongnam", d: "M210,310 L230,290 L260,268 L275,272 L285,282 L300,280 L305,265 L330,270 L330,290 L330,300 L345,310 L340,330 L310,345 L280,350 L250,340 L225,330Z", cx: 280, cy: 315 },
  // 부산
  { id: "busan", d: "M310,345 L330,335 L345,340 L348,358 L335,365 L318,360Z", cx: 330, cy: 350 },
  // 광주
  { id: "gwangju", d: "M155,320 L170,315 L178,325 L172,335 L158,335 L150,328Z", cx: 164, cy: 327 },
  // 전라남도
  { id: "jeonnam", d: "M110,310 L135,290 L155,305 L180,315 L155,320 L150,328 L158,335 L172,335 L178,325 L195,330 L210,350 L200,375 L175,390 L145,395 L120,380 L100,355 L105,330Z", cx: 155, cy: 360 },
  // 제주
  { id: "jeju", d: "M120,440 L160,430 L185,440 L190,458 L170,470 L140,472 L115,460Z", cx: 155, cy: 452 },
];

interface KoreaMapProps {
  selectedRegion: string | null;
  onRegionClick: (regionId: string) => void;
  programCounts: Record<string, number>;
}

function getIntensity(count: number, max: number): number {
  return 0.15 + (count / max) * 0.65;
}

export function KoreaMap({ selectedRegion, onRegionClick, programCounts }: KoreaMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const maxCount = Math.max(...Object.values(programCounts));

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const regionNames: Record<string, string> = {
    seoul: "서울특별시", busan: "부산광역시", daegu: "대구광역시", incheon: "인천광역시",
    gwangju: "광주광역시", daejeon: "대전광역시", ulsan: "울산광역시", sejong: "세종특별자치시",
    gyeonggi: "경기도", gangwon: "강원특별자치도", chungbuk: "충청북도", chungnam: "충청남도",
    jeonbuk: "전북특별자치도", jeonnam: "전라남도", gyeongbuk: "경상북도", gyeongnam: "경상남도",
    jeju: "제주특별자치도",
  };

  return (
    <div className="relative w-full">
      <svg
        viewBox="80 70 320 420"
        className="w-full h-auto"
        onMouseMove={handleMouseMove}
      >
        {/* Background */}
        <rect x="80" y="70" width="320" height="420" fill="transparent" />

        {regionPaths.map((region) => {
          const count = programCounts[region.id] || 0;
          const intensity = getIntensity(count, maxCount);
          const isHovered = hoveredRegion === region.id;
          const isSelected = selectedRegion === region.id;

          return (
            <g key={region.id}>
              <path
                d={region.d}
                fill={`hsla(5, 72%, 66%, ${intensity})`}
                stroke={isSelected ? "hsl(213, 52%, 25%)" : isHovered ? "hsl(5, 72%, 56%)" : "hsl(var(--border))"}
                strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                onClick={() => onRegionClick(region.id)}
              />
              {/* Count circle */}
              <circle
                cx={region.cx}
                cy={region.cy}
                r={count > 20 ? 14 : count > 10 ? 12 : 10}
                fill="hsl(var(--card))"
                stroke={isSelected ? "hsl(213, 52%, 25%)" : "hsl(var(--border))"}
                strokeWidth={isSelected ? 1.5 : 0.8}
                className="cursor-pointer pointer-events-none"
                opacity={0.95}
              />
              <text
                x={region.cx}
                y={region.cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={count > 20 ? 10 : 9}
                fontWeight="700"
                fill="hsl(5, 72%, 66%)"
                className="pointer-events-none select-none"
              >
                {count}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredRegion && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground shadow-lg"
          style={{
            left: tooltipPos.x + 12,
            top: tooltipPos.y - 10,
            transform: "translateY(-100%)",
          }}
        >
          {regionNames[hoveredRegion]}: {programCounts[hoveredRegion] || 0}건
        </div>
      )}
    </div>
  );
}
