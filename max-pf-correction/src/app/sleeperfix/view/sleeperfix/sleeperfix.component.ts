import { Component, ViewChild } from '@angular/core';
import { CorrectedMaxPotentialPoints, OptimalLineup, Player, SleeperCorrectedData, SleeperLeague, SleeperTeam, SleeperUsers } from '../../models/sleeperfix.model';
import { SleeperfixService } from '../../service/sleeperfix.service';
import { Table } from 'primeng/table';
import * as playerData from '../../../../assets/players.json';

@Component({
  selector: 'app-sleeperfix',
  templateUrl: './sleeperfix.component.html',
})
export class SleeperfixComponent {
  originallineup: OptimalLineup[] = [];
  correctedlineup: OptimalLineup[] = [];
  correctedtotal: number = 0;
  originaltotal: number = 0;
  selectedweek: number = 1;
  selectedroster: number = 1;

  affectedLineups: string[] = [];
  teamdropdownoptions: any[] = [];
  weeks: any[] = [];
  leagueDetails: SleeperLeague = {} as SleeperLeague;
  leagueTeams: SleeperTeam[] = [];
  leagueUsers: SleeperUsers[] = [];

  players: { [key: number]: Player } = {};

  order: string[] = ['QB', 'RB', 'RB', 'WR', 'WR', 'WR', 'TE', 'FLEX', 'SUPER_FLEX', 'DEF'];

  flexpositions: string[] = ["RB", "WR", "TE"];
  superflexpositions: string[] = ["QB", "RB", "WR", "TE"];
  correctedData: SleeperCorrectedData[] = [];
  starterpositions: string[] = [];
  remainingpositions: string[] = [];

  @ViewChild('dtCorrected') table: Table;

  constructor(private sleeperfixService: SleeperfixService) { }

  async ngOnInit() {
    // this.leagueDetails = await this.sleeperfixService.getCorrectedData('917516471591366656');
    // this.order = this.leagueDetails.roster_positions.filter(x => x != 'BN');
    // console.log(this.order);
    // this.originallineup = this.sortLineups(this.leagueDetails.correctedData[11].originaloptimalLineup[6].filter(x => x.isInOptimalLineup == true));
    // this.correctedlineup = this.sortLineups(this.leagueDetails.correctedData[11].newoptimalLineup[6].filter(x => x.isInOptimalLineup == true));
    // this.correctedtotal = this.leagueDetails.correctedData[11].newoptimalLineup[6].filter(x => x.isInOptimalLineup == true).reduce((a, b) => a + b.points, 0);
    // this.originaltotal = this.leagueDetails.correctedData[11].originaloptimalLineup[6].filter(x => x.isInOptimalLineup == true).reduce((a, b) => a + b.points, 0);
    // console.log(this.correctedlineup);

    // //get list of affected lineups
    // await this.getAffectedLineups();

    // //setup the dropdown options
    // await this.setupDropdownOptions();

    console.log(this.teamdropdownoptions);


    this.players = playerData as { [key: number]: Player };

    this.leagueDetails = await this.sleeperfixService.getLeagueInfo('917516471591366656');
    console.log(this.leagueDetails);

    this.leagueDetails.weeks = [];

    this.leagueDetails.leagueType = "";
    if (this.leagueDetails.roster_positions.includes("SUPER_FLEX")) {
      this.leagueDetails.leagueType += "SF";
    }
    const points: number | undefined = this.leagueDetails.scoring_settings["rec"];
    if (points !== undefined) {
      if (points >= 1) {
        if (this.leagueDetails.leagueType !== "") {
          this.leagueDetails.leagueType += " ";
        }
        this.leagueDetails.leagueType += "PPR";
      } else if (points > 0) {
        if (this.leagueDetails.leagueType !== "") {
          this.leagueDetails.leagueType += " ";
        }
        this.leagueDetails.leagueType += "HPPR";
      } else {
        if (this.leagueDetails.leagueType !== "") {
          this.leagueDetails.leagueType += " ";
        }
        this.leagueDetails.leagueType += "STD";
      }
    }

    this.leagueTeams = await this.sleeperfixService.getLeagueRosters('917516471591366656');
    console.log(this.leagueTeams);

    this.leagueUsers = await this.sleeperfixService.getLeagueUsers('917516471591366656');

    this.setTeamNames();
    console.log(this.leagueDetails);

    await this.getCorrectedLineup();

    this.order = this.leagueDetails.roster_positions.filter(x => x != 'BN');
    console.log(this.order);
    this.originallineup = this.sortLineups(this.leagueDetails.correctedData[11].originaloptimalLineup[6].filter(x => x.isInOptimalLineup == true));
    this.correctedlineup = this.sortLineups(this.leagueDetails.correctedData[11].newoptimalLineup[6].filter(x => x.isInOptimalLineup == true));
    this.correctedtotal = this.leagueDetails.correctedData[11].newoptimalLineup[6].filter(x => x.isInOptimalLineup == true).reduce((a, b) => a + b.points, 0);
    this.originaltotal = this.leagueDetails.correctedData[11].originaloptimalLineup[6].filter(x => x.isInOptimalLineup == true).reduce((a, b) => a + b.points, 0);
    console.log(this.correctedlineup);

    //get list of affected lineups
    await this.getAffectedLineups();

    //setup the dropdown options
    await this.setupDropdownOptions();
  }

