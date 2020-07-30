import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {TimeSheetService} from './../../Services/time-sheet/time-sheet.service';
import { Project } from 'src/app/Models/project.model';
import { Task } from 'src/app/Models/task.model';
import { User } from 'src/app/Models/user.model';
import { HTTPService } from 'src/app/Services/HTTP/HTTP.service';
import { Timelog } from 'src/app/Models/Timelog.model';
import { CommentStmt } from '@angular/compiler';
import { takeLast } from 'rxjs/operators';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-time-sheet',
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TimeSheetComponent implements OnInit {
  //for the corousel
  responsiveOptions;
  //the projects the employee participates in
  projects : Project[] ;
  //the tasks that the employee participates in
  tasks : Task[] = []; 
  //the employee himself
  employee : User ;
  //list of time logs to be shows in the table
  timeLogs : Timelog[] = [] ;
  //the cuurenlty active task
  activeLog : Timelog;
  //filter Date
  filterDate : string = ''; 
  formDate : string = ''; 
  activeTaskName : String = '';
  showTasks = true ; 
  showProjects = false;

  projectColor = 'rgb(41, 103, 128)'
  taskColor = 'rgb(81, 145, 170)'
  constructor( private timeSheetService : TimeSheetService , private httpService : HTTPService , private calendar : NgbCalendar    ) {
    //get the projects of the current employee
    this.timeSheetService.getProjectList().subscribe((projects : Project[])=>{
    
      this.projects = projects ; 
      //filter the tasks of the employee out of his projects
 
      this.projects.forEach((project)=>{
        for (var i=0;i<project.task_set.length;i++) {
          if(project.task_set[i].employee.id == this.employee.id  && project.task_set[i].is_finished == false){
            //since the task has the project by id only, i will switch it to the object of it
            var temp : Task = project.task_set[i]
            temp.project = project; 
            // add the active one to the beginning 
            if (temp.active)
            {   this.tasks.unshift(temp);
               this.activeTaskName = temp.name;
            }
            else this.tasks.push(temp);
          }

        }

      });
      //getting all the timelog list of the current employee
    });
    //get the current logged in employee
    const storage = localStorage.getItem('user');
    const user : User = JSON.parse(storage);
    this.employee= user ; 

    //as long as this is null, there is no active task
    this.activeLog = null ; 
   }

  ngOnInit(): void {
    //start with the timelogs of today 

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

    this.filterDate = yyyy + '-' + mm + '-' + dd;
    //I will get all the time logs now, later, I will implement a fuction that will update the timelogs based on the filtering 
    this.httpService.getTimeLogs(this.filterDate).subscribe((timelogs : Timelog[])=> {
      this.timeLogs = timelogs; 
    });

    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
    ];
  }

  selectToday() {
      var date  = new Date();   
      
      //construct the date from the date read from the date picker
      this.filterDate = date.getFullYear()  +'-'+ date.getMonth() + '-' + date.getDate() ;
      
       //request timeLogs 
         this.httpService.getTimeLogs(this.filterDate).subscribe((timelogs : Timelog[])=> {
           this.timeLogs = timelogs; 
         });

  }

  
  stop(task: Task){
    task.active = false; 
    this.httpService.stopTimeLog(task);
    this.activeTaskName = ''
  }

   start (task : Task){
    for (let task of this.tasks) { 
      task.active = false;
      for (let log of task.timelogs) {
        if (!log.endTime) {
          const date = new Date();
          log.endTime = date.toISOString();
        }
      }
    }
    task.active = true;
    this.httpService.startTimeLog(task);
    this.activeTaskName = task.name
    //after its started, we'll store the active log in order to stop it by id later (in the http service )
    //I added the timelog to the beginning in the service 

}

  filterResults() {
   //construct the date from the date read from the date picker
    this.filterDate = this.formDate['year'] +'-'+ this.formDate['month']+ '-' + this.formDate['day'];

    //request timeLogs 
      this.httpService.getTimeLogs(this.filterDate).subscribe((timelogs : Timelog[])=> {
        this.timeLogs = timelogs; 
      });
  }

  onFinishTask(task : Task) {
    const index = this.tasks.findIndex((element)=> element.id == task.id);
    this.tasks.splice(index , 1);
    this.stop(task);
  }

  onshowTasks() {

    this.showTasks = true; 
    this.showProjects = false ;
    this.projectColor = 'rgb(41, 103, 128)'
    this.taskColor = 'rgb(81, 145, 170)'
  
  }

  
  onshowProjects() {

    this.showTasks = false; 
    this.showProjects = true ;
    this.projectColor =  'rgb(81, 145, 170)'
    this.taskColor ='rgb(41, 103, 128)'
  }
  

  appendTask(task : Task ) {
    this.tasks.unshift(task);
    this.onshowTasks();
  }

  getColor(task : Task) {
    return task.active == true ? 'green' : 'grey' 

  }


}

