import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PendingChallengesPage } from './pending-challenges';

@NgModule({
  declarations: [
    PendingChallengesPage,
  ],
  imports: [
    IonicPageModule.forChild(PendingChallengesPage),
  ],
  exports: [
    PendingChallengesPage,
  ]
})
export class PendingChallengesPageModule {}
