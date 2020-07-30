import { Component, Input } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Project } from 'src/app/Models/project.model';
import { Task } from 'src/app/Models/task.model';


@Component({
  selector: 'app-project-entry',
  templateUrl: './project-entry.component.html',
  styleUrls: ['./project-entry.component.css']
})
export class ProjectEntryComponent {

  @Input() project : Project;



  constructor(private modalService: NgbModal) {}


  clone(task : Task) {
    return {...task} ; 
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, {  size:'lg',windowClass: 'modal-holder'});
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getState(task : Task){
    return (task.is_finished == true) ? 'Finished' : 'Active'
  }

  getColor(task : Task) {
    return (task.is_finished == true) ? 'red' : 'green'
  }





}
