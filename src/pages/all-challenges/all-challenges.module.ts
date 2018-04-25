import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllChallengesPage } from './all-challenges';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    AllChallengesPage,
  ],
  imports: [
    IonicPageModule.forChild(AllChallengesPage),
    MomentModule
  ],
  exports: [
    AllChallengesPage,
  ]
})
export class AllChallengesPageModule {}
