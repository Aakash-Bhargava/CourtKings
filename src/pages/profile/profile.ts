import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@IonicPage()


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  data: any;
  wins: any;
  losses: any;
  courtsRuled: any;
  user = <any>{};
  name: any;
  streetName: any;
  coins: any;
  teams: any;
  profilePic: any;


  constructor(public navCtrl: NavController, public apollo: Apollo, public _DomSanitizer: DomSanitizer, public alertCtrl: AlertController) {

  }

  ionViewDidEnter() {
      this.checkUserInfo().then(({data}) => {
        if (data) {
          this.user = data;
          this.user = this.user.user;
          console.log(this.user);
          this.getRecord();
          this.getCourtsRuled();
        }
     });

  }

  checkUserInfo() {
    return this.apollo.query({
      query: gql`
        query{
          user{
            id
            email
            name
            streetName
            coins
            profilePic
            teams{
              id
              teamName
              teamImage
              homeTown
              _challengesWonMeta {
                count
              }
              players{
                id
                name
                profilePic
                streetName
                coins
              }
              challenges{
                id
                status
<<<<<<< Updated upstream
=======
                winner{
                  id
                }
                teams{
                  id
                  teamName
                  homeTown
                }
                court{
                  id
                  courtName
                }
              }
              challengesWon{
                id
>>>>>>> Stashed changes
              }
              courtsRuled{
                id
                courtName
              }
            }
           }
          }
      `
    }).toPromise();

  }

  goToCreatePage() {
    if(this.user.teams.length == 5){
      const alert = this.alertCtrl.create({
        title: 'Warning!',
        subTitle: 'You are on 5 teams. You may not join another',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    this.navCtrl.push('CreateTeamPage', {
      user: this.user,
    });
  }

  goToTodaysChallenges(){
    this.navCtrl.push('TodaysChallengesPage', {
      user: this.user
    });
  }

  goToAllChallenges(){
    this.navCtrl.push('AllChallengesPage', {
      user: this.user
    });
  }

  goToTeamProfile(team){
    console.log("GO TO TEAM");
    console.log(team);
    this.navCtrl.push('TeamProfilePage', {
      team: team
    });
  }

  getRecord(){
    console.log(this.user.teams);
    var winCnt = 0;
    var totalGames = 0;

    for(let team of this.user.teams){
      winCnt += team._challengesWonMeta.count;
      totalGames += team.challenges.filter(challenge => challenge.status == "Completed").length;
    }

    this.wins = winCnt;
    this.losses = totalGames - winCnt;
  }

  getCourtsRuled(){
    var courtsRuled = 0;

    for(let team of this.user.teams){
      courtsRuled += team.courtsRuled.length;
    }

    this.courtsRuled = courtsRuled;
  }



}
