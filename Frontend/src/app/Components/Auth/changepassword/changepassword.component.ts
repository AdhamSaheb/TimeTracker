import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/Auth/auth.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
  
  password : String = '' ; 
  newPassword : String = '' ; 
  newPassword2 : String = '' ; 
  passwordError = '' ; 
  authError = '' ; 
  constructor(private authService: AuthService , private router : Router) {}

  ngOnInit(): void {
  }

  onChangePassowrd() {
    var storage = localStorage.getItem('user');
    const user = JSON.parse(storage);
    const email = user.email ; 
    if(this.newPassword==this.newPassword2) {
    console.log(email,this.password)
    this.authService.changePassowrd(email, this.password,this.newPassword)
    .subscribe(
        data => {
            alert('Passowrd has been Changed ');
            this.router.navigateByUrl('');
        },
        error => {
            this.passwordError = '' ; 
            this.authError= 'Authentication Error' ;
        });
  }
  else {
    this.passwordError='Passwords Don\'t Match'
  }
}

}
