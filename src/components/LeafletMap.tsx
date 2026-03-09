import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getFacilitiesByRegion } from "@/data/safetyFacilities";
import type { SafetyLocker, GuardianHouse } from "@/data/safetyFacilities";
import { useLanguage } from "@/contexts/LanguageContext";

export interface RegionMarker {
  name: string;
  short: string;
  lat: number;
  lng: number;
  count: number;
}

const regions: RegionMarker[] = [
  { name: "서울특별시", short: "서울", lat: 37.5665, lng: 126.978, count: 42 },
  { name: "경기도", short: "경기", lat: 37.275, lng: 127.0094, count: 35 },
  { name: "인천광역시", short: "인천", lat: 37.4563, lng: 126.7052, count: 18 },
  { name: "대전광역시", short: "대전", lat: 36.3504, lng: 127.3845, count: 12 },
  { name: "대구광역시", short: "대구", lat: 35.8714, lng: 128.6014, count: 15 },
  { name: "부산광역시", short: "부산", lat: 35.1796, lng: 129.0756, count: 10 },
  { name: "광주광역시", short: "광주", lat: 35.1595, lng: 126.8526, count: 8 },
  { name: "울산광역시", short: "울산", lat: 35.5384, lng: 129.3114, count: 6 },
  { name: "세종특별자치시", short: "세종", lat: 36.48, lng: 126.9252, count: 5 },
  { name: "강원특별자치도", short: "강원", lat: 37.8228, lng: 128.1555, count: 8 },
  { name: "충청북도", short: "충북", lat: 36.6357, lng: 127.4917, count: 6 },
  { name: "충청남도", short: "충남", lat: 36.5184, lng: 126.8, count: 7 },
  { name: "전북특별자치도", short: "전북", lat: 35.8203, lng: 127.1088, count: 6 },
  { name: "전라남도", short: "전남", lat: 34.8161, lng: 126.4629, count: 7 },
  { name: "경상북도", short: "경북", lat: 36.4919, lng: 128.8889, count: 8 },
  { name: "경상남도", short: "경남", lat: 35.4606, lng: 128.2132, count: 7 },
  { name: "제주특별자치도", short: "제주", lat: 33.4996, lng: 126.5312, count: 5 },
];

function getMarkerStyle(count: number) {
  if (count === 0) return { size: 28, color: "#D1D5DB" };
  if (count >= 35) return { size: 48, color: "#D4637A" };
  if (count >= 25) return { size: 44, color: "#E8889E" };
  if (count >= 15) return { size: 40, color: "#F2B8C4" };
  if (count >= 10) return { size: 36, color: "#E4C8DB" };
  return { size: 32, color: "#C5D9F0" };
}

