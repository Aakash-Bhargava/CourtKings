import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
@IonicPage()
@Component({
  selector: 'page-search-team',
  templateUrl: 'search-team.html',
})
export class SearchTeamPage {

  queryList: any;
  allTeams =  <any>[];
  allTeamsData = <any>[];
  q: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Apollo) {
  }

  ionViewDidLoad() {
    this.getAllTeamInfo().then(({data})=> {
        this.allTeamsData = [];
        this.allTeams = data;
        this.allTeams = this.allTeams.allTeams;
        for (let team of this.allTeams) {
          this.allTeamsData.push(team);
        }
        // console.log("All Teams Data");
        // console.log(this.allTeamsData);
      });
  }

  getAllTeamInfo() {
  return this.apollo.query({
    query: gql`
      query{
        allTeams{
          id
          teamName
         }
        }
    `
    }).toPromise();
  }

  initializeItems(): void {
    this.queryList = this.allTeamsData;
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
      if(v.teamName && this.q) {
        if (v.teamName.toLowerCase().indexOf(this.q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
    console.log(this.q, this.queryList.length);
  }

}
