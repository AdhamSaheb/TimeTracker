import { NavbarService } from './../../../Services/Navbar/navbar.service';
import { AuthService } from './../../../Services/Auth/auth.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email= '';
  password='';
  error = '';
  constructor( private authService : AuthService,private router : Router , private navService: NavbarService) { }

  ngOnInit(): void {

  }

  login() {
    this.authService.login(this.email, this.password)
    .pipe(first())
    .subscribe(
        user => {
          this.navService.changeData.emit("Some String");
          this.router.navigateByUrl('');

        },
        error => {
            this.error= 'Invalid Email or Password !'
        });
}

  }


