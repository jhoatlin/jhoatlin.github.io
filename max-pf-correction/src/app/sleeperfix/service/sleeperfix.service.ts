import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SleeperCorrectedData, SleeperLeague, SleeperMatchup, SleeperTeam, SleeperUsers } from '../models/sleeperfix.model';

@Injectable({
  providedIn: 'root'
})
export class SleeperfixService {

  constructor(private http: HttpClient) { }

  getCorrectedData(leagueid: string){
    var leagueDetails = this.http.get<any>(`${environment.api_base_url}/SleeperInterface/GetCorrectedMaxPoints/${leagueid}`)
    .toPromise()
    .then(res => res as SleeperLeague)
    .then(data => data);

    return leagueDetails;
  }

  getLeagueInfo(leagueid: string){
    var leagueDetails = this.http.get<any>(`https://api.sleeper.app/v1/league/${leagueid}`)
    .toPromise()
    .then(res => res as SleeperLeague)
    .then(data => data);

    return leagueDetails;
  }

  getLeagueRosters(leagueid: string){
    var leagueRosters = this.http.get<any>(`https://api.sleeper.app/v1/league/${leagueid}/rosters`)
    .toPromise()
    .then(res => res as SleeperTeam[])
    .then(data => data);

    return leagueRosters;
  }

  getLeagueUsers(leagueid: string){
    var leagueUsers = this.http.get<any>(`https://api.sleeper.app/v1/league/${leagueid}/users`)
    .toPromise()
    .then(res => res as SleeperUsers[])
    .then(data => data);

    return leagueUsers;
  }

  getLeagueMatchups(leagueid: string, week: number){
    var leagueMatchups = this.http.get<any>(`https://api.sleeper.app/v1/league/${leagueid}/matchups/${week}`)
    .toPromise()
    .then(res => res as SleeperMatchup[])
    .then(data => data);

    return leagueMatchups;
  }
}
