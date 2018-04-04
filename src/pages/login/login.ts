import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from '../../types';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private email: string;
  private password: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public apollo: Apollo,
  ) {
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad LoginPage');
  // }

  goToSignUpPage() {
    this.navCtrl.push('SignUpPage');
  }

  doLogin(event) {
      const userInfo = <any>{};
      this.signIn().then(({data}) => {
        if (data) {
          userInfo.data = data;
          // console.log(userInfo.data.signinUser.token);
          window.localStorage.setItem('graphcoolToken', userInfo.data.signinUser.token);
          // console.log(userInfo.data);
        }
      }).then(() => {
        this.navCtrl.push('HomePage');
      }).catch(() => {
        console.log('view was not dismissed');
        this.showToast('Login failed, Please try again.');
      });
    }

  showToast(message) {
    const toast = this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'top'
    });

    toast.present(toast);
  }

  signIn() {
    return this.apollo.mutate({
      mutation: gql`
      mutation signinUser($email: String!,
                          $password: String!){
        signinUser(email: {email: $email, password: $password}){
          token
        }
      }
      `,
      variables: {
        email: this.email,
        password: this.password
      }
    }).toPromise();
  }



}
