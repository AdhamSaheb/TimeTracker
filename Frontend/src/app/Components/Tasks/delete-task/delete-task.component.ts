import {Component, Input, OnInit, NgModule} from '@angular/core';

import {NgbModal, NgbActiveModal, NgbModule,} from '@ng-bootstrap/ng-bootstrap';
import { HTTPService } from 'src/app/Services/HTTP/HTTP.service';


import { User } from 'src/app/Models/user.model';
import { Task } from 'src/app/Models/task.model';
import { ProjectsService } from 'src/app/Services/Projects/projects.service';
import { MatSnackBar } from '@angular/material/snack-bar';




@Component({
  selector: 'app-delete-task',
  templateUrl: './delete-task.component.html'
})
export class DeleteTaskComponent implements OnInit {


  @Input() task : Task ; 
  
  

  constructor(private modalService: NgbModal , private httpService : HTTPService , private projectService: ProjectsService
    , private _snackBar : MatSnackBar , ) {
    this.httpService.getUsers().subscribe((users: User[])=>{

    }) ;
 
  }

    ngOnInit(){
      
    }



  open(content) {
    this.modalService.open(content, { size: 'lg'  });

  }

  onDeleteTask() {
    
    this.httpService.deleteTask(this.task).subscribe(
      (data)=> {
        this._snackBar.open( this.task.name + ' was Deleted ' ,'',{duration : 2000 , 
          horizontalPosition: 'right',
         verticalPosition: 'top',
         panelClass : ['red-snackbar'],} );
        this.projectService.taskDeleted.emit(this.task);
        this.modalService.dismissAll()

      },
      (error) => {
        alert('Deletion was not Successful');
        console.log(error);
      }
    );

  
  }
}