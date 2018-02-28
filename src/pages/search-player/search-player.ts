import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@IonicPage()
@Component({
  selector: 'page-search-player',
  templateUrl: 'search-player.html',
})
export class SearchPlayerPage {

  queryList: any;
  allUsers =  <any>[];
  allUsersData = <any>[];
  q: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Apollo) {
  }

  ionViewDidLoad() {
    this.getAllUserInfo().then(({data})=> {
        this.allUsersData = [];
        this.allUsers = data;
        this.allUsers = this.allUsers.allUsers;
        console.log(this.allUsers);
        for (let user of this.allUsers) {
          this.allUsersData.push(user);
        }
      });
  }
  getAllUserInfo() {
  return this.apollo.query({
    query: gql`
      query{
        allUsers{
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


  initializeItems(): void {
    this.queryList = this.allUsersData;
    console.log(this.queryList);
  }



  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    this.q = searchbar.srcElement.value;

    // if the value is an empty string don't filter the items
    if (!this.q) {
      this.queryList = [];
      return;
    }

    this.queryList = this.queryList.filter((v) => {
      if(v.name && this.q) {
        if (v.name.toLowerCase().indexOf(this.q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
    console.log(this.q, this.queryList.length);
  }

}
