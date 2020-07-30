import { Component, Input, OnInit } from '@angular/core';

import { NgbModal, NgbDateStruct, NgbCalendar, } from '@ng-bootstrap/ng-bootstrap';
import { HTTPService } from 'src/app/Services/HTTP/HTTP.service';



import { MatSnackBar } from '@angular/material/snack-bar';
import { Task } from 'src/app/Models/task.model';
import { Timelog } from 'src/app/Models/Timelog.model';
import { TimeSheetService } from 'src/app/Services/time-sheet/time-sheet.service';

@Component({
  selector: 'app-add-timelog',
  templateUrl: './add-timelog.component.html',
  styleUrls: ['./add-timelog.component.css']
})
export class AddTimelogComponent implements OnInit {
  @Input() tasks: Task[];
  timeLog: Timelog;

  //to be read from the form 
  startTime = { hour: 13, minute: 30 };
  endTime = { hour: 13, minute: 30 };
  date: NgbDateStruct;
  task: Task;
  timeErrors = '';

  constructor(private modalService: NgbModal, private httpService: HTTPService, private _snackBar: MatSnackBar
    , private calendar: NgbCalendar) {

  }

  ngOnInit() {
    this.timeLog = new Timelog();
    this.task = new Task();

  }

  open(content) {
    this.modalService.open(content, { size: 'lg', centered: true });
    //to empty fields after adding 2 in a row 
    this.timeLog = new Timelog();

  }





  selectToday() {
    this.date = this.calendar.getToday();

  }

  validateTime() {

    if (this.startTime.hour > this.endTime.hour) {
      this.timeErrors = 'Start Time cannot be after End Time'
      return false;
    }


    if (this.startTime.hour == this.endTime.hour && this.startTime.minute > this.endTime.minute) {
      this.timeErrors = 'Start Time cannot be after End Time'
      return false;
    }


    return true;
  }

  onConfirm() {

    if (this.validateTime()) {
      //convert date to a js date 
      var jsDate = new Date(this.date.year, this.date.month - 1, this.date.day+1);
      var today = jsDate.toISOString();
      //trim and take the first part of it 
      var result = today.split('T');
      //today contains the first half of the needed strings
      today = result[0];
      //create start and end time of the object to be created 
      this.timeLog.startTime = today + "T" + this.startTime.hour + ":" + this.startTime.minute;
      this.timeLog.endTime = today + "T" + this.endTime.hour + ":" + this.endTime.minute;
      // console.log(this.timeLog.startTime,this.timeLog.endTime);
      //asssign the task to the timelog
      var taskIndex = this.tasks.find((element: Task) => element.id == this.task.id);
      this.timeLog.task = taskIndex;

      //Now you need to send the request with the task id instead of the task and inform the other components of the change
      this.httpService.addTimeLog(this.timeLog);

    }

  }

}



