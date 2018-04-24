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
        players {
          profilePic
        }
      }
      courtName
      latitude
      longitude
      challenges {
        id
        notification {
          id
        }
        date
        gameTime
        status
        winner {
          id
        }
        votes {
          voteFor {
            id
          }
          voteFrom {
            id
          }
        }
        teams {
          teamName
          teamImage
          captain {
            id
          }
          id
          players {
            coins
            id
          }
        }
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
          captain {
            id
          }
          teamName
          teamImage
          id
        }
      }
    }
  }
`;

const ADD_PENDING_CHALLENGE = gql`
  mutation createChallenges (
    $gameTime: String!
    $date: DateTime!,
    $courtId: ID!,
    $teamId: ID!,
  ){
  createChallenges(
    status: Pending,
    gameTime: $gameTime,
    date: $date,
    courtId: $courtId,
    teamsIds: [$teamId],
    ){
      id
    }
  }
`;

const PENDING_TO_SCHEDULED = gql`
  mutation updateChallenges($challengeId: ID!, $team1Id: ID!, $team2Id: ID!) {
    updateChallenges(
      id: $challengeId,
      status: Scheduled,
      teamsIds: [$team1Id, $team2Id]
      notification: [{
        type: Schedule
        teamId: $team1Id
      },
      {
        type: Schedule
        teamId: $team2Id
      }]
    ) {
      id
    }
  }
`;

const QUIT_CHALLENGE = gql`
  mutation updateChallenges($challengeId: ID!, $opponentId: ID!, $nId1: ID!, $nId2: ID!) {
    a: updateChallenges(
      id: $challengeId,
      status: Pending,
      teamsIds: [$opponentId],
    ) {
      id
    }
    b: deleteNotification(id: $nId1) {
      id
    }
    c: deleteNotification(id: $nId2) {
      id
    }
  }
`;

const DELETE_CHALLENGE = gql`
  mutation deleteChallenges($challengeId: ID!) {
    deleteChallenges(id: $challengeId) {
      id
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

  addPendingChallenge(
    courtId: string,
    teamId: string,
    gameTime: string,
    date: string): Observable<string> {
    return this.apollo
      .mutate({
        mutation: ADD_PENDING_CHALLENGE,
        variables: {
          courtId,
          teamId,
          gameTime,
          date,
        }
      })
      .map(({ data }: any) => data.createChallenges.id);
  }

  quitChallenge(challengeId: string, opponentId: string, nId1: string, nId2: string) {
    return this.apollo.mutate({
      mutation: QUIT_CHALLENGE,
      variables: { challengeId, opponentId, nId1, nId2 },
    });
  }

  deleteChallenge(challengeId: string) {
    return this.apollo.mutate({
      mutation: DELETE_CHALLENGE,
      variables: { challengeId },
    });
  }

  pendingToScheduled(challengeId: string, team1Id: string, team2Id: string) {
    return this.apollo.mutate({
      mutation: PENDING_TO_SCHEDULED,
      variables: {
        challengeId,
        team1Id,
        team2Id,
      }
    });
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
