import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';

import { DatePickerComponent } from '../components/date-picker/date-picker.component'; 
import { MenuComponent } from '../components/menu/menu.component'; 
import { DrillsPage } from './drills/drills.page'; 
import { RankingPage } from './ranking/ranking.page'; 
import { AttendancePage } from './attendance/attendance.page'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage, 
        children: [
          {
            path:'',
            redirectTo: 'attendance',
            pathMatch: 'full'             
          },
          {
            path: 'drills/:random',
            component: DrillsPage,
          },
          {
            path: 'ranking',
            component: RankingPage
          },
          {
            path: 'attendance',
            component: AttendancePage
          }
        ]
      },
    ])
  ],
  declarations: [
    HomePage,
    DatePickerComponent,
    MenuComponent,
    DrillsPage,
    RankingPage,
    AttendancePage
  ]
})
export class HomePageModule {}
