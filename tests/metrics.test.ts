import { describe, expect, it } from "vitest";
import { calculateSummaryMetrics } from "@/src/utils/metrics/calculateSummaryMetrics";
import { calculateZoneBreakdown } from "@/src/utils/metrics/calculateZoneBreakdown";
import { calculateOpponentBreakdown } from "@/src/utils/metrics/calculateOpponentBreakdown";
import { shot } from "./fixtures";

describe("calculateSummaryMetrics", () => {
  it("returns zeros, not NaN, for an empty selection", () => {
    const metrics = calculateSummaryMetrics([]);
    expect(metrics).toMatchObject({
      attempts: 0,
      makes: 0,
      fieldGoalPct: 0,
      threePointPct: 0,
      averageShotDistance: 0,
      topShotZone: "None"
    });
  });

  it("computes FG%, 3P% and average distance", () => {
    const metrics = calculateSummaryMetrics([
      shot("Restricted Area", true),
      shot("Restricted Area", false),
      shot("Left Corner 3", true),
      shot("Left Corner 3", false),
      shot("Left Corner 3", false)
    ]);
    expect(metrics.attempts).toBe(5);
    expect(metrics.makes).toBe(2);
    expect(metrics.fieldGoalPct).toBeCloseTo(40);
    expect(metrics.threePointAttempts).toBe(3);
    expect(metrics.threePointMakes).toBe(1);
    expect(metrics.threePointPct).toBeCloseTo(33.333, 2);
    expect(metrics.averageShotDistance).toBeCloseTo((5 * 2 + 25 * 3) / 5);
    expect(metrics.topShotZone).toBe("Left Corner 3");
  });
});

describe("calculateZoneBreakdown", () => {
  it("orders zones by attempts, then by FG%", () => {
    const zones = calculateZoneBreakdown([
      shot("Paint", true),
      shot("Paint", true),
      shot("Mid-Range", false),
      shot("Mid-Range", true),
      shot("Top of Key", true)
    ]);
    expect(zones.map((zone) => zone.zone)).toEqual(["Paint", "Mid-Range", "Top of Key"]);
    expect(zones[0]).toMatchObject({ attempts: 2, makes: 2, fieldGoalPct: 100 });
    expect(zones[1]).toMatchObject({ attempts: 2, makes: 1, fieldGoalPct: 50 });
  });
});

describe("calculateOpponentBreakdown", () => {
  it("groups by opponent and sorts by FG% descending", () => {
    const rows = calculateOpponentBreakdown([
      shot("Paint", true, { opponent: "Celtics" }),
      shot("Paint", false, { opponent: "Celtics" }),
      shot("Paint", true, { opponent: "Lakers" }),
      shot("Left Corner 3", true, { opponent: "Lakers" })
    ]);
    expect(rows.map((row) => row.opponent)).toEqual(["Lakers", "Celtics"]);
    expect(rows[0]).toMatchObject({
      attempts: 2,
      fieldGoalPct: 100,
      threePointAttempts: 1,
      threePointPct: 100
    });
    expect(rows[1]).toMatchObject({
      attempts: 2,
      fieldGoalPct: 50,
      threePointAttempts: 0,
      threePointPct: 0
    });
  });
});
