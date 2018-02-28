import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GameEndConfirmationPage } from './game-end-confirmation';

@NgModule({
  declarations: [
    GameEndConfirmationPage,
  ],
  imports: [
    IonicPageModule.forChild(GameEndConfirmationPage),
  ],
  exports: [
    GameEndConfirmationPage,
  ]
})
export class GameEndConfirmationPageModule {}
