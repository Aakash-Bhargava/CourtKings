import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchCourtPage } from './search-court';

@NgModule({
  declarations: [
    SearchCourtPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchCourtPage),
  ],
})
export class SearchCourtPageModule {}
