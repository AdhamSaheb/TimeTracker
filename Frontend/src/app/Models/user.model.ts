export class User {

  first_name : string;
  last_name : string;
  roles : string;
  username : string;
  email : string;
  token : string;
  id : number;

  constructor() {
    this.first_name = "";
    this.last_name = "";
    this.first_name = "";
    this.roles = "";
    this.id = 0;
    this.token = "";
    this.username = "";

  }

  isManager() : Boolean{
    return this.roles == 'manager' ;
  }

  isAdmin() : Boolean {
    return this.roles=='superadmin';
  }

  isEmployee() : Boolean {
    return this.roles =='employee';
  }

}

