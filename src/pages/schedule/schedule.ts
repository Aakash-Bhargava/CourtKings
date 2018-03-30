import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import moment from 'moment';
import UserProvider from '../../providers/user/user';

import { Challenge, CourtDetail, Schedule } from '../../types';
import {Apollo} from 'apollo-angular';
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
  time = "11am";
  today = new Date();
  challenges: any;
  todaysChallenges = <any>[];
  date: String = new Date().toISOString();

  constructor(
    public apollo: Apollo,
    public alertCtrl: AlertController,
    public _DomSanitizer: DomSanitizer,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController) {
      this.court = this.navParams.get('court');
      // console.log(this.court);
      // console.log(this.court.challenges);
      // console.log("This is today");
      // console.log(this.today.getDate());
      // console.log(this.today.getMonth());
      // console.log(this.today.getFullYear());
      this.userData = this.checkUserInfo();
      this.userData.refetch().then(({data}) => {
        if(data){
          this.user = data;
          this.user = this.user.user;
        }
     });
  }

  ionViewDidLoad(){
    //if challenge is today push to todaysChallenges
    for (let challenge of this.court.challenges){
       var challengeDate = new Date(challenge.date);
       if(challengeDate.getDate() == this.today.getDate() &&
          challengeDate.getMonth() == this.today.getMonth() &&
          challengeDate.getFullYear() == this.today.getFullYear()){
            this.todaysChallenges.push(challenge);
          }
    }
    console.log(this.todaysChallenges);
  }


  timeChange(){
    console.log(this.time);
  }


  play(challenge){
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
        this.selectedTeam =  data;
        if(this.selectedTeam.id == challenge.teams[0].id){
          let toast = this.toastCtrl.create({
            message: 'Dont ever play yourself!',
            position: 'top',
            duration: 3000
          });
          toast.present();
          return;
        }
        this.acceptChallenge(challenge).then(({data}) => {
          this.pendingToScheduled(challenge).then(({data}) => {
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

  acceptChallenge(challenge){
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

  pendingToScheduled(challenge){
    return this.apollo.mutate({
      mutation: gql`
      mutation updateChallenges($id: ID!, $status: String) {
        updateChallenges(id:$id, status:$status) {
          id
        }
      }
      `, variables: {
        id: challenge.id,
        status: "Scheduled",
      }
    }).toPromise();
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

        this.selectedTeam =  data;

        //mutation to create a challenge, status: "pending", Team: {{data}} -- this is selected team's id
        //gameTime: this.time, court: this.court.id
        this.addPendingChallenge().then(({data}) => {
        //get the challenge Id once its created
          this.createdChallengeId = data.createChallenges.id;
          //add challenge to court
          this.addToChallengesOnCourt().then(({data}) =>{
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
        status: "Pending",
        gameTime: this.time,
        date: this.date,
        // teamId: this.selectedTeam.id,
        // court: this.court.id
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
    //this.refreshPage();
  }

}
