import {User} from './user.model' ;
import {Project} from './project.model' ;
import {Timelog} from './Timelog.model' ;

export class Task{
    id : number ;
    name : String;
    project : Project;
    employee : User ;
    time : number;
    timelogs : Timelog[] ; 
    active : boolean;
    total : number ; 
    is_finished : boolean ; 


    constructor() {
      this.name = "";
      this.project = new Project();
      this.employee = new User() ;
      this.time = 0 ;
      this.timelogs = []; 
      this.active = false ;
      this.total = 0 ;
      this.is_finished = false ;
    }

  }


