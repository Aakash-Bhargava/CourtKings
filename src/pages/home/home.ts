import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public apollo: Apollo) {

      this.apollo.query({
        query: gql`
          query {
            user {
              id
            }
          }
        `
      }).toPromise().then(({data}) => {
        console.log(data);
      })

  }

}
