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
  userInfo = <any>{};
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
      this.data = this.checkUserInfo();
      this.data.refetch().then(({data}) => {
        if(data){
          this.userInfo = data;
          this.userInfo = this.userInfo.user;
          this.name = this.userInfo.name;
          this.streetName = this.userInfo.streetName;
          this.coins = this.userInfo.coins;
          this.winTotal = this.userInfo.winTotal;
          this.lossTotal = this.userInfo.lossTotal;
          this.courtsRuled = this.userInfo.courtsRuled;
          this.teams = this.userInfo.teams;
          this.profilePic = this.userInfo.profilePic;
          console.log(this.userInfo);
        }

     });
  }

  checkUserInfo() {
  return this.apollo.watchQuery({
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
    });
  }

  goToCreatePage(){
    this.navCtrl.push('CreateTeamPage', {
      user: this.userInfo
    });
  }



}
