import type { KeyboardEvent } from "react";
import type { CurryZone } from "@/lib/types";

type ZoneArrowProps = {
  zone: CurryZone;
  maxAttempts: number;
  selected: boolean;
  assistMode: boolean;
  onSelect: (zone: CurryZone) => void;
};

const BASKET_X = 50;
const BASKET_Y = 85.6;

const zoneAbbreviations: Record<string, string> = {
  "left-corner-3": "LC3",
  "left-wing": "LW",
  "left-above-break": "LAB",
  "center-above-break": "CAB",
  "right-above-break": "RAB",
  "right-wing": "RW",
  "right-corner-3": "RC3"
};

export function ZoneArrow({
  zone,
  maxAttempts,
  selected,
  assistMode,
  onSelect
}: ZoneArrowProps) {
  const vectorToBasketX = BASKET_X - zone.x;
  const vectorToBasketY = BASKET_Y - zone.y;
  const vectorLength = Math.hypot(vectorToBasketX, vectorToBasketY) || 1;
  const unitX = vectorToBasketX / vectorLength;
  const unitY = vectorToBasketY / vectorLength;
  const arrowLength = selected ? 15 : 13;
  const startX = zone.x;
  const startY = zone.y;
  const endX = zone.x + unitX * arrowLength;
  const endY = zone.y + unitY * arrowLength;
  const labelOffsetX = zone.x < 26 ? -4.5 : zone.x > 74 ? 4.5 : 0;
  const labelOffsetY = zone.y < 32 ? -5 : -4.2;
  const labelX = zone.x + labelOffsetX;
  const labelY = zone.y + labelOffsetY;
  const baseStrokeWidth = 2 + (zone.attempts / maxAttempts) * 5;
  const strokeWidth = Math.min(
    7,
    Math.max(2, baseStrokeWidth + (selected ? 0.75 : 0))
  );
  const arrowColor = assistMode ? "#FF8A22" : "#39FF88";
  const metricValue = assistMode ? zone.assistedMade : zone.attempts;
  const markerId = assistMode ? "assist-arrowhead" : "all-arrowhead";
  const glowId = assistMode ? "assistGlow" : "allGlow";
  const abbreviation = zoneAbbreviations[zone.id] ?? zone.name;

  function handleKeyDown(event: KeyboardEvent<SVGGElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(zone);
    }
  }

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`Select ${zone.name}`}
      onClick={() => onSelect(zone)}
      onKeyDown={handleKeyDown}
      className="group cursor-pointer outline-none"
    >
      <title>{`${zone.name}: ${metricValue} ${
        assistMode ? "assisted makes" : "attempts"
      }`}</title>

      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        pointerEvents="stroke"
        stroke="transparent"
        strokeLinecap="round"
        strokeWidth="20"
        vectorEffect="non-scaling-stroke"
      />

      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={arrowColor}
        strokeLinecap="round"
        strokeWidth={strokeWidth + 5}
        vectorEffect="non-scaling-stroke"
        className={`transition duration-200 group-hover:opacity-60 ${
          selected ? "opacity-70" : "opacity-0"
        }`}
        filter={`url(#${glowId})`}
      />

      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        markerEnd={`url(#${markerId})`}
        stroke={arrowColor}
        strokeLinecap="round"
        strokeOpacity={selected ? 1 : 0.72}
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
        className="transition duration-200 group-hover:stroke-opacity-100"
        filter={selected ? `url(#${glowId})` : undefined}
      />

      <circle
        cx={zone.x}
        cy={zone.y}
        r="5.8"
        fill="transparent"
        pointerEvents="all"
      />
      <circle
        cx={zone.x}
        cy={zone.y}
        r={selected ? 2.9 : 2.25}
        fill={selected ? arrowColor : "#07101E"}
        stroke={arrowColor}
        strokeWidth={selected ? 1.25 : 0.9}
        vectorEffect="non-scaling-stroke"
        className="transition duration-200 group-hover:fill-white"
        filter={selected ? `url(#${glowId})` : undefined}
      />

      <rect
        x={labelX - 5.2}
        y={labelY - 2.9}
        width="10.4"
        height="5.8"
        rx="2.9"
        fill={selected ? "rgba(253,185,39,0.18)" : "rgba(2,6,17,0.72)"}
        stroke={selected ? arrowColor : "rgba(255,255,255,0.22)"}
        strokeWidth="0.7"
        vectorEffect="non-scaling-stroke"
        className="transition duration-200 group-hover:stroke-white"
      />
      <text
        x={labelX}
        y={labelY + 1}
        textAnchor="middle"
        className="select-none fill-white text-[2.6px] font-black tracking-tight"
      >
        {abbreviation}
      </text>
      <text
        x={zone.x}
        y={zone.y + 6.2}
        textAnchor="middle"
        className="select-none fill-slate-300 text-[2.2px] font-black opacity-70 transition duration-200 group-hover:opacity-100"
      >
        {metricValue}
      </text>
    </g>
  );
}
