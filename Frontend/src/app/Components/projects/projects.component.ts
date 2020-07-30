import { User } from './../../Models/user.model';
import { Component, OnInit } from '@angular/core';
import { HTTPService } from 'src/app/Services/HTTP/HTTP.service';
import { Project } from 'src/app/Models/project.model';
import { ProjectsService } from 'src/app/Services/Projects/projects.service';
import { Task } from 'src/app/Models/task.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],

  
})
export class ProjectsComponent implements OnInit {
  projects : Project[] ;
  constructor(private httpService : HTTPService , private projectService : ProjectsService) {
    this.httpService.getProjects().subscribe((projects) => {
      this.projects = projects ;
    });

    this.projectService.projectAdded.subscribe((project)=> {
      //unshift to add to the beginning
      this.projects.unshift(project);
    });

    this.projectService.projectUpdated.subscribe((project : Project)=> {
      const index = this.projects.findIndex((element) => element.id == project.id);
      // I have to keep the projects manager name because it will come back from the response as id
      const tempManager  : User = this.projects[index].manager;
      this.projects[index] = {...project};
      this.projects[index].manager = tempManager;


    });
    this.projectService.projectDeleted.subscribe((project)=> {
      const index = this.projects.findIndex((element) => element.id == project.id);
      //delete from list to update it
      this.projects.splice(index,1);

    });

    //react on task added
    this.projectService.taskAdded.subscribe((task :Task)=> {
      // find the project and add the list to it 
      const index = this.projects.findIndex((element) => element.id == task.project.id);
      //unshift to tadd the beginning
      this.projects[index].task_set.unshift(task);
  
    });

    //react on task edited
    this.projectService.taskUpdated.subscribe((task :Task)=> {
      // find the project and add the list to it 
      const index = this.projects.findIndex((element) => element.id == task.project.id);
      const taskIndex = this.projects[index].task_set.findIndex((element)=> element.id == task.id );
      this.projects[index].task_set[taskIndex]=task ; 
    });

    //react on task deleted
    this.projectService.taskDeleted.subscribe((data)=> {
      // find the project and add the list to it 
      const index = this.projects.findIndex((element) => element.id == data.project.id);
      const taskIndex = this.projects[index].task_set.findIndex((element)=> element.id == data.id );
      console.log(index,taskIndex)
      this.projects[index].task_set.splice(taskIndex,1);
    });

   }

  ngOnInit(): void {

  }

  clone(project : Project) {

    return {...project} ;
  }


}
