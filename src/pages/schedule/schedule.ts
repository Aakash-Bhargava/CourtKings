import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import moment from 'moment';
import { Challenge, CourtDetail, Schedule } from '../../types';

@IonicPage()
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {
  court: CourtDetail;
  schedules: Array<Schedule> = [];
  hours: Array<string> = ['1PM', '2PM', '3PM', '4PM', '5PM', '6PM'];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.court = this.navParams.get('court');
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

  findTeams(hour: string): Array<string> {
    return this.schedules.find((s: Schedule) => s.hour === hour).teams;
  }

  goback() {
    this.navCtrl.pop();
  }

  addGame(hour: string) {
    if (this.isHourOpen(hour)) {
      this.navCtrl.push('AddGamePage', { court: { id: this.court.id, courtName: this.court.courtName }, hour });
    }
  }
}
