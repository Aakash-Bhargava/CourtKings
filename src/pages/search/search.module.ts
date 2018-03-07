import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPage } from './search';
import { SuperTabsModule } from 'ionic2-super-tabs';


@NgModule({
  declarations: [
    SearchPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPage),
    SuperTabsModule
  ],
  exports: [
    SearchPage
  ]
})
export class SearchPageModule {}
