import type { Team, TeamId, PlayerId } from "@/src/types/team";

export const DEFAULT_TEAM_ID: TeamId = "warriors";
export const DEFAULT_PLAYER_ID: PlayerId = "stephen-curry";

export const teamPlayersData: Team[] = [
  {
    id: "hawks",
    name: "Atlanta Hawks",
    abbreviation: "ATL",
    players: [
      {
        id: "jalen-johnson",
        name: "Jalen Johnson",
        firstName: "Jalen",
        lastName: "Johnson",
        jerseyNumber: "1",
        teamId: "hawks",
        position: "Forward",
        archetype: "Versatile Two-Way Forward"
      }
    ]
  },
  {
    id: "celtics",
    name: "Boston Celtics",
    abbreviation: "BOS",
    players: [
      {
        id: "jayson-tatum",
        name: "Jayson Tatum",
        firstName: "Jayson",
        lastName: "Tatum",
        jerseyNumber: "0",
        teamId: "celtics",
        position: "Forward-Guard",
        archetype: "Do-It-All Scorer"
      }
    ]
  },
  {
    id: "cavaliers",
    name: "Cleveland Cavaliers",
    abbreviation: "CLE",
    players: [
      {
        id: "donovan-mitchell",
        name: "Donovan Mitchell",
        firstName: "Donovan",
        lastName: "Mitchell",
        jerseyNumber: "45",
        teamId: "cavaliers",
        position: "Guard",
        archetype: "Explosive Shot Creator"
      }
    ]
  },
  {
    id: "pelicans",
    name: "New Orleans Pelicans",
    abbreviation: "NOP",
    players: [
      {
        id: "trey-murphy-iii",
        name: "Trey Murphy III",
        firstName: "Trey",
        lastName: "Murphy III",
        jerseyNumber: "25",
        teamId: "pelicans",
        position: "Forward",
        archetype: "Three-Level Sniper"
      }
    ]
  },
  {
    id: "bulls",
    name: "Chicago Bulls",
    abbreviation: "CHI",
    players: [
      {
        id: "norman-powell",
        name: "Norman Powell",
        firstName: "Norman",
        lastName: "Powell",
        jerseyNumber: "24",
        teamId: "bulls",
        position: "Guard",
        archetype: "Instant-Offense Scorer"
      }
    ]
  },
  {
    id: "mavericks",
    name: "Dallas Mavericks",
    abbreviation: "DAL",
    players: [
      {
        id: "cooper-flagg",
        name: "Cooper Flagg",
        firstName: "Cooper",
        lastName: "Flagg",
        jerseyNumber: "32",
        teamId: "mavericks",
        position: "Forward",
        archetype: "Two-Way Phenom"
      }
    ]
  },
  {
    id: "nuggets",
    name: "Denver Nuggets",
    abbreviation: "DEN",
    players: [
      {
        id: "nikola-jokic",
        name: "Nikola Jokić",
        firstName: "Nikola",
        lastName: "Jokić",
        jerseyNumber: "15",
        teamId: "nuggets",
        position: "Center",
        archetype: "Playmaking Big Man"
      }
    ]
  },
  {
    id: "warriors",
    name: "Golden State Warriors",
    abbreviation: "GSW",
    players: [
      {
        id: "stephen-curry",
        name: "Stephen Curry",
        firstName: "Stephen",
        lastName: "Curry",
        jerseyNumber: "30",
        teamId: "warriors",
        position: "Guard",
        archetype: "Limitless Creator"
      }
    ]
  },
  {
    id: "rockets",
    name: "Houston Rockets",
    abbreviation: "HOU",
    players: [
      {
        id: "kevin-durant",
        name: "Kevin Durant",
        firstName: "Kevin",
        lastName: "Durant",
        jerseyNumber: "7",
        teamId: "rockets",
        position: "Forward",
        archetype: "Unstoppable Scorer"
      }
    ]
  },
  {
    id: "clippers",
    name: "Los Angeles Clippers",
    abbreviation: "LAC",
    players: [
      {
        id: "kawhi-leonard",
        name: "Kawhi Leonard",
        firstName: "Kawhi",
        lastName: "Leonard",
        jerseyNumber: "2",
        teamId: "clippers",
        position: "Forward",
        archetype: "Two-Way Enforcer"
      }
    ]
  },
  {
    id: "lakers",
    name: "Los Angeles Lakers",
    abbreviation: "LAL",
    players: [
      {
        id: "luka-doncic",
        name: "Luka Dončić",
        firstName: "Luka",
        lastName: "Dončić",
        jerseyNumber: "77",
        teamId: "lakers",
        position: "Forward-Guard",
        archetype: "Triple-Double Engine"
      }
    ]
  },
  {
    id: "heat",
    name: "Miami Heat",
    abbreviation: "MIA",
    players: [
      {
        id: "giannis-antetokounmpo",
        name: "Giannis Antetokounmpo",
        firstName: "Giannis",
        lastName: "Antetokounmpo",
        jerseyNumber: "7",
        teamId: "heat",
        position: "Forward",
        archetype: "Paint-Dominant Freak Athlete"
      }
    ]
  },
  {
    id: "bucks",
    name: "Milwaukee Bucks",
    abbreviation: "MIL",
    players: [
      {
        id: "tyler-herro",
        name: "Tyler Herro",
        firstName: "Tyler",
        lastName: "Herro",
        jerseyNumber: "11",
        teamId: "bucks",
        position: "Guard",
        archetype: "Microwave Scorer"
      }
    ]
  },
  {
    id: "timberwolves",
    name: "Minnesota Timberwolves",
    abbreviation: "MIN",
    players: [
      {
        id: "anthony-edwards",
        name: "Anthony Edwards",
        firstName: "Anthony",
        lastName: "Edwards",
        jerseyNumber: "5",
        teamId: "timberwolves",
        position: "Guard",
        archetype: "High-Flying Scorer"
      }
    ]
  },
  {
    id: "nets",
    name: "Brooklyn Nets",
    abbreviation: "BKN",
    players: [
      {
        id: "michael-porter-jr",
        name: "Michael Porter Jr.",
        firstName: "Michael",
        lastName: "Porter Jr.",
        jerseyNumber: "17",
        teamId: "nets",
        position: "Forward",
        archetype: "Sharpshooting Wing"
      }
    ]
  },
  {
    id: "knicks",
    name: "New York Knicks",
    abbreviation: "NYK",
    players: [
      {
        id: "jalen-brunson",
        name: "Jalen Brunson",
        firstName: "Jalen",
        lastName: "Brunson",
        jerseyNumber: "11",
        teamId: "knicks",
        position: "Guard",
        archetype: "Crafty Lead Guard"
      }
    ]
  },
  {
    id: "magic",
    name: "Orlando Magic",
    abbreviation: "ORL",
    players: [
      {
        id: "paolo-banchero",
        name: "Paolo Banchero",
        firstName: "Paolo",
        lastName: "Banchero",
        jerseyNumber: "5",
        teamId: "magic",
        position: "Forward",
        archetype: "Bulldozing Scorer"
      }
    ]
  },
  {
    id: "pacers",
    name: "Indiana Pacers",
    abbreviation: "IND",
    players: [
      {
        id: "pascal-siakam",
        name: "Pascal Siakam",
        firstName: "Pascal",
        lastName: "Siakam",
        jerseyNumber: "43",
        teamId: "pacers",
        position: "Forward",
        archetype: "Spin-Move Scorer"
      }
    ]
  },
  {
    id: "sixers",
    name: "Philadelphia 76ers",
    abbreviation: "PHI",
    players: [
      {
        id: "lebron-james",
        name: "LeBron James",
        firstName: "LeBron",
        lastName: "James",
        jerseyNumber: "23",
        teamId: "sixers",
        position: "Forward",
        archetype: "Ageless Floor General"
      }
    ]
  },
  {
    id: "suns",
    name: "Phoenix Suns",
    abbreviation: "PHX",
    players: [
      {
        id: "devin-booker",
        name: "Devin Booker",
        firstName: "Devin",
        lastName: "Booker",
        jerseyNumber: "15",
        teamId: "suns",
        position: "Guard",
        archetype: "Elite Bucket Getter"
      }
    ]
  },
  {
    id: "blazers",
    name: "Portland Trail Blazers",
    abbreviation: "POR",
    players: [
      {
        id: "deni-avdija",
        name: "Deni Avdija",
        firstName: "Deni",
        lastName: "Avdija",
        jerseyNumber: "8",
        teamId: "blazers",
        position: "Forward",
        archetype: "Do-It-All Wing"
      }
    ]
  },
  {
    id: "kings",
    name: "Sacramento Kings",
    abbreviation: "SAC",
    players: [
      {
        id: "zach-lavine",
        name: "Zach LaVine",
        firstName: "Zach",
        lastName: "LaVine",
        jerseyNumber: "8",
        teamId: "kings",
        position: "Guard",
        archetype: "High-Volume Scorer"
      }
    ]
  },
  {
    id: "spurs",
    name: "San Antonio Spurs",
    abbreviation: "SAS",
    players: [
      {
        id: "victor-wembanyama",
        name: "Victor Wembanyama",
        firstName: "Victor",
        lastName: "Wembanyama",
        jerseyNumber: "1",
        teamId: "spurs",
        position: "Forward-Center",
        archetype: "Unicorn Rim Protector"
      }
    ]
  },
  {
    id: "thunder",
    name: "Oklahoma City Thunder",
    abbreviation: "OKC",
    players: [
      {
        id: "shai-gilgeous-alexander",
        name: "Shai Gilgeous-Alexander",
        firstName: "Shai",
        lastName: "Gilgeous-Alexander",
        jerseyNumber: "2",
        teamId: "thunder",
        position: "Guard",
        archetype: "Elite Mid-Range Scorer"
      }
    ]
  },
  {
    id: "raptors",
    name: "Toronto Raptors",
    abbreviation: "TOR",
    players: [
      {
        id: "brandon-ingram",
        name: "Brandon Ingram",
        firstName: "Brandon",
        lastName: "Ingram",
        jerseyNumber: "3",
        teamId: "raptors",
        position: "Forward",
        archetype: "Smooth Shot-Maker"
      }
    ]
  },
  {
    id: "jazz",
    name: "Utah Jazz",
    abbreviation: "UTA",
    players: [
      {
        id: "lauri-markkanen",
        name: "Lauri Markkanen",
        firstName: "Lauri",
        lastName: "Markkanen",
        jerseyNumber: "23",
        teamId: "jazz",
        position: "Forward-Center",
        archetype: "Stretch Big Sniper"
      }
    ]
  },
  {
    id: "grizzlies",
    name: "Memphis Grizzlies",
    abbreviation: "MEM",
    players: [
      {
        id: "ty-jerome",
        name: "Ty Jerome",
        firstName: "Ty",
        lastName: "Jerome",
        jerseyNumber: "2",
        teamId: "grizzlies",
        position: "Guard-Forward",
        archetype: "Sparkplug Playmaker"
      }
    ]
  },
  {
    id: "wizards",
    name: "Washington Wizards",
    abbreviation: "WAS",
    players: [
      {
        id: "anthony-davis",
        name: "Anthony Davis",
        firstName: "Anthony",
        lastName: "Davis",
        jerseyNumber: "23",
        teamId: "wizards",
        position: "Forward-Center",
        archetype: "Two-Way Big Man"
      }
    ]
  },
  {
    id: "pistons",
    name: "Detroit Pistons",
    abbreviation: "DET",
    players: [
      {
        id: "cade-cunningham",
        name: "Cade Cunningham",
        firstName: "Cade",
        lastName: "Cunningham",
        jerseyNumber: "2",
        teamId: "pistons",
        position: "Guard",
        archetype: "Playmaking Floor General"
      }
    ]
  },
  {
    id: "hornets",
    name: "Charlotte Hornets",
    abbreviation: "CHA",
    players: [
      {
        id: "brandon-miller",
        name: "Brandon Miller",
        firstName: "Brandon",
        lastName: "Miller",
        jerseyNumber: "24",
        teamId: "hornets",
        position: "Forward",
        archetype: "Two-Way Wing Scorer"
      }
    ]
  }
];
