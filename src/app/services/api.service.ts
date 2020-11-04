import { Injectable } from '@angular/core'; 
import { environment } from './../../environments/environment'; 
import { Storage } from '@ionic/storage'; 
import { 
	HttpClient,
	HttpClientModule,
	HttpHeaders,
} from  '@angular/common/http'; 
import { Observable, Subject } from 'rxjs'; 

@Injectable({
	providedIn: 'root', 
})
export class ApiService { 
	token: string; 
	constructor(
		private http: HttpClient,
		private storage: Storage
	){
	}
	public async get(url, data) {
		return this.storage.get('token')
			.then(token=>this.token = token) 
			.then(()=>{
				return fetch(environment.API_ENDPOINT + url, {
					method: 'GET', 
					headers: {
			      'Accept': 'application/json',
			      'Content-Type': 'application/json',
			      'Access-Control-Allow-Origin': '*', 
			      'Authorization': 'Bearer ' + this.token
					}
				}).then((response)=>{
					return response.json();
				}); 		
		})
	}
	public async post(url, data) {
		return this.storage
			.get('token')
			.then((token)=>{
				this.token = token
			})
			.then(()=>{
			 	return fetch(environment.API_ENDPOINT + url, {
					method: 'POST', 
					headers: {
			      'Accept': 'application/json',
			      'Content-Type': 'application/json',
			      'Access-Control-Allow-Origin': '*', 
        		'Access-Control-Allow-Methods' : 'GET,POST,PUT,DELETE,OPTIONS',        
			      'Authorization': 'Bearer ' + this.token
					},
				 	body: JSON.stringify(data) 
				})
				.then((response)=>{
					return response.json(); 
				})
			});
	}
}