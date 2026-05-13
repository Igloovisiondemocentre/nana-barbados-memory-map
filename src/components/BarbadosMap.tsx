import type { CSSProperties } from "react";
import type { FamilyPoint, MemoryPoint } from "../types";
import { assetPath } from "../utils/assets";

type BarbadosMapProps = {
  memories: MemoryPoint[];
  activeId: string;
  onSelect: (id: string) => void;
  minimal?: boolean;
  familyPoints?: FamilyPoint[];
  familyLayerVisible?: boolean;
  selectedFamilyPointId?: string | null;
  onSelectFamilyPoint?: (id: string) => void;
};

const parishLabels = [
  { label: "Saint\nLucy", x: 112, y: 112, rotate: -9 },
  { label: "Saint\nPeter", x: 123, y: 236, rotate: 4 },
  { label: "Saint\nAndrew", x: 254, y: 256, rotate: -9 },
  { label: "Saint\nJames", x: 96, y: 384, rotate: 2 },
  { label: "Saint\nJoseph", x: 326, y: 372, rotate: -7 },
  { label: "Saint\nThomas", x: 197, y: 435, rotate: 2 },
  { label: "Saint\nMichael", x: 127, y: 526, rotate: 1 },
  { label: "Christ\nChurch", x: 236, y: 604, rotate: -5 },
  { label: "Saint\nGeorge", x: 326, y: 520, rotate: 3 },
  { label: "Saint\nJohn", x: 407, y: 430, rotate: -21 },
];

const barbadosPath =
  "M482.0 408.6 L475.6 480.8 L423.2 535.1 L382.2 563.5 L358.2 580.2 L314.7 624.7 L298.7 626.7 L285.6 626.5 L273.0 628.7 L259.1 637.6 L239.0 602.9 L201.2 581.3 L155.4 570.4 L128.1 568.5 L112.0 567.4 L84.6 547.8 L61.0 501.8 L34.6 408.6 L18.0 126.1 L22.1 93.6 L36.5 66.1 L65.5 36.2 L102.4 22.4 L139.9 42.9 L168.0 85.4 L177.8 106.6 L192.0 137.5 L231.1 222.4 L258.1 259.7 L295.9 288.8 L349.5 329.8 L380.4 347.7 L420.4 360.8 L458.1 378.2 L482.0 408.6 Z";

const labelOffsets: Record<string, { x: number; y: number; anchor: "start" | "end" }> = {
  "natural-environment": { x: 200, y: -67, anchor: "start" },
  village: { x: 275, y: 33, anchor: "start" },
  school: { x: -105, y: -6, anchor: "end" },
  "family-heritage": { x: 180, y: 175, anchor: "start" },
  "accent-language": { x: 110, y: 175, anchor: "start" },
  "northern-point-caves": { x: 140, y: -68, anchor: "start" },
  "universities-colonisation": { x: -75, y: 26, anchor: "end" },
  "nicknames-middle-names": { x: 225, y: -55, anchor: "start" },
  "dads-education": { x: -135, y: -40, anchor: "end" },
  "patricia-memory": { x: -115, y: 14, anchor: "end" },
  "anne-downy-roots": { x: 240, y: -81, anchor: "start" },
  "anne-downy-care": { x: 210, y: 31, anchor: "start" },
  "anne-downy-farms": { x: -165, y: 131, anchor: "end" },
  "leaving-barbados": { x: 80, y: 29, anchor: "start" },
  "sugar-food-economics": { x: 220, y: -75, anchor: "start" },
  "advice-grandchildren": { x: 165, y: 52, anchor: "start" },
};

const mapWidth = 500;
const mapHeight = 660;

