import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import { BehaviorSubject } from 'rxjs/Rx';
import UserProvider from '../../providers/user/user';
import TeamProvider from '../../providers/team/team';
import { Challenge, Court, Schedule, Team, User  } from '../../types';
import CourtProvider from '../../providers/court/court';


@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  searchType = 'Players';

  private playerSearching = false;
  private courtSearching = false;
  private teamSearching = false;
  private playerQueryList: Array<User> = [];
  private teamQueryList: Array<Team> = [];
  private courtQueryList: Array<Court> = [];
  private playerTerm$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private teamTerm$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private courtTerm$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    public apollo: Apollo,
    public navCtrl: NavController,
    public navParams: NavParams,
    private teamProvider: TeamProvider,
    private courtProvider: CourtProvider,
    private userProvider: UserProvider,
  ) {
    this.teamTerm$.subscribe((term: string) => this.teamSearching = !!term);
    this.courtTerm$.subscribe((term: string) => this.courtSearching = !!term);
    this.playerTerm$.subscribe((term: string) => this.playerSearching = !!term);
    this.teamProvider.search(this.teamTerm$).subscribe((result: Array<Team>) => {
      this.teamQueryList = result;
      this.teamSearching = false;
    });
    this.courtProvider.search(this.courtTerm$).subscribe((result: Array<Court>) => {
      this.courtQueryList = result;
      this.courtSearching = false;
    });
    this.userProvider.search(this.playerTerm$).subscribe((result: Array<User>) => {
      this.playerQueryList = result;
      this.playerSearching = false;
    });
  }

  goToTeam(team: Team) {
    this.navCtrl.push('TeamProfilePage', { id: team.id });
  }

  goToCourt(court: Court) {
    this.navCtrl.push('SchedulePage', { court: court });
  }

  // goToUser(user: User) {
  //   this.navCtrl.push('SchedulePage', { court: court });
  // }

  getWins(user: User) {
    let challengesWon = [];
    user.teams.forEach((team: Team) => { challengesWon = challengesWon.concat(team.challengesWon); });
    return challengesWon.length;
  }

}
