import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import moment from 'moment';
import UserProvider from '../../providers/user/user';
import CourtProvider from '../../providers/court/court';

import { Challenge, CourtDetail, Schedule } from '../../types';

import {Apollo} from 'apollo-angular';
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/operator/toPromise';
import gql from 'graphql-tag';
import { DomSanitizer } from '@angular/platform-browser';

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
  oldTag : any;
  newTag : any;
  timeArray = ["11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm"];
  time = "11am";
  today = new Date();
  challenges: any;
  todaysChallenges = <any>[];
  selectedTimePending = <any>[];
  selectedTimeSchedulued = <any>[];
  date: String = new Date().toISOString();

  constructor(
    public apollo: Apollo,
    public alertCtrl: AlertController,
    public _DomSanitizer: DomSanitizer,
    public navCtrl: NavController,
    public navParams: NavParams,
    public courtProvider: CourtProvider,
    public toastCtrl: ToastController) {
      this.court = this.navParams.get('court');
      this.userData = this.checkUserInfo();
      this.userData.refetch().then(({data}) => {
        if (data) {
          this.user = data;
          this.user = this.user.user;
        }
     });
  }

  ionViewDidLoad(){
    this.getTodaysChallenges();
  }
  getTodaysChallenges() {

    this.todaysChallenges = [];
    this.selectedTimePending = [];
    this.selectedTimeSchedulued = [];
    //if challenge is today push to todaysChallenges
    this.courtProvider.getTodaysChallenges(this.court.id).then(({data}) =>{
      console.log("getAllChallenges");
      console.log(data);
      this.todaysChallenges = data;
      this.todaysChallenges = this.todaysChallenges.allChallengeses;
      console.log(this.todaysChallenges);
      for (let challenge of this.todaysChallenges){
        console.log(challenge);
        if(challenge.gameTime == this.time && challenge.status == "Pending"){
          this.selectedTimePending.push(challenge);
        }
        if(challenge.gameTime == this.time && challenge.status == "Scheduled"){
          if(this.selectedTimeSchedulued.size >= 3){
            continue;
          }
          this.selectedTimeSchedulued.push(challenge);
        }
      }
    });
  }

  changeTime(time){
    this.selectedTimePending = [];
    this.selectedTimeSchedulued = [];
    this.time = time;

    if (this.oldTag) {
      console.log("Something Clicked" +  time);
      var newT = document.getElementById(time);
      newT.style.backgroundColor = "#2c2c2c";
      newT.style.color="white";
      this.oldTag.style.backgroundColor = "white";
      this.oldTag.style.color = "gray";
      this.oldTag = newT;
    } else {
      console.log("New Time Clicked" +  newT);
      var newT = document.getElementById(time);
      newT.style.backgroundColor = "#2c2c2c";
      newT.style.color="white";
      this.oldTag = newT;
    }


    for (const challenge of this.todaysChallenges) {
      if (challenge.gameTime === this.time) {
        if (challenge.status === 'Pending') {
          this.selectedTimePending.push(challenge);
        } else {
          this.selectedTimeSchedulued.push(challenge);
        }
      }
    }
    console.log('At' + this.time + 'there are these challenges');
    console.log(this.selectedTimePending);
    console.log(this.selectedTimeSchedulued);
  }


  play(challenge) {
    const alert = this.alertCtrl.create();
    alert.setTitle('Select your team.');
    // load your teams
    for (const team of this.user.teams) {
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
        this.selectedTeam =  data;
        if (this.selectedTeam.id === challenge.teams[0].id) {
          const toast = this.toastCtrl.create({
            message: 'Dont ever play yourself!',
            position: 'top',
            duration: 3000
          });
          toast.present();
          return;
        }
        this.acceptChallenge(challenge).then(({data}) => {
          this.pendingToScheduled(challenge).then(({data}) => {
            this.getTodaysChallenges();
            let toast = this.toastCtrl.create({
              message: 'Game Scheduled!',
              position: 'top',
              duration: 3000
            });
            toast.present();
          });

        });

      }
    });
    alert.present();
    console.log(challenge);
  }

  acceptChallenge(challenge) {
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
        challengesChallengesId: challenge.id,
        teamsTeamId: this.selectedTeam.id
      }

    }).toPromise();
  }

  //someone accepts a queued team and pending becomes scheduled.
  pendingToScheduled(challenge){
    return this.apollo.mutate({
      mutation: gql`
      mutation updateChallenges($id: ID!, $status: String) {
        updateChallenges(
          id:$id,
          status:$status,
          notification: {
            type: Schedule
          }
        ) {
          id
        }
      }
      `, variables: {
        id: challenge.id,
        status: 'Scheduled',
      }
    }).toPromise();
  }


  // alert that shows user's teams and will create an pending challenge.
  addToQueue() {
    const alert = this.alertCtrl.create();
    alert.setTitle('Select your team.');
    // load your teams
    for (const team of this.user.teams) {
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

        this.selectedTeam =  data;

        //if already in queue alert
        if(this.selectedTimePending){
          for(let challenge of this.selectedTimePending){
            console.log(challenge.teams[0].id);
            console.log(this.selectedTeam.id);
            if( challenge.teams[0].id == this.selectedTeam.id){
              let alert = this.alertCtrl.create({
                title: 'Team already in the queue',
                buttons: ['OK']
              });
              alert.present();
              return;
            }
          }
        }

        //mutation to create a challenge, status: "pending",
        //Team: {{data}} -- this is selected team's id gameTime: this.time, court: this.court.id
        this.addPendingChallenge().then(({data}) => {
          //get the challenge Id once its created
          this.createdChallengeId = data.createChallenges.id;
          //add challenge to court
          this.addToChallengesOnCourt().then(({data}) =>{
            //add link between single user team and created pending challenge
            this.addChallengeToTeam().then(({data}) =>{
              // this.refresh();
              this.getTodaysChallenges();
              let toast = this.toastCtrl.create({
                message: 'Added to the Queue!',
                position: 'top',
                duration: 3000
              });
              toast.present();
            });

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

  addPendingChallenge() {
    return this.apollo.mutate({
      mutation: gql`
      mutation createChallenges($status: String!,
                          $gameTime: String!
                          $date: DateTime!,
                          ){

        createChallenges(status: $status,
                    gameTime: $gameTime,
                    date: $date,
                    ){
                      id
                    }
                  }
      `,
      variables: {
        status: 'Pending',
        gameTime: this.time,
        date: this.date,
      }
    }).toPromise();

  }

  addChallengeToTeam() {
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
    // this.refreshPage();
  }

  addToChallengesOnCourt() {
    return this.apollo.mutate({
      mutation: gql`
      mutation addToChallengesOnCourt($challengesChallengesId: ID!, $courtCourtId: ID!) {
        addToChallengesOnCourt(challengesChallengesId: $challengesChallengesId, courtCourtId: $courtCourtId){
          courtCourt{
            id
          }
        }
      }
      `,
      variables: {
        challengesChallengesId: this.createdChallengeId,
        courtCourtId: this.court.id
      }
    }).toPromise();
    // this.refreshPage();
  }

  // refresh() {
  //   console.log('Refresh');
  //   this.watch().subscribe(({ data }) => {
  //     console.log(data);
  //     this.todaysChallenges = [];
  //     this.todaysChallenges = data;
  //   });
  // }

  // watch() {
  //   return this.apollo.watchQuery({
  //     query: gql`
  //     query allChallenges{
  //       allChallenges{
  //         id
  //         date
  //         status
  //         gameTime
  //         teams {
  //           teamName
  //           teamImage
  //           id
  //         }
  //       }
  //     }
  //     `,
  //     pollInterval: 10000
  //   });
  // }


  goback() {
    this.navCtrl.pop();
  }
}
