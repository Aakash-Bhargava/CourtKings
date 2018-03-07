import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@IonicPage()
@Component({
  selector: 'page-search-court',
  templateUrl: 'search-court.html',
})
export class SearchCourtPage {

  queryList: any;
  allCourts =  <any>[];
  allCourtsData = <any>[];
  q: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Apollo) {
  }

  ionViewDidLoad() {
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

  initializeItems(): void {
    this.queryList = this.allCourtsData;
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
      if(v.courtName && this.q) {
        if (v.courtName.toLowerCase().indexOf(this.q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
    console.log(this.q, this.queryList.length);
  }


}
