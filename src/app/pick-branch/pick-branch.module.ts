import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PickBranchPageRoutingModule } from './pick-branch-routing.module';

import { PickBranchPage } from './pick-branch.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PickBranchPageRoutingModule
  ],
  declarations: [PickBranchPage]
})
export class PickBranchPageModule {}
