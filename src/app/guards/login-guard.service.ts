import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage';

@Injectable()
export class LoginGuardService implements CanActivate {
  dataResponse: any;

  constructor(
    public auth: AuthService,
    public router: Router,
    public api: ApiService,
    private storage: Storage,
  ) {}
  
  canActivate(): Promise<boolean> {
    return this.auth.isAuthenticated().then((isAuthenticated) => {
      if (isAuthenticated) {
        this.storage.get('user').then(user => {
          this.api.get(`sucursal/bygym/${user.id_gimnasio}`, {}).then(result => {
            this.dataResponse = result;
            this.storage.get('current_branch').then(currentBranch => {
              const userBranch = this.dataResponse.data.find((b) => {
                return b.id === currentBranch.id;
              });
              this.storage.set('current_branch', userBranch);
              this.router.navigate(['home']);
              return false;
            });
          });
        });
      }
      return true;
    });
  }
}
