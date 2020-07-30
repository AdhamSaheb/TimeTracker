import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/Models/user.model';
import { HTTPService } from 'src/app/Services/HTTP/HTTP.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {

  @Input() user : User = new User () ; 

  constructor(private httpService : HTTPService , private router : Router , private _snackBar : MatSnackBar) { }

  ngOnInit(): void {
  }

  onConfirmDelete() {
    this.httpService.deleteUser(this.user).subscribe(
      ()=> {
        this.httpService.userDeleted.emit( this.user );
        this._snackBar.open('User Deleted ' ,'',{duration : 2000 , 
          horizontalPosition: 'right',
         verticalPosition: 'top',
         panelClass : ['red-snackbar'],} );
      }
    )

 
    
  }

}
