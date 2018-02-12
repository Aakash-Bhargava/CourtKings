import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

<<<<<<< Updated upstream
@IonicPage()
=======
import { HomePage } from '../home/home';
import { SearchPage } from '../search/search';
import { NotificationsPage } from '../notifications/notifications';
import { ProfilePage } from '../profile/profile';

import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

>>>>>>> Stashed changes
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'HomePage';
  tab2Root = 'SearchPage';
  tab3Root = 'NotificationsPage';
  tab4Root = 'ProfilePage';
}
