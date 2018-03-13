import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import map from 'rxjs/add/operator/map';
import filter from 'rxjs/add/operator/filter';
import { Team, TeamDetail } from '../../types';

const QUERY_TEAM_DETAIL_BY_ID = gql`
  query teamDetail($teamId: ID!) {
    Team(id: $teamId) {
      id
      teamName
      homeTown
      courtsRuled {
        id
        courtName
      }
      wins
      players {
        id
        coins
        streetName
        profilePic
      }
      challenges {
        court {
          courtName
        }
        gameTime
        teams {
          teamName
        }
      }
      challengesWon {
        court {
          courtName
        }
        gameTime
        teams {
          teamName
        }
      }
    }
  }
`;

const QUERY_ALL_TEAMS = gql`
  query{
    allTeams{
      id
      teamName
    }
  }
`;

@Injectable()
export default class TeamProvider {
  private _allTeams: BehaviorSubject<Array<Team>> = new BehaviorSubject([]);
  private readonly allTeams: Observable<Array<Team>> = this._allTeams.asObservable();
  private fetching = true;

  constructor(public http: HttpClient, public apollo: Apollo) {
    this.fetchAllTeams().subscribe(() => this.fetching = false);
  }

  fetchAllTeams(): Observable<Array<Team>> {
    const obs =  this.apollo
      .query({ query: QUERY_ALL_TEAMS })
      .map(({ data }: any) => data.allTeams);

    obs.subscribe(this._allTeams);
    return obs;
  }

  getAllTeams(): Observable<Array<Team>> {
    return this.allTeams;
  }

  getTeamById(id: string): Observable<TeamDetail> {
    return this.apollo
      .query({ query: QUERY_TEAM_DETAIL_BY_ID, variables: { teamId: id } })
      .map(({ data }: any) => data.Team);
  }

  search(term: BehaviorSubject<string>, debounce = 400): Observable<Array<Team>> {
    return term
      .debounceTime(debounce)
      .distinctUntilChanged()
      .map((keyword: string) => {
        if (!keyword) {
          return [];
        }
        return this._allTeams.getValue().filter((team: Team) => {
          if (team.teamName && keyword) {
            if (team.teamName.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
              return true;
            }
            return false;
          }
        });
      });
  }

}
