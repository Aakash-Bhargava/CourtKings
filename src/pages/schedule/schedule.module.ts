import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SchedulePage } from './schedule';

import { MomentModule } from 'angular2-moment';


@NgModule({
  declarations: [
    SchedulePage,
  ],
  imports: [
    IonicPageModule.forChild(SchedulePage),
    MomentModule
  ],
  exports: [
    SchedulePage,
  ]
})
export class SchedulePageModule {}
