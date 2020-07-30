import { Injectable, EventEmitter } from '@angular/core';
import { Project } from 'src/app/Models/project.model';
import { Task } from 'src/app/Models/task.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  projectAdded : EventEmitter<any> ;
  projectUpdated : EventEmitter<any> ;
  projectDeleted : EventEmitter<any> ;

  taskAdded : EventEmitter<Task> ;
  taskUpdated: EventEmitter<Task> ; 
  taskDeleted : EventEmitter<Task> ; 

  constructor() {
    this.projectAdded = new EventEmitter<any>()
    this.projectUpdated = new EventEmitter<any>()
    this.projectDeleted = new EventEmitter<any>()


    this.taskAdded = new EventEmitter<Task>() ;
    this.taskUpdated = new EventEmitter<Task>() ;
    this.taskDeleted = new EventEmitter<Task>() ;
  }
}
