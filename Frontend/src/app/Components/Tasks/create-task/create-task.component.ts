import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

import {NgbModal,} from '@ng-bootstrap/ng-bootstrap';
import { HTTPService } from 'src/app/Services/HTTP/HTTP.service';


import { User } from 'src/app/Models/user.model';
import { Project } from 'src/app/Models/project.model';
import { Task } from 'src/app/Models/task.model';
import { ProjectsService } from 'src/app/Services/Projects/projects.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html'
})
export class CreateTaskComponent implements OnInit {
  @Output() taskAdded : EventEmitter<any>; 
  @Input() project : Project
  users : User[] = [] ; 
  task : Task ; 
  employee : number ;
  timeErrors : String = '';




  constructor(private modalService: NgbModal , private httpService : HTTPService , private projectService: ProjectsService
    , private _snackBar : MatSnackBar  , private router : Router ) {
      
    this.httpService.getUsers().subscribe((users: User[])=>{
      this.users= users ;
      //sort the users list alphabatically 
      this.users.sort((a, b) => (a.first_name > b.first_name) ? 1  : -1 )
    }) ;
    this.taskAdded  = new EventEmitter<any>() ;
 
  }

    ngOnInit(){
      this.task = new Task();
     

    }

  open(content) {
    this.modalService.open(content, { size: 'lg' , centered : true });
    //to empty fields after adding 2 in a row 
    this.task = new Task (); 

  }



  onCreateTask() {
    if(this.task.time < 1 ){
     this.timeErrors = 'Cannot be mius or 0';
    }
    else {
    this.task.project = this.project; 

    //if the user himself is adding the task, add it to the task
    if(this.router.url == '/timesheet') {
      const storage = localStorage.getItem('user');
      const user : User = JSON.parse(storage);
      this.task.employee = user ;
    }
    else {
      //if the manager is adding the employee : 
      //now I will assign the employee to the task by finidng its id in the users list , first, find the employee 
      const index = this.users.findIndex((element) => element.id == this.employee);
      this.task.employee = this.users[index];
    }

    //send the request to add the task 
    this.httpService.createTask(this.task).subscribe(
      (data: Task)=>{

        //if the user himself is adding the task, inform the component
        if(this.router.url == '/timesheet') {
          this.taskAdded.emit(this.task) ;
        }
        //give the id returned to the task 
        this.task.id = data.id ;  
        //emit the task not the data because the data doesn't have the employee and project as objects but as PKs
        this.projectService.taskAdded.emit(this.task) ;
        this._snackBar.open('Task Created ' ,'',{duration : 2000 , 
          horizontalPosition: 'right',
         verticalPosition: 'top',
         panelClass : ['blue-snackbar'],} );
        this.modalService.dismissAll();
      },
      error => {
        alert(error);
      }

    );
    }
  }




  }



