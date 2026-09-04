import type { PlayerId } from "@/src/types/team";

export type CoachInsightTone = "strength" | "warning" | "player";

export type CoachInsight = {
  id: string;
  title: string;
  body: string;
  tone: CoachInsightTone;
};

export const coachInsightRules = {
  lowThreePointPct: 34,
  highZoneEfficiency: 55,
  lowZoneEfficiency: 35,
  minimumZoneAttempts: 2,
  playerGuidance: {
    "stephen-curry":
      "Use spacing, off-ball movement, transition threes, and his high-volume perimeter gravity to stretch the defense.",
    "lebron-james":
      "Use rim pressure, paint touches, drive-and-kick actions, and mismatch hunting to bend the defense.",
    "jalen-johnson":
      "Use transition pace, cutting off two-side actions, and versatile frontcourt switches to attack mismatches in space.",
    "jayson-tatum":
      "Use isolation triple-threat reads, midrange pull-ups, and secondary pick-and-pop actions to create high-value looks.",
    "donovan-mitchell":
      "Use downhill drives, step-back threes, and pick-and-roll attacks to pressure the rim and collapse the defense.",
    "trey-murphy-iii":
      "Use movement shooting off screens, corner spacing, and trailing transition threes to stretch the floor.",
    "norman-powell":
      "Use off-ball relocation, catch-and-shoot reps, and instant-offense bench bursts to punish tired second units.",
    "cooper-flagg":
      "Use straight-line drives, secondary playmaking reps, and switchable defense to create advantages in space.",
    "nikola-jokic":
      "Use high-post facilitation, short-roll passing, and face-up post touches to generate easy looks for teammates.",
    "kevin-durant":
      "Use elevated pull-up jumpers, mismatch post-ups, and pick-and-pop spacing to score over any coverage.",
    "kawhi-leonard":
      "Use methodical isolation scoring, midrange footwork, and two-way pressure to control tempo.",
    "luka-doncic":
      "Use pick-and-roll manipulation, stepback threes, and live-dribble playmaking to bend the defense.",
    "giannis-antetokounmpo":
      "Use downhill drives, transition finishes, and offensive rebounding to overwhelm the paint.",
    "tyler-herro":
      "Use pull-up shooting off screens, pick-and-roll ball-handling, and microwave scoring bursts to swing momentum.",
    "anthony-edwards":
      "Use explosive rim attacks, spot-up threes, and pick-and-roll scoring reps to pressure the defense vertically.",
    "michael-porter-jr":
      "Use spot-up movement shooting and trailing transition threes to space the floor around primary creators.",
    "jalen-brunson":
      "Use tight pick-and-roll footwork, midrange scoring, and change-of-pace drives to break down defenders.",
    "paolo-banchero":
      "Use bully-ball post touches, downhill drives, and secondary playmaking to collapse the defense.",
    "pascal-siakam":
      "Use spin-move face-ups, pick-and-pop jumpers, and transition scoring to keep the offense flowing.",
    "devin-booker":
      "Use off-screen scoring reps, pick-and-roll pull-ups, and shot-creation isolations to generate high-volume looks.",
    "deni-avdija":
      "Use secondary ball-handling, transition finishes, and versatile spacing to fill gaps around primary scorers.",
    "zach-lavine":
      "Use movement shooting, pick-and-roll scoring, and transition bursts to generate quick offense.",
    "victor-wembanyama":
      "Use rim protection into transition finishes, popping jumpers, and switchable coverage to control both ends.",
    "shai-gilgeous-alexander":
      "Use mid-range shot-making, change-of-pace drives, and foul-drawing paint touches to control tempo.",
    "brandon-ingram":
      "Use smooth midrange footwork, pick-and-roll scoring, and secondary shot creation to generate efficient looks.",
    "lauri-markkanen":
      "Use movement shooting, pick-and-pop spacing, and trailing transition threes to stretch opposing bigs.",
    "ty-jerome":
      "Use change-of-pace playmaking, pick-and-roll scoring, and bench-unit table-setting to generate easy offense.",
    "anthony-davis":
      "Use rim protection into rolls, mid-post scoring, and rebound-to-outlet transitions to control the paint.",
    "cade-cunningham":
      "Use pick-and-roll manipulation, live-dribble playmaking, and pull-up scoring to orchestrate the offense.",
    "brandon-miller":
      "Use movement shooting, secondary shot creation, and versatile wing defense to space the floor."
  } satisfies Record<PlayerId, string>
};
