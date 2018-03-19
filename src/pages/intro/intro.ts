import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroPage');
  }

  goToHomePage(){
    this.navCtrl.setRoot('TabsPage');
  }

  warning(){
    let alert = this.alertCtrl.create({
      title: 'Warning!',
      subTitle: "In order to schedule games you will need to make a team!",
      buttons: [{
        text: 'Create Team',
        handler: () => {
          console.log('Create Team clicked');
        }
      },{
        text: 'Go to Home',
        handler: () => {
          this.goToHomePage();
          console.log('cancel clicked');
        }
      }
      ]});
      alert.present();
      return;
  }

}
