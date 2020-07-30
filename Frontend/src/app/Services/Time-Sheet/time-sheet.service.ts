import { Injectable } from '@angular/core';
import { Project } from 'src/app/Models/project.model';
import { HTTPService } from '../HTTP/HTTP.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Timelog } from 'src/app/Models/Timelog.model';

@Injectable({
  providedIn: 'root'
})
export class TimeSheetService {
  hostName : String = "http://127.0.0.1:8000/" ;

  projectList : Subject<Project[]> ;
  projects : Project[] = []; 
  
  constructor(private httpService : HTTPService  ) { 
    
  }

  getProjectList() {
    this.projectList = new Subject<Project[]>();
    this.httpService.getProjects().subscribe((projects : Project[])=> {
      this.projects = projects ; 
      this.projectList.next(this.projects); 
    });
    return this.projectList.asObservable();
  }









}
