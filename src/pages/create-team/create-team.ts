import { Component } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';

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

  teammates = <any>[];

  userId: any;
  q: any;

  teamName: any;
  homeTown: any;
  teamImage: any;
  team = <any>[];
  teamIds = <any>[];

  constructor(public _DomSanitizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams, public apollo: Apollo,
              public alertCtrl: AlertController, public toastCtrl: ToastController,
              public platform: Platform, private Camera: Camera, public actionSheetCtrl: ActionSheetController) {
  }
  ionViewDidLoad() {

    this.getUserInfo().then(({data}) => {
      this.user = data;
      this.user = this.user.user;
      console.log(this.user);
      this.team.push(this.user);

      for (let team of this.user.teams){
        console.log(team);
        for( let player of team.players){
          this.teammates.push(player);
        }
      }
    });

    this.getAllUserInfo().then(({data}) => {
        this.allUsersData = [];
        this.allUsers = data;
        this.allUsers = this.allUsers.allUsers;
        for (const user of this.allUsers) {
          if (user.id !== this.userId && user.teams.length < 5 && !this.teammates.includes(user)) {
            this.allUsersData.push(user);
          }
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
          profilePic
          teams{
            id
          }
         }
        }
    `
    }).toPromise();
  }

  getUserInfo() {
  return this.apollo.query({
    query: gql`
      query{
        user{
          id
          email
          name
          streetName
          profilePic
          teams{
            id
            players{
              id
              name
              streetName
            }
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
      if (v.name && this.q) {
        if (v.name.toLowerCase().indexOf(this.q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
    console.log(this.q, this.queryList.length);
  }

  addUser(user) {
    if(user.id == this.user.id){
      const alert = this.alertCtrl.create({
        title: 'Warning!',
        subTitle: 'You cannot add yourself!',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    if (this.team.includes(user)) {
      const alert = this.alertCtrl.create({
        title: 'Warning!',
        subTitle: 'This player is already on your team\'s roster!',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }

    if (this.team.length === 3) { // the team already has 3 players
     const alert = this.alertCtrl.create({
       title: 'Warning!',
       subTitle: 'Your team\'s roster is full!',
       buttons: ['Ok']
     });
     alert.present();
     return;
   }
    const confirm = this.alertCtrl.create({
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
              this.team.push(user);
              console.log('Current team');
              console.log(this.team);
          }
        }
      ]
    });
    confirm.present();
  }


  validateTeam() {
    console.log("1");
    // missing top information
    if (!this.teamName || !this.homeTown) {
      const alert = this.alertCtrl.create({
        title: 'Warning!',
        subTitle: 'Your team is missing some information',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }


    if (this.team.length === 3) {

      for (const player of this.team) {
        this.teamIds.push(player.id);
      }

      this.createTeam().then(({data}) => {
        if (data) {
          const alert = this.alertCtrl.create({
            title: 'Team successfully made!',
            buttons: ['Ok']
          });
          alert.present();
          console.log(data);
          this.navCtrl.setRoot('TabsPage');
        }
      }, (errors) => {
        console.log(errors);
        if (errors == 'Error: GraphQL error: A unique constraint would be violated on Team. Details: Field name = teamName') {
          const toast = this.toastCtrl.create({
            message: 'Team already exists with that name. Try again.',
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }
      });
    } else {
      const alert = this.alertCtrl.create({
        title: 'Warning!',
        subTitle: 'Your team\'s roster is not full! You must have 3 players.',
        buttons: ['Ok']
      });
      alert.present();
    }

  }

  createTeam() {

    console.log(this.teamName);
    console.log(this.homeTown);
    if(!this.teamImage){
      this.teamImage = "";
    }
    console.log(this.teamIds);
    console.log(this.user.id);
    return this.apollo.mutate({
      mutation: gql`
      mutation createTeam($teamName: String!, $homeTown: String, $teamImage: String, $playerId: [ID!], $captainId: ID!){
        createTeam(teamName: $teamName, homeTown: $homeTown, teamImage: $teamImage, playersIds: $playerId, captainId: $captainId){
                     id
                   }
                 }
      `,
      variables: {
        teamName: this.teamName,
        homeTown: this.homeTown,
        teamImage: this.teamImage,
        playerId: this.teamIds,
        captainId: this.user.id
      }
    }).toPromise();
  }

  goToTabsPage(){
    this.navCtrl.push('TabsPage');
  }



  presentActionSheet() {
   let actionSheet = this.actionSheetCtrl.create({
     buttons: [
       {
         text: 'Take Photo',
         handler: () => {
           this.takePhoto();
         }
       },
       {
         text: 'Choose Photo',
         handler: () => {
           this.getPhoto();
         }
       },
       {
         text: 'Cancel',
         role: 'cancel',
         handler: () => {
           console.log('Cancel clicked');
         }
       }
     ]
   });

   actionSheet.present();
 }

 takePhoto() {
 const options: CameraOptions = {
   quality: 50,
   destinationType: 0,
   targetWidth: 500,
   targetHeight: 500,
   encodingType: 0,
   correctOrientation: true,
   allowEdit: true
 };
 this.Camera.getPicture(options).then((ImageData) => {
   const base64Image = 'data:image/jpeg;base64,' + ImageData;
   this.teamImage = base64Image;
 }, (err) => {
      console.log(err);
 });
}

getPhoto() {
 const options: CameraOptions = {
   quality: 50,
   destinationType: 0,
   targetWidth: 500,
   targetHeight: 500,
   encodingType: 0,
   sourceType: 0,
   correctOrientation: true,
   allowEdit: true,
   mediaType: 2
 };
 this.Camera.getPicture(options).then((ImageData) => {
   console.log(ImageData);
   const base64Image = 'data:image/jpeg;base64,' + ImageData;
   this.teamImage = base64Image;
 }, (err) => {
      console.log(err);
 });
}


  changePic() {
    console.log('clicked');
    const options: CameraOptions = {
      quality: 50,
      destinationType: 0,
      targetWidth: 500,
      targetHeight: 500,
      encodingType: 0,
      sourceType: 0,
      correctOrientation: true,
      allowEdit: true

    };
    if (this.platform.is('android')) {
      this.Camera.getPicture(options).then((ImageData) => {
        const base64Image = 'data:image/jpeg;base64,' + ImageData;
        this.teamImage = base64Image;
      });
    } else if (this.platform.is('ios')) {
      this.Camera.getPicture(options).then((ImageData) => {
        const base64Image = 'data:image/jpeg;base64,' + ImageData;
        this.teamImage = base64Image;
      });
    }
  }
}
