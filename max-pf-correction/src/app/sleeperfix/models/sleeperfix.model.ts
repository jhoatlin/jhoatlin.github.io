export interface SleeperCorrectedData {
    roster_id: number;
    owner_id: string;
    teamname: string;
    originaltotalmaxpoints: number;
    newtotalmaxpoints: number;
    originaloptimalLineup: { [key: number]: OptimalLineup[] };
    newoptimalLineup: { [key: number]: OptimalLineup[] };
  }
  
  export interface OptimalLineup {
    player_id: string;
    player_name: string;
    positions: string[];
    used_position: string;
    optimal_position: string;
    points: number;
    isInOptimalLineup: boolean;
    isDifferent: boolean;
}

// export class SleeperLeague {
//     Name: string;
//     total_rosters: number;
//     LeagueType: string;
//     teamnames: { [key: number]: string };
//     weeks: number[];
//     roster_positions: string[];
//     scoring_settings: { [key: string]: number };
//     settings: { [key: string]: number };
//     correctedData: SleeperCorrectedData[];
// }

// player.interface.ts
export interface Player {
  full_name: string;
  fantasy_positions: string[] | null;
}

export interface SleeperLeague {
  name: string;
  total_rosters: number;
  leagueType: string;
  teamnames: { [key: number]: string };
  weeks: number[];
  roster_positions: string[];
  scoring_settings: { [key: string]: number };
  settings: { [key: string]: number };
  correctedData: SleeperCorrectedData[];
}

export interface SleeperCorrectedData {
  // Define properties for SleeperCorrectedData if needed
}

export interface SleeperTeam {
  roster_id: number;
  owner_id: string;
  settings: SleeperTeamDetails;
}

export interface SleeperTeamDetails {
  fpts: number;
  fpts_decimal: number;
  ppts: number;
  ppts_decimal: number;
  roster_id: number;
  corrected_ppts: number;
  corrected_ppts_decimal: number;
  calculated_fpts: number;
  calculated_fpts_decimal: number;
}

export interface SleeperMatchup {
  week: number;
  roster_id: number;
  players_points: { [key: string]: number };
}

export interface SleeperUsers {
  user_id: string;
  metadata: { [key: string]: string };
  display_name: string;
}

export interface CorrectedMaxPotentialPoints {
  roster_id: number;
  week: number;
  oldmaxpoints: number;
  maxpoints: number;
}

export interface SleeperMatchup {
  week: number;
  roster_id: number;
  players_points: { [playerId: string]: number };
}

