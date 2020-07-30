import { Router } from '@angular/router';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { User } from './../../Models/user.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  selectedUser : EventEmitter<User> ;
  constructor(private httpClient : HttpClient , private router : Router ) {

    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
 
    this.selectedUser = new EventEmitter<User>();
  }


  public get currentUserValue(): User {
    return this.currentUserSubject.value;
}


  selectUser(user) {
    this.selectedUser.emit(user);
  }

  login(email,password) {

    var formData: any = new FormData();
    formData.append("email",email);
    formData.append("password", password);

    return this.httpClient.post<User>('http://127.0.0.1:8000/timetracker/api/login',formData)
    .pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token',user.token);
      this.currentUserSubject.next(user);

      return user;
  }));
  }


  logout(){
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        //DISABLE NAV BAR
        this.router.navigateByUrl('login');

  }

  changePassowrd(email,password,newPassword){
    return this.httpClient.post<User>('http://127.0.0.1:8000/timetracker/api/changepassword',{
      email,
      password,
      newPassword
    });

  };

}



