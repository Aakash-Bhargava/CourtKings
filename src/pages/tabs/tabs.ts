import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = "HomePage";
  tab2Root = "SearchPage";
  tab3Root = "NotificationsPage";
  tab4Root = "ProfilePage";

  constructor() {

  }
}
