import {User} from './user.model' ;
import {Project} from './project.model' ;
import { Task } from './task.model';

export class Timelog{
    task : Task ;
    startTime :  string ;  
    endTime : string ; 
    id : number ;

    constructor() {
        
        this.task = new Task( ); 
        this.startTime = ''; 
        this.endTime = ''; 
    }

  }


