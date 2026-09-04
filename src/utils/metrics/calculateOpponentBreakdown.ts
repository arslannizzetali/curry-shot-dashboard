import type { Shot } from "@/src/types/shot";

export type OpponentBreakdownItem = {
  opponent: string;
  attempts: number;
  makes: number;
  fieldGoalPct: number;
  threePointAttempts: number;
  threePointMakes: number;
  threePointPct: number;
};

export function calculateOpponentBreakdown(shots: Shot[]): OpponentBreakdownItem[] {
  const opponentMap = new Map<string, OpponentBreakdownItem>();

  shots.forEach((shot) => {
    const current = opponentMap.get(shot.opponent) ?? {
      opponent: shot.opponent,
      attempts: 0,
      makes: 0,
      fieldGoalPct: 0,
      threePointAttempts: 0,
      threePointMakes: 0,
      threePointPct: 0
    };

    const made = shot.shotResult === "made";
    const isThree = shot.shotType === "3PT Field Goal";

    current.attempts += 1;
    current.makes += made ? 1 : 0;
    current.threePointAttempts += isThree ? 1 : 0;
    current.threePointMakes += isThree && made ? 1 : 0;

    opponentMap.set(shot.opponent, current);
  });

  return Array.from(opponentMap.values())
    .map((opponent) => ({
      ...opponent,
      fieldGoalPct: opponent.attempts > 0 ? (opponent.makes / opponent.attempts) * 100 : 0,
      threePointPct:
        opponent.threePointAttempts > 0
          ? (opponent.threePointMakes / opponent.threePointAttempts) * 100
          : 0
    }))
    .sort((firstOpponent, secondOpponent) => secondOpponent.fieldGoalPct - firstOpponent.fieldGoalPct);
}
