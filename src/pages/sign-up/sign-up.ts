import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  name: any;
  streetName: any;
  email: any;
  password: any;
  imageUri: any = '';

  userInfo = <any>{};

  constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Apollo,
              public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  signUp() {
    console.log(this.name);
    console.log(this.email);
    console.log(this.password);
  }

  goToLoginPage() {
    this.navCtrl.push('LoginPage');
  }


  loginEvent(event) {
    if (!this.name || !this.email || !this.password) {
      const toast = this.toastCtrl.create({
        message: 'There is some information missing. Try again.',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    } else {

        this.createUser().then(({data}) => {
          if (data) {
            this.SignIn().then(({data}) => {
              this.userInfo.data = data;
              console.log(this.userInfo.data.signinUser.token);
              window.localStorage.setItem('graphcoolToken', this.userInfo.data.signinUser.token);
              this.navCtrl.push('IntroPage');
            }, (errors) => {
                console.log(errors);
                if (errors === 'GraphQL error: No user found with that information') {
                  const toast = this.toastCtrl.create({
                    message: 'User already exists with that information. Try again.',
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();
                }
              });

          }
        }, (errors) => {
          console.log(errors);
          if (errors === 'Error: GraphQL error: User already exists with that information') {
            const toast = this.toastCtrl.create({
              message: 'User already exists with that information. Try again.',
              duration: 3000,
              position: 'top'
            });
            toast.present();
          }
        });

    }
  }

  createUser() {
      return this.apollo.mutate({
        mutation: gql`
        mutation createUser($email: String!,$password: String!,
                            $name: String!,$streetName: String!, $profilePic: String){
          createUser(authProvider: { email: {email: $email, password: $password}},
                     name: $name,streetName: $streetName, profilePic: $profilePic){
                       id
                     }
                   }
        `,
        variables: {
          name: this.name,
          streetName: this.streetName,
          email: this.email,
          password: this.password,
          profilePic: this.imageUri
        }
      }).toPromise();
  }

  SignIn() {
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
          password: this.password,
        }
      }).toPromise();
  }



}
