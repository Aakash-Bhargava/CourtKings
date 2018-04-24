import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllChallengesPage } from './all-challenges';

@NgModule({
  declarations: [
    AllChallengesPage,
  ],
  imports: [
    IonicPageModule.forChild(AllChallengesPage),
  ],
  exports: [
    AllChallengesPage,
  ]
})
export class AllChallengesPageModule {}
