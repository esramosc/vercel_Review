export interface UserInterface {
  [propName: string]: any;
}

export class User {

	user: any; 

	constructor(user: UserInterface){		
	}

	private fullName(){
		return this.user.nombre + ' ' + this.user.apellido_paterno;  
	}
}