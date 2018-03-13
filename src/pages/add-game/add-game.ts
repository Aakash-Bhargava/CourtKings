import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/Rx';
import { Court } from '../../types';
import UserProvider from '../../providers/user/user';
import TeamProvider from '../../providers/team/team';
import { Team, User } from '../../types';

@IonicPage()
@Component({
  selector: 'page-add-game',
  templateUrl: 'add-game.html',
})
export class AddGamePage {
  private court: Court;
  private hour: string;
  private opponent: Team;
  private searching = false;
  private queryList: Array<Team> = [];
  private term$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private userProvider: UserProvider,
    private teamProvider: TeamProvider,
  ) {
    this.court = this.navParams.get('court');
    this.hour = this.navParams.get('hour');
    this.term$.subscribe((term: string) => this.searching = !!term);
    this.teamProvider.search(this.term$).subscribe((result: Array<Team>) => {
      this.queryList = result;
      this.searching = false;
    });
  }

  setOpponent(team: Team) {
    this.opponent = team;
    this.queryList = [];
    this.term$.next('');
  }

  clearOpponent() {
    this.opponent = null;
  }

}
