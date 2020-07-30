import { AuthService } from './../../Services/Auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {



  constructor(private authService : AuthService , private router : Router ) {
    var storage = localStorage.getItem('user');
    const user = JSON.parse(storage)
    if (user == null) this.router.navigateByUrl('/login');
    else if(user.roles.includes('superadmin')) this.router.navigateByUrl('/users');
    else if(user.roles.includes('manager')) this.router.navigateByUrl('/projects');
    else if(user.roles.includes('employee')) this.router.navigateByUrl('/timesheet');
  }

  ngOnInit() {

    
  }


}
