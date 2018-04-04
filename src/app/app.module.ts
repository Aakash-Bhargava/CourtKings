import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';

import { SuperTabsModule } from 'ionic2-super-tabs';
import { SuperTabsController } from 'ionic2-super-tabs';

import { HttpClientModule } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { Apollo, ApolloModule } from 'apollo-angular';

import { Camera } from '@ionic-native/camera';
import { OneSignal } from '@ionic-native/onesignal';

import CourtProvider from '../providers/court/court';
import UserProvider from '../providers/user/user';
import TeamProvider from '../providers/team/team';


@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpLinkModule,
    IonicModule.forRoot(MyApp),
    SuperTabsModule.forRoot(),
    ApolloModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SuperTabsController,
    Geolocation,
    CourtProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    TeamProvider,
    Camera,
    OneSignal,
  ]
})
export class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    const http = httpLink.create({ uri: 'https://api.graph.cool/simple/v1/cjdnnk64a7j750115weeh5xmm' });

    const auth = setContext((_, {} ) => {
      // get the authentication token from local storage if it exists
      const token = localStorage.getItem('graphcoolToken');
      // return the headers to the context so httpLink can read them

      // Create new HttpHeader everytime a graphcool token is sent
      const headers = new HttpHeaders();

      if (!token) {
        return {};
      } else {
        return {
          headers: headers.append('Authorization', `Bearer ${token}`)
        };
      }
    });

    apollo.create({
      link: auth.concat(http),
      cache: new InMemoryCache()
    });
  }
}
