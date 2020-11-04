import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DrillsPage } from './drills.page';

const routes: Routes = [
  {
    path: '',
    component: DrillsPage
  }
];

@NgModule({
  imports: [
  	RouterModule.forChild(routes),
	],
  exports: [RouterModule],
})
export class DrillsPageRoutingModule {}
