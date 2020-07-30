import { AuthService } from './Services/Auth/auth.service';
import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit{
  title = 'Time Tracker';

  
  constructor(private authService : AuthService , private router : Router ) {


  }
  ngOnInit(): void {
  }

  showNav() {
    return !(this.router.url == "/login" || this.router.url == "/changepassword") ;   
  }

 


}

