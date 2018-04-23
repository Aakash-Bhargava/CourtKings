import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TodaysChallengesPage } from './todays-challenges';

@NgModule({
  declarations: [
    TodaysChallengesPage,
  ],
  imports: [
    IonicPageModule.forChild(TodaysChallengesPage),
  ],
  exports: [
    TodaysChallengesPage,
  ]
})
export class PendingChallengesPageModule {}
