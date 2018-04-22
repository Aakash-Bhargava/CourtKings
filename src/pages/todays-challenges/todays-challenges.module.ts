import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TodaysChallenges } from './todays-challenges';

@NgModule({
  declarations: [
    TodaysChallenges,
  ],
  imports: [
    IonicPageModule.forChild(TodaysChallenges),
  ],
  exports: [
    TodaysChallenges,
  ]
})
export class PendingChallengesPageModule {}