  async setupDropdownOptions() {
    for (const team in this.leagueDetails.teamnames) {
      console.log(team);
      this.teamdropdownoptions.push({ label: this.leagueDetails.teamnames[team], value: team });

    }
    for (const week in this.leagueDetails.weeks) {
      this.weeks.push({ label: `Week ${this.leagueDetails.weeks[week]}`, value: this.leagueDetails.weeks[week] });
    }
  }


  async getAffectedLineups() {
    for (var i = 0; i < this.leagueDetails.correctedData.length; i++) {
      for (const week in this.leagueDetails.correctedData[i].newoptimalLineup) {
        if (this.leagueDetails.correctedData[i].newoptimalLineup[week].filter(x => x.isDifferent == true).length > 0) {
          this.affectedLineups.push(`Team: ${this.leagueDetails.correctedData[i].teamname} Week: ${week}`);
        }
      }

    }
  }

  sortLineups(lineup: OptimalLineup[]): OptimalLineup[] {
    return lineup.slice().sort((a, b) => {
      const indexA = this.order.indexOf(a.used_position);
      const indexB = this.order.indexOf(b.used_position);
      if (indexA !== indexB)
        return indexA - indexB;

      return b.points - a.points;
    });
  }

  update() {
    for (var i = 0; i < this.leagueDetails.correctedData.length; i++)
      if (this.leagueDetails.correctedData[i].roster_id == this.selectedroster) {
        this.correctedlineup = this.sortLineups(this.leagueDetails.correctedData[i].newoptimalLineup[this.selectedweek].filter(x => x.isInOptimalLineup == true));
        this.originallineup = this.sortLineups(this.leagueDetails.correctedData[i].originaloptimalLineup[this.selectedweek].filter(x => x.isInOptimalLineup == true));
        this.correctedtotal = this.leagueDetails.correctedData[i].newoptimalLineup[this.selectedweek].filter(x => x.isInOptimalLineup == true).reduce((a, b) => a + b.points, 0);
        this.originaltotal = this.leagueDetails.correctedData[i].originaloptimalLineup[this.selectedweek].filter(x => x.isInOptimalLineup == true).reduce((a, b) => a + b.points, 0);
      }

  }

  setTeamNames() {
    const teamnames: { [key: number]: string } = {};

    this.leagueUsers.forEach((user: SleeperUsers) => {
      let teamname = "";
      const name = user.metadata["team_name"];
      if (name) {
        teamname = `${name} (${user.display_name})`;
      } else {
        teamname = user.display_name;
      }
      this.leagueTeams.filter(x => x.owner_id === user.user_id)
        .forEach(x => teamnames[x.roster_id] = teamname);
    });

    this.leagueDetails.teamnames = teamnames;
  }

