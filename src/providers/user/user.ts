import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { User } from '../../types';

const QUERY_CURRENT_USER = gql`
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
`;

const QUERY_ALL_USERS = gql`
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
`;

@Injectable()
export default class UserProvider {
  private _allUsers: BehaviorSubject<Array<User>> = new BehaviorSubject<Array<User>>([]);
  private readonly allUsers: Observable<Array<User>> = this._allUsers.asObservable();
  private currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(public http: HttpClient, public apollo: Apollo) {
    this.fetchCurrentUser();
  }

  fetchCurrentUser(): Observable<User> {
    const obs =  this.apollo
      .query({ query: QUERY_CURRENT_USER })
      .map(({ data }: any) => data.user);

    obs.subscribe(this.currentUser);
    return obs;
  }

  updatePlayerId(playerId: string) {
    this.fetchCurrentUser().subscribe((user: User) => {
      console.log(user.id);
      console.log(user.email);
      this.apollo.mutate({
        mutation: gql`
          mutation updateUser($id: ID!, $playerid: String) {
            updateUser(id: $id, playerId: $playerid) {
              id
              playerId
            }
          }
        `,
        variables: {
          id: user.id,
          playerid: playerId,
        }
      }).subscribe(({ data }) => { console.log(data.updateUser.id, data.updateUser.playerId); });
    });
  }

  getCurrentUser(): Observable<User> {
    return this.currentUser;
  }

  fetchAllUsers(): Observable<Array<User>> {
    const obs = this.apollo.query({ query: QUERY_ALL_USERS })
    .map(({ data }: any) => data.allUsers);
    obs.subscribe(this._allUsers);
    return obs;
  }

  getAllUsers(): Observable<Array<User>> {
    return this.allUsers;
  }

}
