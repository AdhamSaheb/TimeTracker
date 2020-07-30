import {Component, Input, OnInit, NgModule, Output, EventEmitter} from '@angular/core';

import {NgbModal,} from '@ng-bootstrap/ng-bootstrap';
import { HTTPService } from 'src/app/Services/HTTP/HTTP.service';



import { Task } from 'src/app/Models/task.model';

import { MatSnackBar } from '@angular/material/snack-bar';




@Component({
  selector: 'app-finish-task',
  templateUrl: './finish-task.component.html'
})
export class FinishTaskComponent implements OnInit {


  @Input() task : Task ; 
  @Output() taskFinished : EventEmitter<any> ;
  

  constructor(private modalService: NgbModal , private httpService : HTTPService , 
    private _snackBar : MatSnackBar , ) {
      this.taskFinished = new EventEmitter<any>();
  }

    ngOnInit(){
      
    }



  open(content) {
    this.modalService.open(content, { size: 'lg' ,centered : true  });
  }

  finish(task : Task) {
    
    this.httpService.finishTask(task).subscribe((data)=> {
    this._snackBar.open( this.task.name + '  is now marked as Finised ' ,'',{duration : 2000 , 
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass : ['red-snackbar'],} );
      this.taskFinished.emit();
      this.modalService.dismissAll(); 

    },
    (error)=> {
      this._snackBar.open('Not Successful' ,'',{duration : 2000 , 
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass : ['error-snackbar'],} );
    });
  

  }
}