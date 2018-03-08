import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
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
        wins
        teamName
      }
      challenges {
        gameTime
        teams {
          teamName
        }
      }
    }
  }
`;

const QUERY_ALL_COURTS = gql`
  query{
    allCourts{
      id
      courtName
      latitude
      longitude
    }
  }
`;

@Injectable()
export default class CourtProvider {
  allCourts: Array<Court> = [];

  constructor(public http: HttpClient, public apollo: Apollo) {
    console.log('Hello CourtProvider Provider');
  }

  fetchCourts(): Promise<Array<Court>> {
    return this.apollo.query({ query: QUERY_ALL_COURTS })
    .toPromise()
    .then(({ data }: any) => {
      this.allCourts = data.allCourts;
      return Promise.resolve(this.allCourts);
    });
  }

  getAllCourts(): Promise<Array<Court>> {
    if (this.allCourts) {
      return Promise.resolve(this.allCourts);
    }
    return this.fetchCourts();
  }

  getCourtById(id: string): Promise<CourtDetail> {
    return this.apollo.query({ query: QUERY_COURT_DETAIL_BY_ID, variables: { courtId: id } })
    .toPromise()
    .then(({ data }: any) => {
      const result = data.Court;
      return Promise.resolve(result);
    });
  }

}
