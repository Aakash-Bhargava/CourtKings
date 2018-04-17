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
  winTotal: any;
  lossTotal: any;
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
            winTotal
            lossTotal
            courtsRuled
            profilePic
            teams{
              id
              teamName
              teamImage
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



}
