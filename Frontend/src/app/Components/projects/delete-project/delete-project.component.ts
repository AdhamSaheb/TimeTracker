import {Component, Input} from '@angular/core';

import {NgbModal, NgbActiveModal,} from '@ng-bootstrap/ng-bootstrap';
import { HTTPService } from 'src/app/Services/HTTP/HTTP.service';
import { ProjectsService } from 'src/app/Services/Projects/projects.service';
import { Project } from 'src/app/Models/project.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-project',
  templateUrl: './delete-project.component.html'
})
export class DeleteProjectComponent {

  @Input() project : Project ;
  constructor(private modalService: NgbModal , private httpService : HTTPService ,private projectService: ProjectsService 
    ,private _snackBar : MatSnackBar) {

  }

  open(content) {
      this.modalService.open(content, { size: 'lg' , centered  : true });
  }

  onDelete(project : Project) {
    this.httpService.deleteProject(this.project).subscribe(

      (data)=> {
        this._snackBar.open('Project Deleted ' ,'',{duration : 2000 , 
          horizontalPosition: 'right',
         verticalPosition: 'top',
         panelClass : ['red-snackbar'],} );
      
        this.projectService.projectDeleted.emit(project);
        this.modalService.dismissAll();
          console.log(this.project);
      },
      (error) => {
        alert('Deletion was not Successful');
        console.log(error);
      }
    );

  }



}
