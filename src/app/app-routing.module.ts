import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './guards/auth-guard.service';
import { LoginGuardService as LoginGuard } from './guards/login-guard.service';
import { BranchPickerGuardService as BranchPickerGuard } from './guards/auth-guard.service';
import { BranchGuardService as BranchGuard } from './guards/auth-guard.service';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full',
    canActivate: [LoginGuard, BranchPickerGuard]
  },
  { 
    path: 'home', 
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [
      AuthGuard, 
      BranchGuard
    ]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canActivate: [LoginGuard]
  },
  {
    path: 'pick-branch',
    loadChildren: () => import('./pick-branch/pick-branch.module').then( m => m.PickBranchPageModule),
    canActivate: [
      AuthGuard, 
      BranchPickerGuard
    ]
  },
  {
    path: 'change-branch',
    loadChildren: () => import('./pick-branch/pick-branch.module').then( m => m.PickBranchPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
