import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, Platform } from 'ionic-angular';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import {
  GoogleMap,
  GoogleMapOptions,
  GoogleMaps,
  GoogleMapsEvent,
  LatLng,
 } from '@ionic-native/google-maps';
 import CourtProvider from '../../providers/court/court';
 import { Court } from '../../types';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: GoogleMap;
  courts: Array<Court>;

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public geolocation: Geolocation,
    public platform: Platform,
    public courtProvider: CourtProvider,
  ) {
    platform.ready().then(() => {
      this.loadMap();
      // this.courtProvider.fetchCourts().then((data) => {
      //   console.log(data);
      // });
      // this.courtProvider.getCourtById('cje7iinnj4ywu0189yhx9bz7z')
      // .then((data) => {
      //   console.log(data);
      // });
      // this.navCtrl.push('MapDetailPage', { id: 'cje7iinnj4ywu0189yhx9bz7z' });
    });
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
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        this.map.addMarker({
          animation: 'DROP',
          position: campus,
        });
        this.courtProvider.getAllCourts().then((courts) => {
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
    this.map.addMarker({
      icon: 'blue',
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
    this.navCtrl.push('MapDetailPage', { id: court.id });
  }

}
