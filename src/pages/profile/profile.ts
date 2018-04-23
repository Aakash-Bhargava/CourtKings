import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
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
  user = <any>{};
  name: any;
  streetName: any;
  coins: any;
  courtsRuled: any;
  teams: any;
  profilePic: any;


  constructor(public navCtrl: NavController, public apollo: Apollo, public _DomSanitizer: DomSanitizer) {

  }

  ionViewDidEnter() {
      this.checkUserInfo().then(({data}) => {
        if (data) {
          this.user = data;
          this.user = this.user.user;
          console.log(this.user);
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
              players{
                id
                name
                profilePic
              }
              challenges{
                id
                date
                gameTime
                status
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
              }
              courtsRuled{
                id
              }
            }
           }
          }
      `
    }).toPromise();

  }

  goToCreatePage() {
    this.navCtrl.push('CreateTeamPage', {
      user: this.user
    });
  }

  goToTodaysChallenges(){
    this.navCtrl.push('TodaysChallengesPage', {
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



}
