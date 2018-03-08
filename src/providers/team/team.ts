import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Team } from '../../types';

@Injectable()
export default class TeamProvider {
  allTeams: Array<Team>;
  constructor(public http: HttpClient, public apollo: Apollo) {
    console.log('Hello TeamProvider Provider');
  }

  fetchAllTeams(): Promise<Array<Team>> {
    return this.apollo.query({
      query: gql`
        query{
          allTeams{
            id
            teamName
          }
        }
      `
    })
    .toPromise()
    .then(({ data }: any) => {
      this.allTeams = data.allTeams;
      return Promise.resolve(this.allTeams);
    });
  }

  getAllTeams(): Promise<Array<Team>> {
    if (this.allTeams) {
      return Promise.resolve(this.allTeams);
    }
    return this.fetchAllTeams();
  }

}
