import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router} from '@angular/router';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { LoginCredentials } from '../interfaces/LoginCredentials';
import { environment } from './../../environments/environment'; 
import { ApiService } from './api.service'; 

const concatArray = (arr) => {
  let str = ``; 
  arr.forEach((txt) => {
    str = str + txt + "\n"; 
  });
  return str; 
}

@Injectable()
export class AuthService {

  private readonly loginURL = environment.API_ENDPOINT + "auth/login"

  constructor(
  	public jwtHelper: JwtHelperService,
  	private storage: Storage,
    private toastController: ToastController,
    private router: Router,
    private api: ApiService
	) {}
  // ...
  public async isAuthenticated():Promise<boolean> {
    const token: any = await this.storage.get("token");  
    let isAuthenticated = !this.jwtHelper.isTokenExpired(token);
    return isAuthenticated; 
  }
  async presentToast(message) {
    // Maybe User and Pass were wrong (?)
    let toast = await this.toastController.create({
      message: "Correo o contraseña incorrectos.",
      duration:  3000,
      position:  "bottom", 
      cssClass:  "toast-error",
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    }); 
    toast.present(); 
  }  
  public async authenticate(credentials: LoginCredentials) {
    let branches: any;  
    const response = await fetch(this.loginURL, {
      method: 'POST', 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin":"*",
        "Access-Control-Allow-Methods" : "GET,POST,PUT,DELETE,OPTIONS",        
      },
      body: JSON.stringify(credentials) 
    }).then((resp)=>{
      return resp.json();
    }).then((json)=>{
      let user = json.data;
      if (json.data && json.data.token) {
        this.storage.set("token", json.data.token)
          .then(()=>{
            return this.storage.set("user", user); 
          })
          .then(()=>{
            // return this.api.get(`sucursal/bygym/${json.data.gimnasio.id}`, {})         
            return fetch(environment.API_ENDPOINT + `sucursal/bygym/${json.data.gimnasio.id}`, {
              method: 'GET', 
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', 
                'Authorization': 'Bearer ' + user.token
              }
            })                
          })
          .then((response)=>{
            return response.json();
          })          
          .then((response)=>{
            branches = response.data; 
            return this.storage.set('branches', branches); 
          })
          .then(()=>{
            if (user.id_rol === 3) {
              this.router.navigate(['/pick-branch']); 
            } else {
              let userBranch = branches.find((b)=>{
                return b.id === user.id_sucursal;
              })
              this.storage.set('current_branch', userBranch); 
              this.router.navigate(['/home']); 
            }            
          })


      }
      if (json.errors) {
        this.presentToast(concatArray(json.errors)); 
      }
    });  	
  }
}