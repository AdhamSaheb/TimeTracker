import { User } from './../../Models/user.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Project } from 'src/app/Models/project.model';
import { Module } from 'src/app/Models/module.model';
import { Task } from 'src/app/Models/task.model';
import { Timelog } from 'src/app/Models/Timelog.model';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { elementAt, filter } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class HTTPService {
  hostName : String = "http://127.0.0.1:8000/" ;
  userDeleted : EventEmitter<User>;
  userAdded : EventEmitter<User>;
  userUpdated : EventEmitter<User>;

  //subject for timelogs
  timeLogs : Subject<Timelog[]> ;
  //list of timelogs
  timeloglist : Timelog[] = [] ;

  
constructor(private httpClient : HttpClient , private _snackBar:MatSnackBar ,private modalService: NgbModal) {

  this.userAdded = new EventEmitter<User>()
  this.userDeleted = new EventEmitter<User>();
  this.userUpdated = new EventEmitter<User>();
  this.timeLogs = new Subject<Timelog[]>();



 }



// Users Related Queries------------------------------------------------------------------------------>

  getUsers() {
    return this.httpClient.get<User[]>( this.hostName+'timetracker/api/users');
  }

  deleteUser(user : User) {

    return this.httpClient.delete(this.hostName+'timetracker/api/users/'+user.id );
  }

  updateUser(user : User) {
    var formData: any = new FormData();
    formData.append("username",user.username);
    formData.append("email",user.email);
    formData.append("roles",user.roles);
    formData.append("first_name",user.first_name);
    formData.append("last_name",user.last_name);
    return this.httpClient.put(this.hostName+'timetracker/api/users/'+user.id , formData);

  }


  createUser(user : User , password : String) {
    var formData: any = new FormData();
    formData.append("username",user.username);
    formData.append("email",user.email);
    formData.append("roles",user.roles);
    formData.append("first_name",user.first_name);
    formData.append("last_name",user.last_name);
    formData.append("password",password);
    return this.httpClient.post<User>(this.hostName+'timetracker/api/register', formData);

  }
// <------------------------------------------------------------------------------------------------------->
// Project Related Queries------------------------------------------------------------------------------>

getProjects() {
  return this.httpClient.get<Project[]>(this.hostName+'timetracker/api/projects');
}

getModules() {
  return this.httpClient.get<Module[]>(this.hostName+'timetracker/api/modules/');
}

createProject(project : Project ) {

  var formData: any = new FormData();
  formData.append("name",project.name);
  formData.append("estimationTime",project.estimationTime);
  formData.append("module",project.module);
  formData.append("manager", <number>project.manager.id);

  return this.httpClient.post(this.hostName+'timetracker/api/projects/create',formData);
}


updateProject(project : Project ) {
  var formData: any = new FormData();
  formData.append("name",project.name);
  formData.append("id",project.id);
  formData.append("estimationTime",project.estimationTime);
  formData.append("module",project.module);
  formData.append("manager", <number>project.manager.id);

  return this.httpClient.put(this.hostName+'timetracker/api/project/' + project.id ,formData);
}

deleteProject(project : Project ) {

  return this.httpClient.delete(this.hostName+'timetracker/api/project/' + project.id);
}
// <------------------------------------------------------------------------------------------------------->
// Tasks
// <------------------------------------------------------------------------------------------------------->

  createTask(task : Task) {
    var formData: any = new FormData();
    formData.append("name",task.name);
    formData.append("time",task.time);
    formData.append("employee",task.employee.id);
    formData.append("project",task.project.id);
 
    return this.httpClient.post<Task>(this.hostName+'timetracker/api/tasks/create',formData); 
  }
  updateTask(task : Task) {
    var formData: any = new FormData();
    formData.append("name",task.name);
    formData.append("time",task.time);
    formData.append("employee",task.employee.id);
    formData.append("project", <number>task.project.id);
    formData.append("timelogs",task.timelogs);
    
    return this.httpClient.put<Task>(this.hostName+'timetracker/api/task/'+task.id,formData); 
  }
  
  deleteTask(task : Task) {
    return this.httpClient.delete(this.hostName+'timetracker/api/task/'+task.id); 
  }

  finishTask(task : Task){
    var formData : any = new FormData() ;
    return this.httpClient.put(this.hostName+'timetracker/api/tasks/'+task.id + '/finish',formData); 
  }
  
  // <------------------------------------------------------------------------------------------------------->
  //Time-logs
  getTimeLogs( filterDate : string) {
   
    const data = {"date": filterDate};

    this.httpClient.get<Timelog[]>(this.hostName+'timetracker/api/timelogs' , {params : data} ).subscribe( (timeLogs : Timelog[]) => {
      this.timeLogs.next(timeLogs);
      this.timeloglist = timeLogs ;
    }, 
    (error)=> console.log(error)
    );
    return this.timeLogs.asObservable();
  }

  
  addTimeLog(timeLog : Timelog) {
    console.log(timeLog);
    var formData: any = new FormData();
    formData.append("task",timeLog.task.id);
    formData.append("startTime",timeLog.startTime);
    formData.append("endTime",timeLog.endTime);

    
    this.httpClient.post<Timelog>(this.hostName+'timetracker/api/timelogs/create' ,formData).subscribe((response: Timelog)=>{
      timeLog.id= response.id ;
      //add it to the list and send it to the subject to that it refreshes
      this.timeloglist.unshift(timeLog);
      this.timeLogs.next(this.timeloglist);
      this._snackBar.open('Timelog Added ' ,'',{duration : 2000 , 
        horizontalPosition: 'right',
       verticalPosition: 'top',
       panelClass : ['blue-snackbar'],} );
        this.modalService.dismissAll();
    },
    (error)=> {
      console.log(error);
      this._snackBar.open('Not Successful ' ,'',{duration : 2000 , 
        horizontalPosition: 'right',
       verticalPosition: 'top',
       panelClass : ['error-snackbar'],} );
    });

  }


  startTimeLog(task : Task) {

    var formData: any = new FormData();
    formData.append("task_id",task.id);

 
    this.httpClient.post<Timelog>(this.hostName+'timetracker/api/timelogs/start' ,formData).subscribe((timeLog: Timelog)=>{
      task.timelogs.unshift(timeLog);
      this.timeloglist.unshift(timeLog);
      this.timeLogs.next(this.timeloglist);
      this._snackBar.open('Timelog Started ' ,'',{duration : 2000 , 
        horizontalPosition: 'right',
       verticalPosition: 'top',
       panelClass : ['blue-snackbar'],} );
       
    },
    (error)=> {
      this._snackBar.open('Not Successful ' ,'',{duration : 2000 , 
        horizontalPosition: 'right',
       verticalPosition: 'top',
       panelClass : ['error-snackbar'],} );
       console.log(error)
    });
  }


  stopTimeLog(task : Task){
    
    //find the active log 
    var activeLog : Timelog  ;
    for(let log of task.timelogs) {
      if( log.endTime == null || log.endTime == '') {
        activeLog = log ; 
        break ;
      }
    }
        
    const body = new FormData();
    var formData: any = new FormData();

    this.httpClient.put<Timelog>(this.hostName+'timetracker/api/timelogs/'+ activeLog.id+'/stop', body).subscribe((timeLog: Timelog)=>{
      
      //update the timeLog instance in the list 
      var index = this.timeloglist.findIndex( element => element.id == timeLog.id);
      
      this.timeloglist[index].endTime = timeLog.endTime;
      this.timeLogs.next(this.timeloglist);

      //remove the active log
      this._snackBar.open('Timelog Stopped' ,'',{duration : 2000 , 
        horizontalPosition: 'right',
       verticalPosition: 'top',
       panelClass : ['blue-snackbar'],} );
       
    },
    (error)=> {
      this._snackBar.open('Not Successful' ,'',{duration : 2000 , 
        horizontalPosition: 'right',
       verticalPosition: 'top',
       panelClass : ['error-snackbar'],} );
       console.log(error)
    });
  }


  }

  



