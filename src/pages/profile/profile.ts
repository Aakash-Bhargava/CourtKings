import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@IonicPage()


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  userInfo = <any>{};
  name: any;
  streetName: any;
  coins: any;
  winTotal: any;
  lossTotal: any;
  courtsRuled: any;
  teams: any;


  constructor(public navCtrl: NavController, public apollo: Apollo) {

  }

  ionViewDidLoad() {
    this.checkUserInfo().then(({data}) => {
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
        console.log(this.userInfo);
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
          teams{
            id
          }
         }
        }
    `
    }).toPromise();
  }

  goToCreatePage(){
    this.navCtrl.push('CreateTeamPage', {
      user: this.userInfo
    });
  }



}
