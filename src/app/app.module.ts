import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuardService } from './guards/auth-guard.service';
import { BranchPickerGuardService } from './guards/auth-guard.service';
import { BranchGuardService } from './guards/auth-guard.service';
import { LoginGuardService } from './guards/login-guard.service';

import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { FormsModule } from '@angular/forms';
import { UserSearchComponent } from './components/user-search/user-search.component'; 
import { ShowExerciseComponent } from './components/show-exercise/show-exercise.component'; 
import { DrillModalComponent } from './home/drills/drill-modal/drill-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    UserSearchComponent,
    DrillModalComponent, 
    ShowExerciseComponent,
  ],
  entryComponents: [
    UserSearchComponent,
    DrillModalComponent, 
    ShowExerciseComponent,
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    JwtModule.forRoot({}),
    FormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ApiService,
    AuthService,
    AuthGuardService,
    LoginGuardService,
    BranchPickerGuardService, 
    BranchGuardService, 
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
