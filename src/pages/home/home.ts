import { Component } from '@angular/core';
import { AlertController, App, IonicPage, LoadingController, ModalController, NavController, Platform, ToastController } from 'ionic-angular';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import {
  GoogleMap,
  GoogleMapOptions,
  GoogleMaps,
  GoogleMapsEvent,
  LatLng,
 } from '@ionic-native/google-maps';
 import CourtProvider from '../../providers/court/court';
 import { OneSignal } from '@ionic-native/onesignal';
import UserProvider from '../../providers/user/user';
 import { Court, User } from '../../types';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: GoogleMap;
  courts: Array<Court>;
  loading: any;
  private playerId = null;

  constructor(
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public geolocation: Geolocation,
    public platform: Platform,
    public courtProvider: CourtProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public app: App,
    private oneSignal: OneSignal,
    private userProvider: UserProvider,
  ) {
    platform.ready().then(() => {
      // this.navCtrl.push('SchedulePage', { id: 'cje7iinnj4ywu0189yhx9bz7z' });
      this.loadMap();
      // this.navCtrl.push('MapDetailPage', { id: 'cje7iinnj4ywu0189yhx9bz7z' });
      // this.navCtrl.push('TeamProfilePage', { id: 'cjehxya9877co0189hv57ihtj' });
    });
  }

  ionViewDidLoad() {
    this.oneSignal.getPermissionSubscriptionState().then((state) => {
      this.playerId = state.subscriptionStatus.userId;
      this.showToast(this.playerId);
      this.userProvider.updatePlayerId(this.playerId);
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

  addMap(lat: number, lng: number) {
    // const home = new LatLng(lat, lng);
    const campus = new LatLng(42.729863, -84.477767);
    const mapOptions: GoogleMapOptions = {
      camera: {
        target: campus,
        zoom: 13,
      },
      controls: {
        myLocationButton: true,
        compass: true,
        zoom: true,
      },
      gestures: {
        zoom: true,
        rotate: true,
      }
    };

    this.map = GoogleMaps.create('map', mapOptions);
    const iconImage = {
      url: 'assets/imgs/home.png',
      size: {
          width: 32,
          height: 32
      }
    };
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        this.map.addMarker({
          icon: iconImage,
          animation: 'DROP',
          position: campus,
        });
        this.courtProvider.fetchCourts().subscribe((courts) => {
          courts.map(court => this.addMarker(court));
        });
      }
    );
  }

  loadMap() {
    const locationOptions: GeolocationOptions = { timeout: 20000, enableHighAccuracy: true };
    this.geolocation.getCurrentPosition(locationOptions).then((position) => {
      console.log(position);
      this.addMap(position.coords.latitude, position.coords.longitude);
    }, (err) => {
      console.log(err);
    });
  }

  addMarker(court: Court) {
    const coords = new LatLng(court.latitude, court.longitude);
    const iconImage = {
      url: 'assets/imgs/pin.png',
      size: {
          width: 32,
          height: 32
      }
    };
    this.map.addMarker({
      icon: iconImage,
      animation: 'DROP',
      position: coords,
    })
    .then((marker) => {
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        console.log('Clicked');
        this.openDetail(court);
      });
    });
  }

  openDetail(court: Court) {
    console.log('opening MapDetailPage');
    this.navCtrl.push('MapDetailPage', { id: court.id });
  }

  logoutUser() {

    const alert = this.alertCtrl.create({
           title: 'Are you sure you want to logout?',
           buttons: [
             {
             text: 'Logout',
             handler: () => {
               window.localStorage.removeItem('graphcoolToken');
               this.loading = this.loadingCtrl.create({
                 dismissOnPageChange: true,
                 content: 'Logging Out...'
               });
               this.loading.present();
               // this.navCtrl.setRoot(WelcomePage);
               // location.reload();
               // this.navCtrl.push(WelcomePage);
                this.app.getRootNav().setRoot('WelcomePage');
             }
           },
           {
             text: 'Cancel',
             handler: () => {
               console.log('cancel clicked');
               return;
             }
           }
         ]
         });
        alert.present();

  }

}
