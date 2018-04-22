import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import UserProvider from '../../providers/user/user';
import { Notification, UserDetail } from '../../types';

const compare = (a: Notification, b: Notification) => {
  if (a.createdAt < b.createdAt)
    return -1;
  if (a.createdAt > b.createdAt)
    return 1;
  return 0;
};

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  notifications: Array<Notification> = [];
  loading = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userProvider: UserProvider,
  ) {
    this.userProvider
    .fetchCurrentUser()
    .subscribe((user: UserDetail) => {
      let notifications: Array<Notification> = user.notifications;
      user.teams.forEach((team) => {
        notifications = notifications.concat(team.notifications);
      });
      this.notifications = notifications.sort(compare);
      this.loading = false;
    });
  }

}
