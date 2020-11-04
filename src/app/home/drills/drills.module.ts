import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DrillsPageRoutingModule } from './drills-routing.module';

import { DrillsPage } from './drills.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DrillsPageRoutingModule,
  ],
  declarations: [
  ],
  entryComponents: []
})
export class DrillsPageModule {}
