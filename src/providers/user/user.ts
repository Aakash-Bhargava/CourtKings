import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { Notification, User, UserDetail } from '../../types';

const compare = (a: Notification, b: Notification) => {
  if (a.createdAt < b.createdAt)
    return -1;
  if (a.createdAt > b.createdAt)
    return 1;
  return 0;
};

const QUERY_CURRENT_USER = gql`
  query{
    user{
      id
      email
      name
      streetName
      coins
      teams{
        id
        captain {
          id
        }
        teamName
        players {
          id
          coins
        }
        challengesWon {
          id
        }
        notifications {
          type
          challenge {
            id
            notification {
              id
            }
            teams {
              id
              teamName
            }
            date
            gameTime
            court {
              id
              courtName
            }
          }
        }
      }
      notifications {
        type
        challenge {
          id
          teams {
            id
            teamName
          }
          date
          gameTime
          court {
            id
            courtName
          }
        }
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
      profilePic
      teams{
        id
        captain {
          id
        }
        challengesWon {
          id
        }
      }
    }
  }
`;

const QUERY_ALL_NOTIFICATIONS = gql`
  query {
    allNotifications {
      id
      type
      team {
        id
      }
      challenge {
        id
        teams {
          id
          teamName
        }
        date
        gameTime
        court {
          id
          courtName
        }
      }
    }
  }
`;

@Injectable()
export default class UserProvider {
  private _allUsers: BehaviorSubject<Array<User>> = new BehaviorSubject<Array<User>>([]);
  private readonly allUsers: Observable<Array<User>> = this._allUsers.asObservable();
  private currentUser: BehaviorSubject<UserDetail> = new BehaviorSubject<UserDetail>(null);
  private fetching = true;

  constructor(public http: HttpClient, public apollo: Apollo) {
    this.fetchCurrentUser();
    this.fetchAllUsers().subscribe((users) => this.fetching = false);
  }

  fetchCurrentUser(): Observable<UserDetail> {
    const obs = this.apollo
      .query({ query: QUERY_CURRENT_USER })
      .map(({ data }: any) => data.user);

    obs.subscribe(this.currentUser);
    console.log('fetchCurrentUser');
    return obs;
  }

  updatePlayerId(playerId: string) {
    this.fetchCurrentUser().subscribe((user: UserDetail) => {
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

  getCurrentUser(): Observable<UserDetail> {
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

  search(term: BehaviorSubject<string>, debounce = 400): Observable<Array<User>> {
    return term
      .debounceTime(debounce)
      .distinctUntilChanged()
      .map((keyword: string) => {
        if (!keyword) {
          return [];
        }
        return this._allUsers.getValue().filter((user: User) => {
          if (user.name && keyword) {
            if (user.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
              return true;
            }
            return false;
          }
        });
      });
  }

  getNotifications() {
    return this.apollo.query({ query: QUERY_ALL_NOTIFICATIONS, fetchPolicy: 'network-only', })
    .map(({ data }: any) => data.allNotifications)
    .map((n: Array<Notification>) => {
      let notifications: Array<Notification> = this.currentUser.getValue().notifications;
      const teamlist = this.currentUser.getValue().teams.map(t => t.id);
      notifications = n.filter(i => teamlist.includes(i.team.id));
      notifications = notifications.sort(compare);
      return notifications;
    });
  }
}