  async getCorrectedLineup() {
    const correctedmaxpointslist: CorrectedMaxPotentialPoints[] = [];
    let start = 0;
    let end = 0;

    if (this.leagueDetails.settings && this.leagueDetails.settings['start_week'] !== undefined) {
      start = this.leagueDetails.settings['start_week'];
    } else {
      start = 1;
    }

    if (this.leagueDetails.settings && this.leagueDetails.settings['playoff_week_start'] !== undefined) {
      end = this.leagueDetails.settings['playoff_week_start'];
    } else {
      end = 15;
    }

    for (var i = start; i < end; i++) {
      this.leagueDetails.weeks.push(i);
      var matchups = await this.sleeperfixService.getLeagueMatchups('917516471591366656', i);

      for (const matchup of matchups) {
        // Get the corrected data record
        let correctedDataRecord = this.correctedData.find(x => x.roster_id === matchup.roster_id);
        if (!correctedDataRecord) {
          correctedDataRecord = {
            roster_id: matchup.roster_id,
            newoptimalLineup: {},
            originaloptimalLineup: {},
            originaltotalmaxpoints: 0,
            newtotalmaxpoints: 0,
            owner_id: '',
            teamname: '',
          };
          this.correctedData.push(correctedDataRecord);
        }

        const optimalLineup: OptimalLineup[] = [];
        const previousoptimalLineup: OptimalLineup[] = [];
        for (const [playerKey, value] of Object.entries(matchup.players_points)) {
          optimalLineup.push({
            player_id: playerKey,
            player_name: this.players[playerKey].full_name,
            positions: this.players[playerKey].fantasy_positions || [],
            points: value,
            isInOptimalLineup: false,
            isDifferent: false,
            used_position: '',
            optimal_position: ''
          });
          previousoptimalLineup.push({
            player_id: playerKey,
            player_name: this.players[playerKey].full_name,
            positions: this.players[playerKey].fantasy_positions || [],
            points: value,
            isInOptimalLineup: false,
            isDifferent: false,
            used_position: '',
            optimal_position: ''
          });
        }

        // Check for any players that have multiple positions
        if (i === 10 && matchup.roster_id === 12) {
          console.log("Found problem week");
        }

        // Iterate over each player in the optimalLineup
        for (const player of optimalLineup) {
          if (player.positions.length > 1) {
            console.log(`Player ${player.player_name} has multiple positions:`);
            let pointdifference = Number.MIN_VALUE;
            for (const position of player.positions) {
              // Check to see which position to use
              const maxpositionpoints = Math.max(...optimalLineup
                .filter(optimal => optimal.player_id !== player.player_id && optimal.positions.includes(position))
                .map(o => o.points));
              if (player.points - maxpositionpoints > pointdifference) {
                player.optimal_position = position;
                pointdifference = player.points - maxpositionpoints;
              }
            }
          } else {
            player.optimal_position = player.positions[0];
          }
        }

        for (const slot of this.leagueDetails.roster_positions) {
          switch (slot) {
            case "QB":
            case "RB":
            case "WR":
            case "TE":
            case "DEF": {
              const optimalPosition = slot === "DEF" ? "DEF" : slot;
              const positionCheck = slot === "DEF" ? ["DEF"] : [slot];

              const optimalPlayer = optimalLineup
                .filter(optimal => optimal.optimal_position === optimalPosition && !optimal.isInOptimalLineup)
                .sort((a, b) => b.points - a.points)[0];
              if (optimalPlayer) {
                optimalPlayer.isInOptimalLineup = true;
                optimalPlayer.used_position = slot;

                const prevOptimalPlayer = previousoptimalLineup
                  .filter(prevOptimal => prevOptimal.positions.some(pos => positionCheck.includes(pos)) && !prevOptimal.isInOptimalLineup)
                  .sort((a, b) => b.points - a.points)[0];
                if (prevOptimalPlayer) {
                  prevOptimalPlayer.isInOptimalLineup = true;
                  prevOptimalPlayer.used_position = slot;
                }
              }
              break;
            }
            case "FLEX":
            case "SUPER_FLEX": {
              const positionCheck = slot === "FLEX" ? this.flexpositions : this.superflexpositions;
              const optimalPlayer = optimalLineup
                .filter(optimal => positionCheck.includes(optimal.optimal_position) && !optimal.isInOptimalLineup)
                .sort((a, b) => b.points - a.points)[0];
              if (optimalPlayer) {
                optimalPlayer.isInOptimalLineup = true;
                optimalPlayer.used_position = slot;

                const prevOptimalPlayer = previousoptimalLineup
                  .filter(prevOptimal => prevOptimal.positions.some(pos => positionCheck.includes(pos)) && !prevOptimal.isInOptimalLineup)
                  .sort((a, b) => b.points - a.points)[0];
                if (prevOptimalPlayer) {
                  prevOptimalPlayer.isInOptimalLineup = true;
                  prevOptimalPlayer.used_position = slot;
                }
              }
              break;
            }
          }
        }

        // Create an instance of CorrectedMaxPotentialPoints
        const correctedMaxPotentialPoints: CorrectedMaxPotentialPoints = {
          roster_id: matchup.roster_id,
          week: i,
          oldmaxpoints: 0,
          maxpoints: 0
        };

        // Extract lists of player IDs for players in the optimal lineup
        const correctedplayers = optimalLineup.filter(o => o.isInOptimalLineup).map(o => o.player_id);
        const previousoptimalplayers = previousoptimalLineup.filter(o => o.isInOptimalLineup).map(o => o.player_id);

        // Check if there are different players in the optimal lineup compared to the previous one
        const checkDifferent = !correctedplayers.every(x => previousoptimalplayers.includes(x));

        // Iterate through optimalLineup
        for (const player of optimalLineup) {
          if (player.isInOptimalLineup) {
            correctedMaxPotentialPoints.maxpoints += player.points;
            // Check if the player is in the previous optimal lineup
            // If not, set isDifferent to true
            if (checkDifferent && !previousoptimalLineup.some(prev => prev.player_id === player.player_id && prev.isInOptimalLineup && prev.used_position === player.used_position)) {
              player.isDifferent = true;
            }
            if (player.positions.length > 0 && player.positions[0] === "DEF") {
              player.player_name = player.player_id;
            }
          }
        }

        // Iterate through previousoptimalLineup
        for (const player of previousoptimalLineup) {
          if (player.isInOptimalLineup) {
            correctedMaxPotentialPoints.oldmaxpoints += player.points;
            // Check if the player is in the optimal lineup
            // If not, set isDifferent to true
            if (!optimalLineup.some(optimal => optimal.player_id === player.player_id && optimal.isInOptimalLineup && optimal.used_position === player.used_position)) {
              player.isDifferent = true;
            }
            if (player.positions.length > 0 && player.positions[0] === "DEF") {
              player.player_name = player.player_id;
            }
          }
        }

        // Add the correctedMaxPotentialPoints to correctedmaxpointslist
        correctedmaxpointslist.push(correctedMaxPotentialPoints);

        // Update correctedDataRecord with newoptimalLineup and originaloptimalLineup
        correctedDataRecord.newoptimalLineup[i] = optimalLineup;
        correctedDataRecord.originaloptimalLineup[i] = previousoptimalLineup;

        // If teamname exists for the matchup's roster_id, assign it to correctedDataRecord
        if (this.leagueDetails.teamnames.hasOwnProperty(matchup.roster_id)) {
          correctedDataRecord.teamname = this.leagueDetails.teamnames[matchup.roster_id];
        }

      }

      // Create a new array to hold overallMaxPoints
      const overallMaxPoints: CorrectedMaxPotentialPoints[] = [];

      // Iterate through correctedmaxpointslist
      for (const correctedmaxpoints of correctedmaxpointslist) {
        // Add the current correctedmaxpoints to overallMaxPoints
        overallMaxPoints.push(correctedmaxpoints);

        // Find the sleeperCorrectedData record based on roster_id
        const sleeperCorrectedDataRecord = this.correctedData.find(x => x.roster_id === correctedmaxpoints.roster_id);
        if (sleeperCorrectedDataRecord) {
          // Update newtotalmaxpoints and originaltotalmaxpoints
          sleeperCorrectedDataRecord.newtotalmaxpoints += correctedmaxpoints.maxpoints;
          sleeperCorrectedDataRecord.originaltotalmaxpoints += correctedmaxpoints.oldmaxpoints;
        }
      }

      // Assign correctedData to sleeperLeague.correctedData
      this.leagueDetails.correctedData = this.correctedData;
    }
  }

}
