import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';


@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  queryListPlayers: any;
  qPLayers: any;
  allUsers =  <any>[];
  allUsersData = <any>[];

  queryListTeams: any;
  qTeams: any;
  allTeams =  <any>[];
  allTeamsData = <any>[];


  queryListCourts: any;
  qCourts: any;
  allCourts =  <any>[];
  allCourtsData = <any>[];


  constructor(public apollo: Apollo, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

    //get all user info
    this.getAllUserInfo().then(({data})=> {
        this.allUsersData = [];
        this.allUsers = data;
        this.allUsers = this.allUsers.allUsers;
        console.log(this.allUsers);
        for (let user of this.allUsers) {
          this.allUsersData.push(user);
        }
      });

      //get all teams info
      this.getAllTeamInfo().then(({data})=> {
          this.allTeamsData = [];
          this.allTeams = data;
          this.allTeams = this.allTeams.allTeams;
          for (let team of this.allTeams) {
            this.allTeamsData.push(team);
          }
        });

    //load all courts
    this.getAllCourtInfo().then(({data})=> {
        this.allCourtsData = [];
        this.allCourts = data;
        this.allCourts = this.allCourts.allCourts;
        console.log("ALL Courts");
        // console.log(this.allCourts);
        for (let court of this.allCourts) {
          this.allCourtsData.push(court);
        }
        console.log(this.allCourtsData);
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

  getAllTeamInfo() {
  return this.apollo.query({
    query: gql`
      query{
        allTeams{
          id
          teamName
          wins
         }
        }
    `
    }).toPromise();
  }

  getAllCourtInfo() {
  return this.apollo.query({
    query: gql`
      query{
        allCourts{
          id
          courtName
         }
        }
    `
    }).toPromise();
  }


  initializePlayers(): void {
    this.queryListPlayers = this.allUsersData;
    console.log(this.queryListPlayers);
  }

  initializeTeams(): void {
    this.queryListTeams = this.allTeamsData;
    console.log(this.queryListTeams);
  }

  initializeCourts(): void {
    this.queryListCourts = this.allCourtsData;
    console.log(this.queryListCourts);
  }




  searchPlayers(searchbar) {
    // Reset items back to all of the items
    this.initializePlayers();

    // set q to the value of the searchbar
    this.qPLayers = searchbar.srcElement.value;

    // if the value is an empty string don't filter the items
    if (!this.qPLayers) {
      this.queryListPlayers = [];
      return;
    }

    this.queryListPlayers = this.queryListPlayers.filter((v) => {
      if(v.name && this.qPLayers) {
        if (v.name.toLowerCase().indexOf(this.qPLayers.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
    console.log(this.qPLayers, this.queryListPlayers.length);
  }

  searchTeams(searchbar) {
    // Reset items back to all of the items
    this.initializeTeams();

    // set q to the value of the searchbar
    this.qTeams = searchbar.srcElement.value;

    // if the value is an empty string don't filter the items
    if (!this.qTeams) {
      this.queryListTeams = [];
      return;
    }

    this.queryListTeams = this.queryListTeams.filter((v) => {
      if(v.teamName && this.qTeams) {
        if (v.teamName.toLowerCase().indexOf(this.qTeams.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
    console.log(this.qTeams, this.queryListTeams.length);
  }

  searchCourts(searchbar) {
    // Reset items back to all of the items
    this.initializeCourts();

    // set q to the value of the searchbar
    this.qCourts = searchbar.srcElement.value;

    // if the value is an empty string don't filter the items
    if (!this.qCourts) {
      this.queryListCourts = [];
      return;
    }

    this.queryListCourts = this.queryListCourts.filter((v) => {
      if(v.courtName && this.qCourts) {
        if (v.courtName.toLowerCase().indexOf(this.qCourts.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
    console.log(this.qCourts, this.queryListCourts.length);
  }

}
