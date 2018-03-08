import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  user: User;
  court: Court;
  hour: string;
  opponent: Team;
  queryList: Array<Team> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public teamProvider: TeamProvider,
  ) {
    this.court = this.navParams.get('court');
    this.hour = this.navParams.get('hour');
  }

  ionViewDidLoad() {
    this.userProvider.getCurrentUser().then((user: User) => this.user = user);
  }

  getItems(searchbar) {
    const key = searchbar.srcElement.value;
    if (!key) {
      this.queryList = [];
      return;
    }

    this.teamProvider.getAllTeams().then((teams: Array<Team>) => {
      this.queryList = teams.filter((team: Team) => {
        if (team.teamName && key) {
          if (team.teamName.toLowerCase().indexOf(key.toLowerCase()) > -1) {
            return true;
          }
          return false;
        }
      });
    });
  }

  setOpponent(team: Team) {
    this.opponent = team;
  }

}
