import { Component, OnInit, Input } from '@angular/core';
import { Project } from 'src/app/Models/project.model';
import { Module } from 'src/app/Models/module.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HTTPService } from 'src/app/Services/HTTP/HTTP.service';
import { ProjectsService } from 'src/app/Services/Projects/projects.service';
import { ThrowStmt } from '@angular/compiler';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css']
})
export class ProjectEditComponent implements OnInit {


  @Input() project : Project  ;
  selectedProject : Project;
  modules : Module[] = [] ;
  modulesVals : any = {}
  nameErrors='';
  timeErrors='';
  moduleErrors ='' ;

  constructor(private modalService: NgbModal , private httpService : HTTPService ,private projectService: ProjectsService,
    private _snackBar : MatSnackBar ) {
    this.httpService.getModules().subscribe((modules)=> {
      this.modules= modules;
    }) ;

  }
  ngOnInit(): void {
    this.selectedProject = this.project;
  }

  open(content) {
      this.modalService.open(content, { size: 'lg' , centered : true });

      for (var i in this.selectedProject.module) {
        var moduleName = this.selectedProject.module[i] ;
        this.modulesVals[<string>moduleName] = true ;
      }
      // console.log(this.modulesVals);

  }



  formValid() {
      var timeValid : boolean= true;
      var nameValid : boolean= true;
      var modulesValid : boolean = true ;
      var keys=false ;
      //check if there is at least one true module selected
      for (var key in this.modulesVals) {
        if (this.modulesVals[key]==true) {
          keys = true;
        }
      }
      if (this.project.module.length == 0 || !keys) {
        this.moduleErrors="Must select 1 module at least "
        modulesValid = false ;
      }
      else this.moduleErrors=''
      if(this.project.name == '' ) {
        this.nameErrors= 'Name is Required' ;
      nameValid=false;
      }
      else this.nameErrors=''
      if(this.project.estimationTime < 1 ) {
        
        this.timeErrors= 'Time Cannot be 0 or minus' ;
        timeValid=false;
      }
      else this.timeErrors=''
    return (timeValid && nameValid && modulesValid);
  }
  onUpdate() {

    // add modules to the project
    var modules : String[] = [] ;
    this.selectedProject.module = [] ; 
    for (var key in this.modulesVals ) {
      if (this.modulesVals[key]==true ) this.selectedProject.module.push(key) ;
    }
   

    // edit if valid
    if(this.formValid()) {
      this.httpService.updateProject(this.selectedProject).subscribe(
        data => {
          this.nameErrors= '';
          this.timeErrors = '';
          this.moduleErrors= '';
          this.modalService.dismissAll();
          this._snackBar.open('Project Updated ' ,'',{duration : 2000 , 
            horizontalPosition: 'right',
           verticalPosition: 'top',
           panelClass : ['blue-snackbar'],} );
          //tell the projects component that the data has changed
          this.projectService.projectUpdated.emit(this.selectedProject) ;

        },
        error => {
          if (error.status == 500) this.timeErrors = 'Cannot be minus' // this is when a minus value is entered
        });
    }
   }



}