export function BarbadosMap({
  memories,
  activeId,
  onSelect,
  minimal = false,
  familyPoints = [],
  familyLayerVisible = false,
  selectedFamilyPointId = null,
  onSelectFamilyPoint,
}: BarbadosMapProps) {
  const portraitMemory = minimal
    ? memories.find((memory) => memory.id === "advice-grandchildren")
    : undefined;
  const mapMemories = minimal
    ? memories.filter((memory) => memory.id !== "advice-grandchildren")
    : memories;

  return (
    <div className={minimal ? "mapCanvas heroMapCanvas" : "mapCanvas"}>
      <div className={`barbadosMapFrame ${familyLayerVisible ? "familyLayerActive" : ""}`}>
      {minimal ? (
        <img
          className="mapStickerArt"
          src={assetPath("assets/images/barbados-scrapbook-map-sticker.png")}
          alt=""
          aria-hidden="true"
        />
      ) : null}
      <svg
        className="barbadosSvg"
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        role="img"
        aria-label="Map of Barbados with Nana's memory points"
      >
        <defs>
          <radialGradient id="waterWash" cx="50%" cy="50%" r="62%">
            <stop offset="0%" stopColor="#bde5f1" stopOpacity="0.18" />
            <stop offset="58%" stopColor="#63b9d3" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#2b86ad" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="islandFill" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#dfe7b8" />
            <stop offset="42%" stopColor="#f2e6b3" />
            <stop offset="100%" stopColor="#9db96d" />
          </linearGradient>
          <filter id="paperTexture">
            <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="4" seed="7" />
            <feColorMatrix type="saturate" values="0.25" />
            <feBlend mode="multiply" in2="SourceGraphic" />
          </filter>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#001650" floodOpacity="0.22" />
          </filter>
          <path id="barbadosShape" d={barbadosPath} />
        </defs>
        {minimal ? (
          <>
            <circle className="mapWaterHalo" cx="250" cy="334" r="318" />
            <circle className="mapWaterHalo second" cx="256" cy="352" r="266" />
            <g className="compassRose" transform="translate(62 92)">
              <path d="M0 -58 L13 -13 L58 0 L13 13 L0 58 L-13 13 L-58 0 L-13 -13 Z" />
              <path d="M0 -34 L8 -8 L34 0 L8 8 L0 34 L-8 8 L-34 0 L-8 -8 Z" />
              <text y="-72">N</text>
            </g>
          </>
        ) : null}
        <path
          className="seaLine one"
          d="M54 143 C126 98 184 115 250 72 C328 22 386 45 452 18"
        />
        <path
          className="seaLine two"
          d="M24 504 C108 455 202 480 288 430 C358 388 416 390 484 338"
        />
        {minimal ? (
          <use
            className="stickerIsland"
            href="#barbadosShape"
          />
        ) : null}
        <path
          className="coastlineGlow"
          d={barbadosPath}
        />
        <use
          className="island"
          href="#barbadosShape"
          filter="url(#softShadow)"
        />
        <path
          className="parishLine"
          d="M123 72 C147 152 129 218 107 284 C86 346 104 410 80 478 C70 507 78 538 101 564"
        />
        <path
          className="parishLine"
          d="M172 98 C212 172 228 227 249 284 C271 345 243 412 213 474 C190 520 210 573 241 614"
        />
        <path
          className="parishLine"
          d="M88 224 C160 220 244 225 323 266"
        />
        <path
          className="parishLine"
          d="M45 382 C128 360 230 361 382 366"
        />
        <path
          className="parishLine"
          d="M63 498 C143 481 224 492 337 516"
        />
        {minimal
          ? parishLabels.map((item) => (
              <text
                key={item.label}
                className="parishLabel"
                x={item.x}
                y={item.y}
                transform={`rotate(${item.rotate} ${item.x} ${item.y})`}
              >
                {item.label.split("\n").map((line, index) => (
                  <tspan key={`${item.label}-${line}-${index}`} x={item.x} dy={index === 0 ? 0 : 21}>
                    {line}
                  </tspan>
                ))}
              </text>
            ))
          : null}
        {minimal
          ? mapMemories.map((memory, index) => {
              const markerX = (memory.mapPosition.x / 100) * mapWidth;
              const markerY = (memory.mapPosition.y / 100) * mapHeight;
              const markerTone = ["toneBlue", "toneYellow", "toneGreen"][index % 3];
              const labelOffset =
                labelOffsets[memory.id] ??
                (memory.mapPosition.x > 62
                  ? { x: -30, y: -4, anchor: "end" as const }
                  : { x: 30, y: -4, anchor: "start" as const });

              return (
              <g
                key={memory.id}
                className={`svgMarker ${markerTone} ${memory.id === activeId ? "active" : ""}`}
                aria-hidden="true"
                transform={`translate(${markerX} ${markerY})`}
              >
                <ellipse className="pinShadow" cx="0" cy="14" rx="13" ry="6" />
                <line
                  className="pinLeader"
                  x1={labelOffset.anchor === "start" ? 15 : -15}
                  y1="-4"
                  x2={labelOffset.x + (labelOffset.anchor === "start" ? -8 : 8)}
                  y2={labelOffset.y - 4}
                />
                <path className="pinBody" d="M0 -18 C12 -18 22 -8 22 4 C22 18 7 28 0 38 C-7 28 -22 18 -22 4 C-22 -8 -12 -18 0 -18 Z" />
                <circle className="pinCore" r="7.8" />
                <text
                  className="pinLabel"
                  x={labelOffset.x}
                  y={labelOffset.y}
                  textAnchor={labelOffset.anchor}
                >
                  {memory.viewName}
                </text>
              </g>
              );
            })
          : null}
        {minimal && familyLayerVisible
          ? familyPoints.map((point) => {
              const markerX = (point.mapPosition.x / 100) * mapWidth;
              const markerY = (point.mapPosition.y / 100) * mapHeight;
              const isSelected = point.id === selectedFamilyPointId;

              return (
                <g
                  key={point.id}
                  className={`familySvgMarker ${point.category} ${isSelected ? "active" : ""}`}
                  aria-hidden="true"
                  transform={`translate(${markerX} ${markerY})`}
                >
                  <line
                    className="familyLeader"
                    x1={point.labelOffset.anchor === "start" ? 12 : -12}
                    y1="0"
                    x2={point.labelOffset.x + (point.labelOffset.anchor === "start" ? -7 : 7)}
                    y2={point.labelOffset.y - 3}
                  />
                  <circle className="familyMarkerHalo" r="14" />
                  <circle className="familyMarkerCore" r="7" />
                  <text
                    className="familyMarkerLabel"
                    x={point.labelOffset.x}
                    y={point.labelOffset.y}
                    textAnchor={point.labelOffset.anchor}
                  >
                    {point.shortLabel}
                  </text>
                </g>
              );
            })
          : null}
      </svg>
      {minimal
        ? mapMemories.map((memory) => (
            <button
              key={memory.id}
              type="button"
              className="svgMarkerNativeButton"
              style={{
                left: `${memory.mapPosition.x}%`,
                top: `${memory.mapPosition.y}%`,
              }}
              onClick={() => onSelect(memory.id)}
              aria-label={`Open memory: ${memory.title}`}
              title={memory.viewName}
            />
          ))
        : null}
      {minimal && familyLayerVisible
        ? familyPoints.map((point) => (
            <button
              key={point.id}
              type="button"
              className="familyMarkerNativeButton"
              style={{
                left: `${point.mapPosition.x}%`,
                top: `${point.mapPosition.y}%`,
              }}
              onClick={() => onSelectFamilyPoint?.(point.id)}
              aria-label={`Open family research point: ${point.title}`}
              title={point.title}
            />
          ))
        : null}
      </div>

      {minimal && portraitMemory ? (
        <button
          type="button"
          className={`portraitMemoryMarker ${portraitMemory.id === activeId ? "active" : ""}`}
          onClick={() => onSelect(portraitMemory.id)}
          aria-label={`Open memory: ${portraitMemory.title}`}
          title={portraitMemory.viewName}
        >
          <span />
          <strong>{portraitMemory.viewName}</strong>
        </button>
      ) : null}

      {!minimal && memories.map((memory, index) => (
        <button
          key={memory.id}
          type="button"
          className={`mapMarker ${minimal ? "heroMarker" : ""} ${memory.id === activeId ? "active" : ""}`}
          style={{
            left: `${memory.mapPosition.x}%`,
            top: `${memory.mapPosition.y}%`,
            "--delay": `${index * 90}ms`,
          } as CSSProperties}
          onClick={() => onSelect(memory.id)}
          aria-label={`Open memory: ${memory.title}`}
        >
          <span>{index + 1}</span>
          <strong>{memory.title}</strong>
        </button>
      ))}
    </div>
  );
}
