import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TeamProfilePage } from './team-profile';

@NgModule({
  declarations: [
    TeamProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(TeamProfilePage),
  ],
})
export class TeamProfilePageModule {}
