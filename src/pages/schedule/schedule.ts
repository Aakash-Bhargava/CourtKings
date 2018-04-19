import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import moment from 'moment';
import UserProvider from '../../providers/user/user';
import CourtProvider from '../../providers/court/court';

import { Challenge, CourtDetail, Schedule, UserDetail } from '../../types';

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
  court: CourtDetail = null;
  schedules: Array<Schedule> = [];
  oldTag: any;
  newTag: any;
  timeArray = ['11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm'];
  time = '11am';
  today = new Date();
  challenges: any;
  todaysChallenges = <any>[];
  selectedTimePending = <any>[];
  selectedTimeSchedulued = <any>[];
  emptySlots: Array<any> = Array(3);
  date: String = new Date().toISOString();

  constructor(
    public apollo: Apollo,
    public alertCtrl: AlertController,
    public _DomSanitizer: DomSanitizer,
    public navCtrl: NavController,
    public navParams: NavParams,
    public courtProvider: CourtProvider,
    public toastCtrl: ToastController,
    private userProvider: UserProvider) {
  }

  ionViewDidLoad() {
    this.userProvider.fetchCurrentUser().subscribe((user: UserDetail) => {
      this.user = user;
    });
    this.getTodaysChallenges();
  }

  getTodaysChallenges() {
    const id = this.navParams.get('id');
    this.courtProvider
      .getCourtById(id)
      .subscribe((court: CourtDetail) => {
        this.court = court;

        console.log(court.challenges);
        this.todaysChallenges = court.challenges.filter(t => moment(t.date) >= moment().subtract(1, 'days'));
        console.log(this.todaysChallenges);
        this.selectedTimePending = this.todaysChallenges
          .filter(c => c.gameTime === this.time && c.status === 'Pending');
        this.selectedTimeSchedulued = this.todaysChallenges
          .filter(c => c.gameTime === this.time && c.status === 'Scheduled');
        this.emptySlots = Array(3 - this.selectedTimeSchedulued.length);
      });
  }

  changeTime(time) {
    if (this.time !== time) {
      this.time = time;

      this.selectedTimePending = this.todaysChallenges
        .filter(c => c.gameTime === this.time && c.status === 'Pending');
      this.selectedTimeSchedulued = this.todaysChallenges
        .filter(c => c.gameTime === this.time && c.status === 'Scheduled');
      this.emptySlots = Array(3 - this.selectedTimeSchedulued.length);
    }
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
            const toast = this.toastCtrl.create({
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

  // someone accepts a queued team and pending becomes scheduled.
  pendingToScheduled(challenge) {
    return this.apollo.mutate({
      mutation: gql`
      mutation updateChallenges($id: ID!, $status: String, $team1Id: ID!, $team2Id: ID!) {
        updateChallenges(
          id:$id,
          status:$status,
          notification: [{
            type: Schedule
            teamId: $team1Id
          },
          {
            type: Schedule
            teamId: $team2Id
          }]
        ) {
          id
        }
      }
      `, variables: {
        id: challenge.id,
        status: 'Scheduled',
        team1Id: this.selectedTeam.id,
        team2Id: challenge.teams[0].id,
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

        // if already in queue alert
        if (this.selectedTimePending) {
          for (const challenge of this.selectedTimePending) {
            console.log(challenge.teams[0].id);
            console.log(this.selectedTeam.id);
            if ( challenge.teams[0].id === this.selectedTeam.id) {
              const alert = this.alertCtrl.create({
                title: 'Team already in the queue',
                buttons: ['OK']
              });
              alert.present();
              return;
            }
          }
        }

        // mutation to create a challenge, status: 'pending',
        // Team: {{data}} -- this is selected team's id gameTime: this.time, court: this.court.id
        this.addPendingChallenge().then(({data}) => {
          // get the challenge Id once its created
          this.createdChallengeId = data.createChallenges.id;
          // add challenge to court
          this.addToChallengesOnCourt().then(({data}) => {
            // add link between single user team and created pending challenge
            this.addChallengeToTeam().then(({data}) => {
              // this.refresh();
              this.getTodaysChallenges();
              const toast = this.toastCtrl.create({
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
  }

  goback() {
    this.navCtrl.pop();
  }
}
