import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { LoginCredentials } from '../interfaces/LoginCredentials';
import { environment } from './../../environments/environment'; 
import { UserInterface, User } from '../interfaces/User';
import { ToastController } from '@ionic/angular'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [
  	ApiService,
    AuthService	
	]
})
export class LoginPage implements OnInit {

	public credentials: LoginCredentials = {
		email: "",
		password: ""
	}; 

  constructor(
    private api: ApiService, 
    private auth: AuthService, 
    private toast: ToastController
  ) { 
  }
  async presentToast(message) {
    let toast = await this.toast.create({
      message: message,
      duration:  5000,
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
  login(){
  	this.auth.authenticate(this.credentials); 
  }
  ngOnInit() {
  }

}
