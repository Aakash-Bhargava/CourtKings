import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/Rx';
import moment from 'moment';
import UserProvider from '../../providers/user/user';
import TeamProvider from '../../providers/team/team';
import { Challenge, Court, Schedule, Team, User  } from '../../types';
import CourtProvider from '../../providers/court/court';

@IonicPage()
@Component({
  selector: 'page-add-game',
  templateUrl: 'add-game.html',
})
export class AddGamePage {
  private user: User;
  private team: Team;
  private court: Court;
  private hour: string;
  private opponent: Team;
  private courtSearching = false;
  private teamSearching = false;
  private teamQueryList: Array<Team> = [];
  private courtQueryList: Array<Court> = [];
  private teamTerm$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private courtTerm$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private schedules: Array<Schedule> = [];
  private hours: Array<string> = ['1PM', '2PM', '3PM', '4PM', '5PM', '6PM'];

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private userProvider: UserProvider,
    private teamProvider: TeamProvider,
    private courtProvider: CourtProvider,
  ) {
    this.userProvider.fetchCurrentUser().subscribe((user: User) => this.user = user);
    this.court = this.navParams.get('court');
    this.team = this.navParams.get('team');
    this.hour = this.navParams.get('hour');
    this.opponent = this.navParams.get('opponent');
    this.teamTerm$.subscribe((term: string) => this.teamSearching = !!term);
    this.courtTerm$.subscribe((term: string) => this.courtSearching = !!term);
    this.teamProvider.search(this.teamTerm$).subscribe((result: Array<Team>) => {
      this.teamQueryList = result;
      this.teamSearching = false;
    });
    this.courtProvider.search(this.courtTerm$).subscribe((result: Array<Court>) => {
      this.courtQueryList = result;
      this.courtSearching = false;
    });

    if (this.court) {
      this.updateSchedule();
    }
  }

  updateSchedule() {
    this.court.challenges.forEach((challenge: Challenge) => {
      const hour = moment(challenge.gameTime).hour();
      const schedule: Schedule = {
        hour: hour >= 12 ? (hour - 12) + 'PM' : hour + 'AM',
        teams: challenge.teams.map(t => t.teamName),
      };
      this.schedules.push(schedule);
    });
  }

  isHourOpen(hour: string): boolean {
    const find = this.schedules.find((s: Schedule) => s.hour === hour);
    return !find;
  }

  openHours() {
    return this.hours.filter((hour) => this.isHourOpen(hour));
  }

  setOpponent(team: Team) {
    this.opponent = team;
    this.teamQueryList = [];
    this.teamTerm$.next('');
  }

  setCourt(court: Court) {
    this.court = court;
    this.courtQueryList = [];
    this.courtTerm$.next('');
    this.updateSchedule();
    this.hour = '';
  }

  setTeam(team: Team) {
    this.team = team;
  }

  clearTeam() {
    this.team = null;
  }

  clearCourt() {
    this.court = null;
    this.hour = '';
  }

  clearOpponent() {
    this.opponent = null;
  }

  setHour(hour: string) {
    this.hour = hour;
  }

  clearHour() {
    this.hour = '';
  }

  goback() {
    this.navCtrl.pop();
  }

}
