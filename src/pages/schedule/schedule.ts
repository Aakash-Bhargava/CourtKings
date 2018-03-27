import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import moment from 'moment';
import { Challenge, CourtDetail, Schedule } from '../../types';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@IonicPage()
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {
  court: CourtDetail;
  schedules: Array<Schedule> = [];
  time: any;
  challenges: any;
  date: String = new Date().toISOString();

  constructor(public apollo: Apollo, public navCtrl: NavController, public navParams: NavParams) {
    this.court = this.navParams.get('court');
    console.log(this.court);
    console.log(this.court.challenges);


    this.getAllChallenges().then(({data}) => {
        if(data){
          this.challenges = data;
          console.log(this.challenges);
        }
      })




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
      this.navCtrl.push('AddGamePage', { court: this.court, hour });
    }
  }

  timeChange(){
    console.log(this.time);
  }

  getAllChallenges(){
    return this.apollo.query({
      query: gql`
      query allChallenges($dueDate: DateTime, $courtId: ID) {
        allChallenges(filter: {
          court: $courtId
        }) {
          id
          gameTime
        }
      }
    `, variables: {
        courtId: this.court.id

      }
    }).toPromise();
  }








}
