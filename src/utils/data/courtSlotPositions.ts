import type { CourtSlot } from "@/src/types/lineup";

export const COURT_SLOT_POSITIONS: Record<CourtSlot, { x: number; y: number }> = {
  PG: { x: 50, y: 30 },
  SG: { x: 80, y: 50 },
  SF: { x: 20, y: 50 },
  PF: { x: 68, y: 75 },
  C: { x: 32, y: 75 }
};
