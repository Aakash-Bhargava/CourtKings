import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import moment from 'moment';
import UserProvider from '../../providers/user/user';

import { Challenge, CourtDetail, Schedule } from '../../types';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@IonicPage()
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {
  userData: any;
  user: any;
  selectedTeam: any;
  createdChallengeId: any;
  court: CourtDetail;
  schedules: Array<Schedule> = [];
  time = "11am";
  today = new Date();
  challenges: any;
  date: String = new Date().toISOString();

  constructor(
    public apollo: Apollo,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController) {
    this.court = this.navParams.get('court');
    console.log(this.court);
    console.log(this.court.challenges);

    this.userData = this.checkUserInfo();
    this.userData.refetch().then(({data}) => {
      if(data){
        this.user = data;
        this.user = this.user.user;
      }
   });

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

  //alert that shows user's teams and will create an pending challenge.
  addToQueue() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Select your team.');
    //load your teams
    for (let team of this.user.teams) {
      alert.addInput({
        type: 'radio',
        label: team.teamName,
        value: team,
        checked: false
      },
    );
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Select',
      handler: data => {
        //mutation to create a challenge, status: "pending", Team: {{data}} -- this is selected team's id
        //gameTime: this.time, court: this.court.id
        this.selectedTeam =  data;
        this.addPendingChallenge().then(({data}) => {
          //get the challenge Id once its created
          this.createdChallengeId = data.createChallenges.id;
          //add link between single user team and created pending challenge
          this.addChallengeToTeam().then(({data}) =>{
            let toast = this.toastCtrl.create({
              message: 'Added to the Queue!',
              position: 'top',
              duration: 3000
            });
            toast.present();
          });
        });
      }
    });
    alert.present();
  }


  checkUserInfo() {
  return this.apollo.watchQuery({
    query: gql`
      query{
        user{
          id
          name
          streetName
          coins
          profilePic
          teams{
            id
            teamName
            teamImage
          }
         }
        }
    `
    });
  }

  addPendingChallenge(){
    return this.apollo.mutate({
      mutation: gql`
      mutation createChallenges($status: String!,
                          $courtId: ID,
                          $gameTime: String!
                          $date: DateTime!,
                          ){

        createChallenges(status: $status,
                    courtId: $courtId,
                    gameTime: $gameTime,
                    date: $date,
                    ){
                      id
                    }
                  }
      `,
      variables: {
        status: "Pending",
        gameTime: this.time,
        date: this.date,
        // teamId: this.selectedTeam.id,
        court: this.court.id
      }
    }).toPromise();

  }


  addChallengeToTeam() {
    console.log("inside addChallengeToTeam");
    console.log(this.selectedTeam.id);
    return this.apollo.mutate({
      mutation: gql`
      mutation addToChallengesOnTeam($challengesChallengesId: ID!, $teamsTeamId: ID!) {
        addToChallengesOnTeam(challengesChallengesId: $challengesChallengesId, teamsTeamId: $teamsTeamId){
          teamsTeam{
            id
          }
        }
      }
      `,
      variables: {
        challengesChallengesId: this.createdChallengeId,
        teamsTeamId: this.selectedTeam.id
      }

    }).toPromise();
    //this.refreshPage();
  }

}
