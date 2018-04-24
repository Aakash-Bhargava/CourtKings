import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import UserProvider from '../../providers/user/user';
import { Notification, UserDetail } from '../../types';

const webSocket = new WebSocket(
  'wss://subscriptions.us-west-2.graph.cool/v1/cjdnnk64a7j750115weeh5xmm',
  'graphql-subscriptions',
);

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
    this.getNotifications();
    webSocket.onopen = (event) => {
      const message = {
          type: 'init'
      };
      webSocket.send(JSON.stringify(message));
    };

    const start_subscription = () => {
      const message = {
        id: '1',
        type: 'subscription_start',
        query: `
          subscription {
            Notification(filter: {
              mutation_in: [CREATED, UPDATED, DELETED]
            }) {
              updatedFields
              mutation
              node {
                id
                challenge {
                  id

                }
              }
            }
          }
        `
      };
      webSocket.send(JSON.stringify(message));
    };


    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'init_success': {
          console.log('init_success, the handshake is complete');
          start_subscription();
          break;
        }
        case 'init_fail': {
          throw {
            message: 'init_fail returned from WebSocket server',
            data
          };
        }
        case 'subscription_data': {
          console.log('subscription data has been received', data.payload.data.Notification.node);
          this.getNotifications();
          break;
        }
        case 'subscription_success': {
          console.log('subscription_success');
          break;
        }
        case 'subscription_fail': {
          throw {
            message: 'subscription_fail returned from WebSocket server',
            data
          };
        }
      }
    };
  }

  refresh() {
    console.log('refresh');
    this.getNotifications();
  }

  // getNotifications() {
  //   this.loading = true;
  //   this.userProvider
  //   .fetchCurrentUser()
  //   .toPromise()
  //   .then((user: UserDetail) => {
  //     console.log(user);
  //     let notifications: Array<Notification> = user.notifications;
  //     user.teams.forEach((team) => {
  //       notifications = notifications.concat(team.notifications);
  //     });
  //     this.notifications = notifications.sort(compare);
  //     this.loading = false;
  //   });
  // }

  getNotifications() {
    this.loading = true;
    this.userProvider
    .getNotifications()
    .subscribe((notifications) => {
      this.notifications = notifications;
      this.loading = false;
    });
  }

}
