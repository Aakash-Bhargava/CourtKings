import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPlayerPage } from './search-player';

@NgModule({
  declarations: [
    SearchPlayerPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPlayerPage),
  ],
})
export class SearchPlayerPageModule {}
