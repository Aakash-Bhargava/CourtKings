import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { Court, CourtDetail } from '../../types';


const QUERY_COURT_DETAIL_BY_ID = gql`
  query courtDetail($courtId: ID!) {
    Court(id: $courtId) {
      id
      courtKings {
        id
        teamName
        wins
        players {
          profilePic
        }
      }
      courtName
      latitude
      longitude
      standings {
        id
        wins
        teamName
      }
      challenges {
        id
        date
        gameTime
        status
        teams {
          teamName
          teamImage
          id
        }
      }
    }
  }
`;

const QUERY_TODAYS_CHALLENGE_BY_COURT_ID = gql`
  query allChallengeses($courtId: ID!, $date: DateTime) {
    allChallengeses(filter: {court:{id: $courtId}, date_gte: $date}) {
      id
      date
      gameTime
      status
      teams {
        teamName
        teamImage
        id
      }
    }
  }
`;



const QUERY_ALL_COURTS = gql`
  query{
    allCourts {
      id
      courtName
      latitude
      longitude
      challenges {
        date
        status
        gameTime
        teams {
          teamName
          teamImage
          id
        }
      }
    }
  }
`;

@Injectable()
export default class CourtProvider {
  private _allCourts: BehaviorSubject<Array<Court>> = new BehaviorSubject([]);
  private readonly allCourts: Observable<Array<Court>> = this._allCourts.asObservable();
  private fetching = true;

  constructor(private apollo: Apollo) {
    this.fetchCourts().subscribe((courts) => this.fetching = false);
  }

  fetchCourts(): Observable<Array<Court>> {
    const obs = this.apollo
      .query({ query: QUERY_ALL_COURTS })
      .map(({ data }: any) => data.allCourts);
    obs.subscribe(this._allCourts);
    return obs;
  }

  getAllCourts(): Observable<Array<Court>> {
    return this.allCourts;
  }

  getCourtById(id: string): Observable<CourtDetail> {
    return this.apollo
      .query({ query: QUERY_COURT_DETAIL_BY_ID, fetchPolicy: 'network-only', variables: { courtId: id } })
      .map(({ data }: any) => data.Court);
  }

  getTodaysChallenges(id) {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    return this.apollo.query({query: QUERY_TODAYS_CHALLENGE_BY_COURT_ID, variables: {courtId: id, date: now }}).toPromise();
  }

  search(term: BehaviorSubject<string>, debounce = 400): Observable<Array<Court>> {
    return term
      .debounceTime(debounce)
      .distinctUntilChanged()
      .map((keyword: string) => {
        if (!keyword) {
          return [];
        }
        return this._allCourts.getValue().filter((court: Court) => {
          if (court.courtName && keyword) {
            if (court.courtName.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
              return true;
            }
            return false;
          }
        });
      });
  }

}
