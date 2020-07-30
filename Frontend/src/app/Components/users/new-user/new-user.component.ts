import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/Models/user.model';
import { HTTPService } from 'src/app/Services/HTTP/HTTP.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css'],

})



export class NewUserComponent  {

  @Input() editMode : boolean ; 
  @Input() user : User ; 
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  password : String = '';
  password2 : String = '';
  passworderror : String = '';
  usernameerror : String = ''; 
  emailerror : String = '' ; 
  otherErrors : String = '' ;
  constructor( private httpService : HTTPService, private _snackBar: MatSnackBar ) {
    this.user= new User();
  }
  hide:String = 'password'


  changeView() {
   this.hide=  (this.hide == 'password') ? this.hide='text' : this.hide='password';
  }

  onSubmit() {

    // if creating a user 
    if(this.editMode){
      this.httpService.updateUser(this.user)
      .subscribe(
        data => {
          this.httpService.userUpdated.emit(this.user);
          this.usernameerror  = ''; 
          this.emailerror  = ''; 
          this.closeModal.emit();
          this._snackBar.open('User Changed ' ,'',{duration : 2000 , 
            horizontalPosition: 'right',
           verticalPosition: 'top',
           panelClass : ['blue-snackbar'],} );
        },
        error => {
          this.usernameerror  = ''; 
          this.emailerror  = ''; 
          this.otherErrors  = '';    
          //error in updating 
          const fault = error['error'];
          if(fault['username'])    this.usernameerror  = 'Username already exists'; 
          if(fault['email'])     this.emailerror  = 'email already exists'; 
          else this.otherErrors  = 'Some fields might be missing';             
        });
      }
      //creating a user  
    else {
      //passwords don't match
      if (this.password != this.password2) this.passworderror  = 'Passwords Don\'t Match';
      //send request
      else{
        //creating a new user 
        this.httpService.createUser(this.user,this.password)
        .subscribe(
          data => {
            this.httpService.userAdded.emit(data);
            this.usernameerror  = ''; 
            this.emailerror  = ''; 
            this.passworderror  = '';             
            this.otherErrors  = '';         
            this.closeModal.emit();
            //reset the form 
            this.user = new User();
            this.password  = '';
            this.password2  = '';
            this._snackBar.open('User Created ' ,'dismiss',{duration : 2000 , 
                   horizontalPosition: 'right',
                  verticalPosition: 'top',
                  panelClass : ['blue-snackbar'],
                } );
          },
          error => {
            this.usernameerror  = ''; 
            this.emailerror  = ''; 
            this.passworderror  = '';             
            this.otherErrors  = '';    
            //error in Creating 
            const fault = error['error'];
            console.log(fault);
            if(fault['username'])    this.usernameerror  = 'Username is not valid'; 
            if(fault['email'])     this.emailerror  = 'email is not valid'; 
            if(fault['password'])     this.passworderror  = 'This field is required';             
            else this.otherErrors  = 'Some fields might be missing';             
      
          });

      }

    }

  }

}
