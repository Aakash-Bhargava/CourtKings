import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import {
  CameraPosition,
  GoogleMap,
  GoogleMapOptions,
  GoogleMaps,
  GoogleMapsEvent,
  HtmlInfoWindow,
  LatLng,
  Marker,
  MarkerOptions,
 } from '@ionic-native/google-maps';

 type Court = {
   name: string,
   latitude: number,
   longitude: number,
   type: 'outdoor' | 'indoor',
   region: string,
 };

const fake_courts: Array<Court> = [
  {
    name: 'East Holmes',
    latitude: 42.726017,
    longitude: -84.462674,
    type: 'outdoor',
    region: 'East Campus',
  },
  {
    name: 'IM East Outdoor West',
    latitude: 42.724272,
    longitude: -84.469044,
    type: 'outdoor',
    region: 'East Campus',
  },
  {
    name: 'IM East Outdoor East',
    latitude: 42.724279,
    longitude: -84.468875,
    type: 'outdoor',
    region: 'East Campus',
  },
  {
    name: 'Snyder-Phillips Outdoor',
    latitude: 42.730856,
    longitude: -84.473603,
    type: 'outdoor',
    region: 'North Campus',
  },
  {
    name: 'Case Hall West',
    latitude: 42.72369,
    longitude: -84.48722,
    type: 'outdoor',
    region: 'South Campus',
  },
  {
    name: 'Case Hall East',
    latitude: 42.723716,
    longitude: -84.487054,
    type: 'outdoor',
    region: 'South Campus',
  },
  {
    name: 'Cherry Lane Park',
    latitude: 42.722699,
    longitude: -84.491103,
    type: 'outdoor',
    region: 'South Campus',
  },
  {
    name: 'Mayo Hall',
    latitude: 42.734471,
    longitude: -84.486814,
    type: 'outdoor',
    region: 'North Campus',
  },
  {
    name: 'Rather-Bryan West',
    latitude: 42.73224,
    longitude: -84.49613,
    type: 'outdoor',
    region: 'Brody',
  },
  {
    name: 'Rather-Bryan East',
    latitude: 42.732167,
    longitude: -84.495921,
    type: 'outdoor',
    region: 'Brody',
  },
  {
    name: 'Bailey-Armstrong East',
    latitude: 42.730724,
    longitude: -84.496076,
    type: 'outdoor',
    region: 'Brody',
  },
  {
    name: 'Bailey-Armstrong West',
    latitude: 42.730726,
    longitude: -84.496275,
    type: 'outdoor',
    region: 'Brody',
  },
  {
    name: 'Kalamazoo-Marigold',
    latitude: 42.727665,
    longitude: -84.500735,
    type: 'outdoor',
    region: 'Brody',
  },
  {
    name: 'Shaw West',
    latitude: 42.726862,
    longitude: -84.47727,
    type: 'outdoor',
    region: 'Rivertrail',
  },
  {
    name: 'Shaw East',
    latitude: 42.726826,
    longitude: -84.477181,
    type: 'outdoor',
    region: 'Rivertrail',
  },
];

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: GoogleMap;
  courts: Array<Court>;

  constructor(
    public navCtrl: NavController,
    public geolocation: Geolocation,
    public platform: Platform,
  ) {
    platform.ready().then(() => {
      this.loadMap();
    });
  }

  addMap(lat: number, lng: number) {
    const home = new LatLng(lat, lng);
    const mapOptions: GoogleMapOptions = {
      camera: {
        target: home,
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
          position: home,
        });
        this.getCourts().then((courts) => {
          courts.map(court => this.addMarker(court));
        });
      }
    );

  }

<<<<<<< Updated upstream
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
    }).then(mark => this.addInfoWindow(mark, court));
  }

  addInfoWindow(marker: Marker, court: Court) {
    const content = `<h4>${court.name}</h4><p>${court.region} ${court.type}</p>`;
    const infoWindow = new HtmlInfoWindow();
    infoWindow.setContent(content);
    marker
      .on(GoogleMapsEvent.MARKER_CLICK)
      .subscribe(() => infoWindow.open(marker));
  }
=======
      this.apollo.query({
        query: gql`
          query {
            user{
              id
              name
              email
            }
          }
        `
      }).toPromise().then(({data}) => {
        console.log(data);
      })
>>>>>>> Stashed changes

  getCourts(): Promise<Array<Court>> {
    return new Promise((resolve, reject) => {
      resolve(fake_courts);
    });
  }

}
