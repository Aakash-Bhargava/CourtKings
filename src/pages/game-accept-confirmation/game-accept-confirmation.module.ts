import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GameAcceptConfirmationPage } from './game-accept-confirmation';

@NgModule({
  declarations: [
    GameAcceptConfirmationPage,
  ],
  imports: [
    IonicPageModule.forChild(GameAcceptConfirmationPage),
  ],
})
export class GameAcceptConfirmationPageModule {}
