import {Component, Input, OnInit} from '@angular/core';

import {NgbModal,} from '@ng-bootstrap/ng-bootstrap';
import { HTTPService } from 'src/app/Services/HTTP/HTTP.service';


import { User } from 'src/app/Models/user.model';
import { Project } from 'src/app/Models/project.model';
import { Task } from 'src/app/Models/task.model';
import { ProjectsService } from 'src/app/Services/Projects/projects.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html'
})
export class EditTaskComponent implements OnInit {

  @Input() project : Project ; 
  @Input() task : Task ; 
  users : User[] = [] ; 
  timeErrors : String = '' ;

  constructor(private modalService: NgbModal , private httpService : HTTPService , private projectService: ProjectsService ,
    private _snackBar: MatSnackBar ) {
    this.httpService.getUsers().subscribe((users: User[])=>{
      this.users= users ; 
    }) ;
 
  }

    ngOnInit(){
      
    }



  open(content) {
    this.modalService.dismissAll()
    this.modalService.open(content, { size: 'lg' , centered : true });

  }

  onUpdateTask() {
    if(this.task.time < 1) {
      this.timeErrors = 'Cannot be 0 or minus';
    }
    else {
    this.task.project = this.project;
    //now I will assign the employee to the task by finidng its id in the users list , first, find the employee 
    const index = this.users.findIndex((element) => element.id == this.task.employee.id);
    this.task.employee = this.users[index];
    //send the request to add the task 
    this.httpService.updateTask(this.task).subscribe(
      (data: Task)=>{
        //give the id returned to the task 
        this.task.id = data.id ;  
        //emit the task not the data because the data doesn't have the employee and project as objects but as PKs
        this.projectService.taskUpdated.emit(this.task) ;
        this._snackBar.open('Task Updated ' ,'',{duration : 2000 , 
          horizontalPosition: 'right',
         verticalPosition: 'top',
         panelClass : ['blue-snackbar'],} );
        this.modalService.dismissAll();
      },
      error => {
        console.log(error);
      }

    );
    }
  }




  }



