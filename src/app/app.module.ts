import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

<<<<<<< Updated upstream
=======
//pages
import { SearchPage } from '../pages/search/search';
import { NotificationsPage } from '../pages/notifications/notifications';
import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { WelcomePage } from '../pages/welcome/welcome';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { LoginPage } from '../pages/login/login';


>>>>>>> Stashed changes
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';

import { HttpClientModule } from '@angular/common/http';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Apollo, ApolloModule } from 'apollo-angular';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpLinkModule,
    IonicModule.forRoot(MyApp),
    ApolloModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    apollo.create({
      link: httpLink.create({ uri: 'https://api.graph.cool/simple/v1/cjdathzip2q32019034unk5yo' }),
      cache: new InMemoryCache()
    });
  }
}
