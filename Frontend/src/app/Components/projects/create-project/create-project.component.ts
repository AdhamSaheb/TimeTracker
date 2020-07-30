import {Component} from '@angular/core';

import {NgbModal,} from '@ng-bootstrap/ng-bootstrap';
import { HTTPService } from 'src/app/Services/HTTP/HTTP.service';
import { ProjectsService } from 'src/app/Services/Projects/projects.service';
import { Module } from 'src/app/Models/module.model';
import { Project } from 'src/app/Models/project.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html'
})
export class CreateProjectComponent  {

  project : Project ;
  modules : Module[] = [] ;
  modulesVals : any = {}
  nameErrors='';
  timeErrors='';
  moduleErrors ='' ;

  constructor(private modalService: NgbModal , private httpService : HTTPService ,private projectService: ProjectsService ,
    private _snackBar : MatSnackBar) {
    this.httpService.getModules().subscribe((modules)=> {
      this.modules= modules;
    }) ;
  }


  open(content) {
      this.modalService.open(content, { size: 'lg' , centered : true });
      this.project = new Project() ;
  }

  formValid() {
      var timeValid : boolean= true;
      var nameValid : boolean= true;
      var modulesValid : boolean = true ;
      if (this.project.module.length == 0 ) {
        this.moduleErrors="Must select 1 module at least "
        modulesValid = false ;
      }
      else this.moduleErrors=''
      if(this.project.name == '' ) {
        this.nameErrors= 'Name is Required' ;
      nameValid=false;
      }
      else this.nameErrors=''
      if(this.project.estimationTime < 1  ) {

        this.timeErrors= 'Time Cannot be 0 or minus' ;
        timeValid=false;
      }
      else this.timeErrors=''
    return (timeValid && nameValid && modulesValid);
  }
  onCreate() {


    // add modules to project
    for (let key in this.modulesVals) {
      this.project.module.push(key);
    }
    //set manager
    var storage = localStorage.getItem('user');
    const user = JSON.parse(storage);
    this.project.manager=user ;
    //create if valid
    if(this.formValid()) {
      this.httpService.createProject(this.project).subscribe(
        (data : Project) => {
          this.nameErrors= '';
          this.timeErrors = '';
          this.moduleErrors= '';
          this.modalService.dismissAll();
          this._snackBar.open('Project Created ' ,'',{duration : 2000 , 
            horizontalPosition: 'right',
           verticalPosition: 'top',
           panelClass : ['blue-snackbar'],} );

          //I have to emit the project not the data returned, because data has the manager by id and I need it as an object,
          // ill give it the ID of the data since we dont have it ATM
          this.project.id= data.id; 
          this.project.manager;
          this.project.task_set = [] ;
          //tell the projects component that the data has changed, 
          this.projectService.projectAdded.emit(this.project) ;
        },
        error => {
          console.log(error);
        });
    }
  }



}
