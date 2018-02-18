import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email: any;
  password: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastController, public apollo: Apollo) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  goToSignUpPage() {
    this.navCtrl.push('SignUpPage');
  }

  doLogin(event) {
      const userInfo = <any>{};
      this.signIn().then(({data}) => {
        if (data) {
          userInfo.data = data;
          console.log(userInfo.data.authenticateUser.token);
          window.localStorage.setItem('graphcoolToken', userInfo.data.authenticateUser.token);
          console.log(userInfo.data);
        }
      }).then(() => {
        this.navCtrl.push('TabsPage');
      }).catch(() => {
        console.log('view was not dismissed');
        this.showToast();
      });
    }

    showToast() {
    const toast = this.toastCtrl.create({
      message: 'Login failed, Please try again.',
      duration: 2500,
      position: 'top'
    });

    toast.present(toast);
  }

  signIn() {
      return this.apollo.mutate({
        mutation: gql`
        mutation authenticateUser($email: String!,
                            $password: String!){

          authenticateUser(email: $email, password: $password){
            token,
            id
          }
        }
        `,
        variables: {
          email: this.email,
          password: this.password,
        }
      }).toPromise();
  }


}
