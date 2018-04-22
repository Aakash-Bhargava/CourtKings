import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import moment from 'moment';
import UserProvider from '../../providers/user/user';
import CourtProvider from '../../providers/court/court';
import { Challenge, CourtDetail, Schedule, Team, UserDetail } from '../../types';
import { DomSanitizer } from '@angular/platform-browser';

const hasEnoughCoins = (team: Team): boolean => {
  team.players.forEach(p => {
    if (p.coins < 2) {
      return false;
    }
  });
  return true;
};

@IonicPage()
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {
  user: any;
  court: CourtDetail = null;
  timeArray = ['11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm'];
  time = '11am';
  todaysChallenges: Array<Challenge> = [];
  selectedTimePending: Array<Challenge> = [];
  selectedTimeSchedulued: Array<Challenge> = [];
  emptySlots: Array<any> = Array(3);
  date: string = new Date().toISOString();

  constructor(
    public alertCtrl: AlertController,
    public _DomSanitizer: DomSanitizer,
    public navCtrl: NavController,
    public navParams: NavParams,
    public courtProvider: CourtProvider,
    public toastCtrl: ToastController,
    private userProvider: UserProvider) {
  }

  ionViewDidLoad() {
    this.userProvider.fetchCurrentUser().subscribe((user: UserDetail) => {
      this.user = user;
      this.getTodaysChallenges();
    });
  }

  getTodaysChallenges() {
    const id = this.navParams.get('id');
    this.courtProvider
      .getCourtById(id)
      .subscribe((court: CourtDetail) => {
        this.court = court;
        console.log(this.court);
        this.todaysChallenges = court.challenges.filter(t => moment(t.date) >= moment().subtract(1, 'days'));
        this.selectedTimePending = this.todaysChallenges
          .filter(c => c.gameTime === this.time && c.status === 'Pending');
        this.selectedTimeSchedulued = this.todaysChallenges
          .filter(c => c.gameTime === this.time && (c.status === 'Scheduled' || c.status === 'Completed'));
        this.emptySlots = Array(3 - this.selectedTimeSchedulued.length);
      });
  }

  changeTime(time) {
    if (this.time !== time) {
      this.time = time;

      this.selectedTimePending = this.todaysChallenges
        .filter(c => c.gameTime === this.time && c.status === 'Pending');
      this.selectedTimeSchedulued = this.todaysChallenges
        .filter(c => c.gameTime === this.time && (c.status === 'Scheduled' || c.status === 'Completed'));
      this.emptySlots = Array(3 - this.selectedTimeSchedulued.length);
    }
  }

  showToast(message: string) {
    const toast = this.toastCtrl.create({
      message,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }

  cancel(challenge) {
    this.courtProvider.deleteChallenge(challenge.id).subscribe(() => {
      this.getTodaysChallenges();
    });
  }

  quit(challenge) {
    let opponentId = challenge.teams[0].id;
    if (this.isSelfTeam(opponentId)) {
      opponentId = challenge.teams[1].id;
    }
    this.courtProvider.quitChallenge(challenge.id, opponentId).subscribe(() => {
      this.getTodaysChallenges();
    });
  }

  play(challenge) {
    const alert = this.alertCtrl.create();
    alert.setTitle('Select your team.');
    // load your teams
    const teamList = this.getTeamList();
    if (teamList.length > 0) {
      for (const team of teamList) {
        alert.addInput({
          type: 'radio',
          label: team.teamName,
          value: team.id,
          checked: false
        });
      }
      alert.addButton('Cancel');
      alert.addButton({
        text: 'Select',
        handler: id => {
          this.courtProvider
            .pendingToScheduled(challenge.id, id, challenge.teams[0].id)
            .subscribe(() => {
              this.getTodaysChallenges();
              this.showToast('Game Scheduled!');
            });
        }
      });
      alert.present();
    } else {
      this.showToast('You don\'t have qualified team to play!');
    }

    console.log(challenge);
  }

  // alert that shows user's teams and will create an pending challenge.
  addToQueue() {
    const alert = this.alertCtrl.create();
    alert.setTitle('Select your team.');
    const teamList = this.getTeamList();

    if (teamList.length > 0) {
      for (const team of teamList) {
        alert.addInput({
          type: 'radio',
          label: team.teamName,
          value: team.id,
          checked: false
        });
      }

      alert.addButton('Cancel');
      alert.addButton({
        text: 'Select',
        handler: id => {
          this.courtProvider.addPendingChallenge(this.court.id, id, this.time, this.date)
            .subscribe(() => {
              this.getTodaysChallenges();
              this.showToast('Added to the Queue!');
            });
        },
      });
      alert.present();
    } else {
      this.showToast('You don\'t have qualified team to play!');
    }
  }

  getTeamList(): Array<Team> {
    let ids: Array<string> = this.selectedTimePending.map(c => c.teams[0].id);
    this.selectedTimeSchedulued
      .forEach(c => ids = ids.concat(c.teams.map(t => t.id)));
    const teams = this.user.teams.filter((team: Team) => {
      return !ids.includes(team.id)
            && hasEnoughCoins(team)
            && team.players[0].id === this.user.id;
    });
    return teams;
  }

  isSelfTeam(teamId): boolean {
    return this.user.teams.map(t => t.id).includes(teamId);
  }

  isVoted(challenge: Challenge): boolean {
    for (const vote of challenge.votes) {
      if (this.isSelfTeam(vote.voteFrom.id)) {
        return true;
      }
    }
    return false;
  }

  isHourPassed(hour: string, add = 0): boolean {
    return moment().add(add, 'hours') > moment()
      .hours(this.convertTo24(hour));
  }

  convertTo24(time: string): number {
    const split = time.match(/[a-zA-Z]+|[0-9]+/g);
    const res = Number(split[0]);
    if (split[1] === 'pm' && res !== 12) {
      return res + 12;
    }
    return res;
  }

  openTeamProfile(id: string) {
    this.navCtrl.push('TeamProfilePage', { id });
  }

  goback() {
    this.navCtrl.pop();
  }

  goToVote(challenge: Challenge) {
    const teamId = this.isSelfTeam(challenge.teams[0].id)
      ? challenge.teams[0].id
      : challenge.teams[1].id;
    this.navCtrl.push('GameEndConfirmationPage', { challenge, teamId, callback: this.getTodaysChallenges.bind(this) });
  }
}
