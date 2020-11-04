import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Storage } from '@ionic/storage'; 

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
  	public auth: AuthService, 
  	public router: Router,
  	private storage: Storage
	) {}
  canActivate():Promise<boolean> {

  	return this.auth.isAuthenticated().then((isAuthenticated)=>{
	  	if (!isAuthenticated) {
	      this.router.navigate(['login']);
	      return false;   		
	  	}
			return true;  		
  	}); 
  }
}

@Injectable()
export class BranchPickerGuardService implements CanActivate {
  constructor(
  	public auth: AuthService, 
  	public router: Router,
  	private storage: Storage
	) {}
  canActivate():Promise<boolean> {
  	let currentBranch = undefined; 
  	let rol = undefined; 
  	return this.storage.get('current_branch').then((branch)=>{
  		if (branch === undefined || branch === null) {
  			return true; 
  		} else {
        this.router.navigate(['/home']); 
        return false; 
  		}
  	})
  }
}
@Injectable()
export class BranchGuardService implements CanActivate {
  constructor(
  	public auth: AuthService, 
  	public router: Router,
  	private storage: Storage
	) {}
  canActivate():Promise<boolean> {
  	let current_branch = undefined; 
  	let user = undefined; 
  	return this.storage.get('current_branch').then((branch)=>{
  		current_branch = branch;
  	}).then(()=>{
  		return this.storage.get('user'); 
  	}).then((u)=>{
			user = u; 
		}).then(()=>{
			if (user.id_rol == 3 && (current_branch === null || current_branch === undefined)) {
				this.router.navigate(['/pick-branch']); 
				return false; 
			} else {
				if (user.id_rol != 3 && (current_branch === null || current_branch === undefined)) {
					this.storage.clear(); 
					this.router.navigate(['/login']); 
					return false; 
				}
			}
			return true; 
		})
  }
}