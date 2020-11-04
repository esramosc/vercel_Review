import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PickBranchPage } from './pick-branch.page';

const routes: Routes = [
  {
    path: '',
    component: PickBranchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PickBranchPageRoutingModule {}
