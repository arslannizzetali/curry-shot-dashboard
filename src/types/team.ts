export type TeamId =
  | "hawks"
  | "celtics"
  | "cavaliers"
  | "pelicans"
  | "bulls"
  | "mavericks"
  | "nuggets"
  | "warriors"
  | "rockets"
  | "clippers"
  | "lakers"
  | "heat"
  | "bucks"
  | "timberwolves"
  | "nets"
  | "knicks"
  | "magic"
  | "pacers"
  | "sixers"
  | "suns"
  | "blazers"
  | "kings"
  | "spurs"
  | "thunder"
  | "raptors"
  | "jazz"
  | "grizzlies"
  | "wizards"
  | "pistons"
  | "hornets";

export type PlayerId =
  | "jalen-johnson"
  | "jayson-tatum"
  | "donovan-mitchell"
  | "trey-murphy-iii"
  | "norman-powell"
  | "cooper-flagg"
  | "nikola-jokic"
  | "stephen-curry"
  | "kevin-durant"
  | "kawhi-leonard"
  | "luka-doncic"
  | "giannis-antetokounmpo"
  | "tyler-herro"
  | "anthony-edwards"
  | "michael-porter-jr"
  | "jalen-brunson"
  | "paolo-banchero"
  | "pascal-siakam"
  | "lebron-james"
  | "devin-booker"
  | "deni-avdija"
  | "zach-lavine"
  | "victor-wembanyama"
  | "shai-gilgeous-alexander"
  | "brandon-ingram"
  | "lauri-markkanen"
  | "ty-jerome"
  | "anthony-davis"
  | "cade-cunningham"
  | "brandon-miller";

export type TeamTheme = {
  teamId: TeamId;
  primary: string;
  accent: string;
  surface: string;
  textOnPrimary: string;
};

export type Player = {
  id: PlayerId;
  name: string;
  firstName: string;
  lastName: string;
  jerseyNumber: string;
  teamId: TeamId;
  position: string;
  archetype: string;
};

export type Team = {
  id: TeamId;
  name: string;
  abbreviation: string;
  players: Player[];
};
