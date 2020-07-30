import { AuthService } from './../../Services/Auth/auth.service';
import { Router } from '@angular/router';
import { HTTPService } from './../../Services/HTTP/HTTP.service';
import { User } from './../../Models/user.model';
import { Component, OnInit, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  showModal= true ;
  users : User[] = [] ;
  selectedUser : User = new User() ;  
  @ViewChild('closeButton1') closeButton1 ;
  @ViewChild('closeButton2') closeButton2 ;



  constructor(private httpService : HTTPService , private router: Router , private authService : AuthService) {
    this.httpService.getUsers().subscribe((users)=>{
      this.users=users;
      // console.log(users);
    }); 



    //the 3 following subscriptions are for the reaction of when a delete/edit/create form is success for user 
    this.httpService.userAdded.subscribe((user)=> {
      //unshift adds to the beginning
      this.users.unshift(user);
    }); 

    this.httpService.userUpdated.subscribe((user)=> {
      const index = this.users.findIndex((element) => element.email == user.email);
      this.users[index] = user;
      
    }); 
    this.httpService.userDeleted.subscribe((user)=> {
      const index = this.users.findIndex((element) => element.email == user.email);
      this.users.splice(index,1);
    }); 


   }

  ngOnInit(): void {

  }
  selectUser(user) {
    this.selectedUser = {...user} ;
    
  }



  closeModal() {
    
    this.closeButton1.nativeElement.click();
    this.closeButton2.nativeElement.click();
  
  }
 
}
