import { Injectable } from '@angular/core';
import { CanActivate, } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

  constructor() { }

  canActivate() : boolean {

    var storage = localStorage.getItem('user');
    if(storage != null) {
    const user = JSON.parse(storage)
    if (user.roles =='superadmin') return true
    }
    return false
  
  } 
}