function createIcon(region: RegionMarker, isSelected: boolean) {
  const { size, color } = getMarkerStyle(region.count);
  const border = isSelected ? "3px solid #D4637A" : "2px solid white";
  const scale = isSelected ? "transform: scale(1.15);" : "";

  return L.divIcon({
    className: "leaflet-marker-custom",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border-radius:50%;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      color:white;font-weight:700;font-size:${size > 40 ? 11 : 10}px;
      border:${border};
      box-shadow:0 2px 8px rgba(232,136,158,0.3);
      cursor:pointer;transition:transform 0.2s;
      ${scale}
      font-family:Pretendard,sans-serif;
      line-height:1.2;
    ">
      <span>${region.short}</span>
      <span style="font-size:${size > 40 ? 10 : 9}px;opacity:0.9">${region.count}</span>
    </div>`,
  });
}

interface LeafletMapProps {
  selectedRegion: string | null;
  onRegionClick: (regionName: string) => void;
  programCounts?: Record<string, number>;
}

export function LeafletMap({ selectedRegion, onRegionClick, programCounts }: LeafletMapProps) {
  const { t } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const facilityLayersRef = useRef<L.LayerGroup[]>([]);

  const [showLockers, setShowLockers] = useState(true);
  const [showGuardians, setShowGuardians] = useState(true);

  const mergedRegions = regions.map((r) => ({
    ...r,
    count: programCounts?.[r.name] ?? 0,
  }));

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [35.95, 127.7],
      zoom: 7,
      minZoom: 6,
      maxZoom: 12,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update region markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    mergedRegions.forEach((region) => {
      const isSelected = selectedRegion === region.name;
      const marker = L.marker([region.lat, region.lng], {
        icon: createIcon({ ...region }, isSelected),
        zIndexOffset: 1000,
      });

      marker.on("click", () => onRegionClick(region.name));
      marker.on("mouseover", function () {
        const el = this.getElement();
        if (el) {
          const inner = el.querySelector("div") as HTMLElement;
          if (inner) inner.style.transform = "scale(1.15)";
        }
      });
      marker.on("mouseout", function () {
        const el = this.getElement();
        if (el) {
          const inner = el.querySelector("div") as HTMLElement;
          if (inner && selectedRegion !== region.name) inner.style.transform = "";
        }
      });

      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [mergedRegions, selectedRegion, onRegionClick]);

  // Update facility markers when region or toggles change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old facility layers
    facilityLayersRef.current.forEach((lg) => lg.remove());
    facilityLayersRef.current = [];

    if (!selectedRegion) return;

    const { lockers, guardians } = getFacilitiesByRegion(selectedRegion);

    if (showLockers) {
      const lockerGroup = L.layerGroup();
      lockers.forEach((l) => {
        const lat = parseFloat(l.위도);
        const lng = parseFloat(l.경도);
        if (isNaN(lat) || isNaN(lng)) return;
        const circle = L.circleMarker([lat, lng], {
          radius: 5,
          fillColor: "#7BA4D9",
          color: "#4A7EC2",
          weight: 1,
          fillOpacity: 0.7,
        });
        circle.bindPopup(`
          <div style="font-family:Pretendard,sans-serif;font-size:13px;line-height:1.5;min-width:180px">
            <strong style="color:#4A7EC2">📦 ${l.시설명}</strong><br/>
            <span style="color:#6B7280">${l.소재지도로명주소 || l.소재지지번주소}</span><br/>
            ${l.관리기관전화번호 ? `<span>📞 ${l.관리기관전화번호}</span><br/>` : ""}
            <span style="font-size:11px;color:#6B7280">${t("safety.weekday_hours")} ${l.평일운영시작시각}~${l.평일운영종료시각}</span>
          </div>
        `);
        circle.addTo(lockerGroup);
      });
      lockerGroup.addTo(map);
      facilityLayersRef.current.push(lockerGroup);
    }

    if (showGuardians) {
      const guardianGroup = L.layerGroup();
      guardians.forEach((g) => {
        const lat = parseFloat(g.위도);
        const lng = parseFloat(g.경도);
        if (isNaN(lat) || isNaN(lng)) return;
        const circle = L.circleMarker([lat, lng], {
          radius: 5,
          fillColor: "#E8889E",
          color: "#D4637A",
          weight: 1,
          fillOpacity: 0.7,
        });
        circle.bindPopup(`
          <div style="font-family:Pretendard,sans-serif;font-size:13px;line-height:1.5;min-width:180px">
            <strong style="color:#D4637A">🏪 ${g.점포명}</strong><br/>
            <span style="color:#6B7280">${g.소재지도로명주소 || g.소재지지번주소}</span><br/>
            ${g.여성안심지킴이집전화번호 ? `<span>📞 ${g.여성안심지킴이집전화번호}</span><br/>` : ""}
            <span style="font-size:11px;color:#6B7280">${t("common.jurisdiction")}: ${g.관할경찰서명}</span>
          </div>
        `);
        circle.addTo(guardianGroup);
      });
      guardianGroup.addTo(map);
      facilityLayersRef.current.push(guardianGroup);
    }
  }, [selectedRegion, showLockers, showGuardians]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      <div ref={mapRef} className="h-[400px] w-full md:h-[500px] lg:h-[550px]" />

      {/* Legend / Toggle */}
      <div className="absolute right-3 top-3 z-[1000] flex flex-col gap-1.5 rounded-xl bg-card/95 p-2.5 shadow-card backdrop-blur-sm border border-border/50">
        <button
          onClick={() => setShowLockers((v) => !v)}
          className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors min-h-[32px] ${
            showLockers ? "bg-sky-light text-sky-deep" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-sky-mid" />
          {t("safety.lockers")}
        </button>
        <button
          onClick={() => setShowGuardians((v) => !v)}
          className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors min-h-[32px] ${
            showGuardians ? "bg-rose-light text-rose-deep" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-mid" />
          {t("safety.guardians")}
        </button>
      </div>

      <style>{`
        .leaflet-marker-custom { background: none !important; border: none !important; }
        .leaflet-tile-pane { filter: hue-rotate(-15deg) saturate(0.3) brightness(1.05) sepia(0.15); }
        .leaflet-control-attribution { opacity: 0.5; font-size: 10px; }
        .leaflet-control-zoom a {
          background: white !important;
          color: #D4637A !important;
          border-color: #FCEAEF !important;
        }
        .leaflet-control-zoom a:hover {
          background: #FCEAEF !important;
        }
      `}</style>
    </div>
  );
}
