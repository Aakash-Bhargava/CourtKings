import { Component } from '@angular/core';
import { ActionSheetController, IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraOptions } from '@ionic-native/camera';

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
  imageUri: any;

  userInfo = <any>{};

  constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Apollo,
              public toastCtrl: ToastController, private Camera: Camera, public _DomSanitizer: DomSanitizer,
              private platform: Platform, public actionSheetCtrl: ActionSheetController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
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


  signUp() {
    console.log(this.name);
    console.log(this.email);
    console.log(this.password);
  }

  goToLoginPage() {
    this.navCtrl.push('LoginPage');
  }

  validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
  }


  loginEvent(event) {

    if(!this.validateEmail(this.email)){
      const toast = this.toastCtrl.create({
        message: 'The email provided is invalid. Please try again.',
        duration: 3000,
        position: 'middle'
      });
      toast.present();
      return;
    }


    //if there is any information missing during signup then create toast
    if (!this.name || !this.email || !this.password || !this.streetName) {
      const toast = this.toastCtrl.create({
        message: 'There is some information missing. Please fill in all fields.',
        duration: 3000,
        position: 'middle'
      });
      toast.present();
    }
    else{
        this.createUser().then(({data}) => {
          if (data) {
            this.SignIn().then(({data}) => {
              this.userInfo.data = data;
              console.log(this.userInfo.data.signinUser.token);
              window.localStorage.setItem('graphcoolToken', this.userInfo.data.signinUser.token);
              this.navCtrl.push('IntroPage');
            }, (errors) => {
                console.log(errors);
                if (errors == 'GraphQL error: No user found with that information') {
                  const toast = this.toastCtrl.create({
                    message: 'User already exists with that information. Try again.',
                    duration: 3000,
                    position: 'middle'
                  });
                  toast.present();
                }
              });

          }
        }, (errors) => {
          console.log(errors);
          if (errors == 'Error: GraphQL error: User already exists with that information') {
            const toast = this.toastCtrl.create({
              message: 'User already exists with that information. Try again.',
              duration: 3000,
              position: 'middle'
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
        this.imageUri = base64Image;
      });
    } else if (this.platform.is('ios')) {
      this.Camera.getPicture(options).then((ImageData) => {
        const base64Image = 'data:image/jpeg;base64,' + ImageData;
        this.imageUri = base64Image;
      });
    }
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
    this.imageUri = base64Image;
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
    this.imageUri = base64Image;
  }, (err) => {
       console.log(err);
  });
}



}
