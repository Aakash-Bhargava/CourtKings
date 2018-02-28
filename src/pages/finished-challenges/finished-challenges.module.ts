import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinishedChallengesPage } from './finished-challenges';

@NgModule({
  declarations: [
    FinishedChallengesPage,
  ],
  imports: [
    IonicPageModule.forChild(FinishedChallengesPage),
  ],
  exports: [
    FinishedChallengesPage,
  ]
})
export class FinishedChallengesPageModule {}
