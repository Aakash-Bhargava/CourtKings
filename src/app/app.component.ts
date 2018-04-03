import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = 'WelcomePage';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    if (window.localStorage.getItem('graphcoolToken') != null) {
     this.rootPage = 'TabsPage';
   }



    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      if (platform.is('cordova')) {
        const iosSettings = {};
        iosSettings['kOSSettingsKeyAutoPrompt'] = false; // will not prompt users when start app 1st time
        iosSettings['kOSSettingsKeyInAppLaunchURL'] = false; // false opens safari with Launch URL

        // OneSignal Code start:
        // Enable to debug issues:
        window['plugins'].OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

        const notificationOpenedCallback = function(jsonData) {
          console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
          if (jsonData.notification.payload.additionalData != null) {
            console.log('Here we access addtional data');
            if (jsonData.notification.payload.additionalData.openURL != null) {
              console.log('Here we access the openURL sent in the notification data');
            }
          }
        };

        window['plugins'].OneSignal
          .startInit('b3e8dd7c-50dc-406c-ba1c-4eade7ae9d32')
          .inFocusDisplaying(window['plugins'].OneSignal.OSInFocusDisplayOption.Notification)
          .handleNotificationOpened(notificationOpenedCallback)
          .endInit();
      }
      // OneSignal Code start:
      // Enable to debug issues:
      // window['plugins'].OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
      // const notificationOpenedCallback = function(jsonData) {
      //   console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      // };

      // window['plugins'].OneSignal
      //   .startInit('b3e8dd7c-50dc-406c-ba1c-4eade7ae9d32', 'YOUR_GOOGLE_PROJECT_NUMBER_IF_ANDROID')
      //   .handleNotificationOpened(notificationOpenedCallback)
      //   .endInit();
    });
  }
}
