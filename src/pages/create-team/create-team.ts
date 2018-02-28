import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@IonicPage()
@Component({
  selector: 'page-create-team',
  templateUrl: 'create-team.html',
})
export class CreateTeamPage {

  user: any;
  queryList: any;
  allUsers =  <any>[];
  allUsersData = <any>[];
  userId: any;
  q: any;

  teamName: any;
  teamHomeTown: any;
  teamImageUrl: any;
  team = <any>[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Apollo,
              public alertCtrl: AlertController, public toastCtrl: ToastController) {



  }




  ionViewDidLoad() {
    this.getAllUserInfo().then(({data})=> {
        this.allUsersData = [];
        this.allUsers = data;
        this.allUsers = this.allUsers.allUsers;
        console.log(this.allUsers);
        for (let user of this.allUsers) {
          if (user.id != this.userId) {
            this.allUsersData.push(user);
          }
        }
      });

      if(this.navParams.get('user')){
        this.user = this.navParams.get('user');
        this.team.push(this.user);
      }
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

  addUser(user) {
    if(user.email == this.user.email){
      let alert = this.alertCtrl.create({
        title: 'Warning!',
        subTitle: "You are already the on the roster of your own team!",
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    let confirm = this.alertCtrl.create({
      title: 'Recruit player',
      message: 'Do you want to recruit ' + user.name +  ' to this team?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes clicked');
            //the user is already on the team
            if(this.team.includes(user)){
              let alert = this.alertCtrl.create({
                title: 'Warning!',
                subTitle: "This player is already on your team's roster!",
                buttons: ['Ok']
              });
              alert.present();
            }
            //the team already has 3 players
            else if(this.team.length == 3){
              let alert = this.alertCtrl.create({
                title: 'Warning!',
                subTitle: "Your team's roster is full!",
                buttons: ['Ok']
              });
              alert.present();
            }
            else{
              this.team.push(user);
              console.log("Current team");
              console.log(this.team);
            }

          }
        }
      ]
    });
    confirm.present();
  }


  validateTeam(){

    //missing top information
    if(!this.teamName || !this.teamHomeTown){
      let alert = this.alertCtrl.create({
        title: 'Warning!',
        subTitle: "Your team is missing some information",
        buttons: ['Ok']
      });
      alert.present();
      return;
    }


    if(this.team.length == 3){

      this.createTeam().then(({data}) => {
        if (data) {
          console.log(data);
        }
      }, (errors) => {
        console.log(errors);
      });
    }
    else{
      let alert = this.alertCtrl.create({
        title: 'Warning!',
        subTitle: "Your team's roster is not full! You must have 3 players.",
        buttons: ['Ok']
      });
      alert.present();
    }

  }


  createTeam(){
    return this.apollo.mutate({
      mutation: gql`
      mutation createTeam($teamName: String!, $homeTown: String,
                          $players: [User]){
        createTeam(teamName: $teamName, homeTown: $homeTown, Players: $players){
                     id
                   }
                 }
      `,
      variables: {
        teamName: this.teamName,
        hometown: this.teamHomeTown,
        players: this.team
      }
    }).toPromise();
  }







}
