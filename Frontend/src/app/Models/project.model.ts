import {User} from './user.model' ; 
import {Task} from './task.model' ; 

export class Project{
    id:number;
    name : String;
    module : string[]; 
    estimationTime : number;
    manager : User ; 
    task_set : Task[] ; 
    //will only be used in report
    total_spent : number;

  
    constructor() {
      this.name = "";
      this.module = [];
      this.estimationTime = 0;
      this.manager = new User() ;
      this.total_spent = 0 ;
    }
    
  
  }
  
  