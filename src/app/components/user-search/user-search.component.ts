import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular'; 
import { ApiService as Api } from '../../services/api.service'; 
import { environment }  from '../../../environments/environment'; 
import { Storage } from '@ionic/storage'; 

const USERS_BY_GYM = 'user/byGym'; 

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss'],
})
export class UserSearchComponent implements OnInit {

	private branch: any;
	private current_user: any;
	private selected_users: any = [];
	public users: any;
	searchTerm = ' '; 
	// private requesting: boolean = false; 

  constructor(
  	private modal: ModalController,
  	private api: Api,
  	private storage: Storage
	) { }
  toggleUser($event, user) {
  	let inStore = this.selected_users.find((u)=>{return u.id === user.id});
  	if (inStore != undefined) {
  		this.selected_users = this.selected_users.filter((u)=>{return u.id !== user.id}); 
  		$event.target.innerHTML = 'Seleccionar'; 
  	} else {
	  	this.selected_users.push(user); 
  		$event.target.innerHTML = 'Quitar'; 
  	}
  	$event.target.classList.toggle('selected');
  }
  ngOnInit() {
  	this.storage.get('current_branch')
  		.then((branch)=>{
        console.log('Entró al primer then');
  			this.branch = branch; 
  		})
  		.then(()=>{
        console.log('Entró al segundo then');
  			return this.storage.get('user'); 
  		})
  		.then((current_user)=>{
        console.log('Entró al tercer then');
        this.current_user = current_user;
        this.getList(1);
  		})
  }
  close(sendUsers: boolean){
  	if (sendUsers) {
	  	this.modal.dismiss({
	  		users: this.selected_users
	  	}); 
  	} else {
  		this.modal.dismiss(); 
  	}
  }

  public getList(page: number): void {
  	// if (this.requesting) return; 
  	// this.requesting = true; 
    let filters = [];
  	let url = USERS_BY_GYM +
        `?id_gimnasio=${this.branch.id_gimnasio}&id_rol=6&page=${page}&filtros=` +
          JSON.stringify(filters) +
          `&id_sucursal=${this.branch.id}&q=${this.searchTerm}`;

    this.api
    	.get(url, {})
    	.then((response)=>{
    		this.users = response.data; 
    	})
    	// .finally(()=>{
  			// this.requesting = false;     		
    	// })
  }  
}
