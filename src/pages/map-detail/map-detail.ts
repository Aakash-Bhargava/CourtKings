import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import CourtProvider from '../../providers/court/court';
import { CourtDetail } from '../../types';

@IonicPage()
@Component({
  selector: 'page-map-detail',
  templateUrl: 'map-detail.html',
})
export class MapDetailPage {
  private court: CourtDetail;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private courtProvider: CourtProvider,
  ) {
  }

  ngOnInit() {
    const id = this.navParams.get('id');
    this.courtProvider
      .getCourtById(id)
      .subscribe((court: CourtDetail) => this.court = court);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  goback() {
    this.navCtrl.pop();
  }

  openSchedule() {
    this.navCtrl.push('SchedulePage', { court: this.court });
  }

  openTeamProfile(id: string) {
    this.navCtrl.push('TeamProfilePage', { id });
  }

}
