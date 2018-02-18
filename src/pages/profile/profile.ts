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

  constructor(public navCtrl: NavController, public apollo: Apollo) {

  }

  ionViewDidLoad() {
    this.checkUserInfo().then(({data}) => {
      if (data) {
        console.log(data);
        this.userInfo = data;
        console.log(this.userInfo);
        this.userInfo = this.userInfo.user;
        console.log(this.userInfo);
      } else {
        console.log('Error checking User Info');
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
         }
        }
    `
  }).toPromise();
}

}
