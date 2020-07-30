import { NavbarService } from './../../Services/Navbar/navbar.service';
import { AuthService } from './../../Services/Auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  name : String = '';
  role : string = '' ; 
  dropDownEnabled = true;
  constructor(private authService : AuthService , private navService : NavbarService) {
    var storage = localStorage.getItem('user');
    if(storage != null) {
    const user = JSON.parse(storage)
    this.name= user.first_name +" "+ user.last_name;
    this.role = user.roles;
    // console.log(this.roles)
    }
    else {
      this.dropDownEnabled = false;
      this.name= '';
      this.role = '' ;
    }
  }


  ngOnInit(): void {
    this.navService.changeData.subscribe((data)=> {
      var storage = localStorage.getItem('user');
      const user = JSON.parse(storage)
      this.name= '';
      this.role = user.roles;
      // console.log(this.isAdmin(),this.isManager(),this.isEmployee());
      this.dropDownEnabled=true;
    });
    
  }

  logout() {
    this.authService.logout();
    this.dropDownEnabled= false;
    // this.navService.changeData.emit("Logged out !");
  }



}
