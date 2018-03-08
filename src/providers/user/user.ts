import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { User } from '../../types';

@Injectable()
export default class UserProvider {
  allUsers: Array<User>;
  currentUser: User;

  constructor(public http: HttpClient, public apollo: Apollo) {
    console.log('Hello UserProvider Provider');
  }

  fetchCurrentUser(): Promise<User> {
    return this.apollo.query({
      query: gql`
        query{
          user{
            id
            email
            name
            streetName
            coins
            winTotal
            lossTotal
            courtsRuled
            teams{
              id
              teamName
            }
          }
        }
      `
    })
    .toPromise()
    .then(({ data }: any) => {
      this.currentUser = data.user;
      return Promise.resolve(this.currentUser);
    });
  }

  getCurrentUser(): Promise<User> {
    if (this.currentUser) {
      return Promise.resolve(this.currentUser);
    }
    return this.fetchCurrentUser();
  }

  fetchAllUsers(): Promise<Array<User>> {
    return this.apollo.query({
      query: gql`
        query{
          allUsers{
            id
            email
            name
            streetName
            coins
            winTotal
            lossTotal
            courtsRuled
            teams{
              id
            }
          }
        }
      `
    })
    .toPromise()
    .then(({ data }: any) => {
      this.allUsers = data.allUsers;
      return Promise.resolve(this.allUsers);
    });
  }

  getAllUsers(): Promise<Array<User>> {
    if (this.allUsers) {
      return Promise.resolve(this.allUsers);
    }
    return this.fetchAllUsers();
  }

}
