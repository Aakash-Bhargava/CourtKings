import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { Challenge, Team, TeamDetail, User } from '../../types';

const QUERY_TEAM_DETAIL_BY_ID = gql`
  query teamDetail($teamId: ID!) {
    Team(id: $teamId) {
      id
      teamName
      homeTown
      captain {
        id
      }
      courtsRuled {
        id
        courtName
      }
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
          captain {
            id
          }
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
      captain {
        id
      }
      challengesWon {
        id
      }
    }
  }
`;

const CREATE_VOTE = gql`
  mutation createVote (
    $challengeId: ID!
    $voteFor: ID!,
    $voteFrom: ID!,
  ){
  createVote(
    challengeId: $challengeId,
    voteForId: $voteFor,
    voteFromId: $voteFrom,
    ){
      challenge {
        id
        teams {
          id
          players {
            id
            coins
          }
        }
        votes {
          id
          voteFor {
            id
          }
          voteFrom {
            id
          }
        }
      }
    }
  }
`;

const COMPLETE_CHALLENGE_WITH_WINNER = gql`
  mutation updateChallenges (
    $challengeId: ID!,
    $winnerId: ID!,
    $winnerId1: ID!,
    $winnerId2: ID!,
    $winnerId3: ID!,
    $loserId1: ID!,
    $loserId2: ID!,
    $loserId3: ID!,
    $winnerCoins1: Int,
    $winnerCoins2: Int,
    $winnerCoins3: Int,
    $loserCoins1: Int,
    $loserCoins2: Int,
    $loserCoins3: Int,
    ) {
    updateChallenge: updateChallenges (
      id: $challengeId,
      winnerId: $winnerId,
      status: Completed
    ) {
      id
    }
    winner1: updateUser(id: $winnerId1, coins: $winnerCoins1) {
      id
    }
    winner2: updateUser(id: $winnerId2, coins: $winnerCoins2) {
      id
    }
    winner3: updateUser(id: $winnerId3, coins: $winnerCoins3) {
      id
    }
    loser1: updateUser(id: $loserId1, coins: $loserCoins1) {
      id
    }
    loser2: updateUser(id: $loserId2, coins: $loserCoins2) {
      id
    }
    loser3: updateUser(id: $loserId3, coins: $loserCoins3) {
      id
    }
  }
`;

const COMPLETE_CHALLENGE_WITHOUT_WINNER = gql`
  mutation updateChallenges (
    $challengeId: ID!,
    $playerId1: ID!,
    $playerId2: ID!,
    $playerId3: ID!,
    $playerId4: ID!,
    $playerId5: ID!,
    $playerId6: ID!,
    $playerCoins1: Int,
    $playerCoins2: Int,
    $playerCoins3: Int,
    $playerCoins4: Int,
    $playerCoins5: Int,
    $playerCoins6: Int
  ) {
    updateChallenge: updateChallenges (
      id: $challengeId,
      status: Completed
    ) {
      id
    }
    player1: updateUser(id: $playerId1, coins: $playerCoins1) {
      id
    }
    player2: updateUser(id: $playerId2, coins: $playerCoins2) {
      id
    }
    player3: updateUser(id: $playerId3, coins: $playerCoins3) {
      id
    }
    player4: updateUser(id: $playerId4, coins: $playerCoins4) {
      id
    }
    player5: updateUser(id: $playerId5, coins: $playerCoins5) {
      id
    }
    player6: updateUser(id: $playerId6, coins: $playerCoins6) {
      id
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

  createVote(challengeId: string, voteFor: string, voteFrom: string) {
    return this.apollo
      .mutate({
        mutation: CREATE_VOTE,
        variables: {
          challengeId,
          voteFor,
          voteFrom,
        }
      })
      .map(({ data }: any) => data.createVote.challenge)
      .toPromise()
      .then((challenge: Challenge) => {
        console.log(challenge.votes);
        if (challenge.votes.length === 2) {
          if (challenge.votes[0].voteFor.id === challenge.votes[1].voteFor.id) {
            const winnerId = challenge.votes[0].voteFor.id;
            let winners: Array<User> = [];
            let losers: Array<User> = [];
            if (challenge.teams[0].id === winnerId) {
              winners = challenge.teams[0].players;
              losers = challenge.teams[1].players;
            } else {
              winners = challenge.teams[1].players;
              losers = challenge.teams[0].players;
            }
            return this.apollo
              .mutate({
                mutation: COMPLETE_CHALLENGE_WITH_WINNER,
                variables: {
                  challengeId,
                  winnerId,
                  winnerId1: winners[0].id,
                  winnerId2: winners[1].id,
                  winnerId3: winners[2].id,
                  loserId1: losers[0].id,
                  loserId2: losers[1].id,
                  loserId3: losers[2].id,
                  winnerCoins1: winners[0].coins + 2,
                  winnerCoins2: winners[1].coins + 2,
                  winnerCoins3: winners[2].coins + 2,
                  loserCoins1: losers[0].coins - 2,
                  loserCoins2: losers[1].coins - 2,
                  loserCoins3: losers[2].coins - 2,
                }
              })
              .map(({ data }: any) => data.updateChallenge)
              .toPromise();
          }
          const players: Array<User> = challenge.teams[0].players.concat(challenge.teams[0].players);
          return this.apollo
            .mutate({
              mutation: COMPLETE_CHALLENGE_WITHOUT_WINNER,
              variables: {
                challengeId,
                playerId1: players[0].id,
                playerId2: players[1].id,
                playerId3: players[2].id,
                playerId4: players[3].id,
                playerId5: players[4].id,
                playerId6: players[5].id,
                playerCoins1: players[0].coins - 2,
                playerCoins2: players[1].coins - 2,
                playerCoins3: players[2].coins - 2,
                playerCoins4: players[3].coins - 2,
                playerCoins5: players[4].coins - 2,
                playerCoins6: players[5].coins - 2,
              }
            })
            .map(({ data }: any) => data.updateChallenge)
            .toPromise();
        }
        return Promise.resolve();
    });
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
