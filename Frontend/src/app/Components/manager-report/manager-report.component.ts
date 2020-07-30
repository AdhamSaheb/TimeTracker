import { Component, OnInit } from '@angular/core';
import * as CanvasJS from '../../../assets/canvasjs.min'
import { TimeSheetService } from 'src/app/Services/time-sheet/time-sheet.service';
import { Project } from 'src/app/Models/project.model';
@Component({
  selector: 'app-manager-report',
  templateUrl: './manager-report.component.html',
  styleUrls: ['./manager-report.component.css']
})
export class ManagerReportComponent implements OnInit {

  projects : Project[] = [] ; 
  chart ; 

  constructor( private timesheetService : TimeSheetService) {

    this.timesheetService.getProjectList().subscribe((projects : Project[])=> {
      this.projects = projects;
      for (let project of projects) {
        project.total_spent = 0 ;
        for (let task of project.task_set) {
           project.total_spent += task.total ;
        }
      }
    });

   }

  ngOnInit(): void {

      this.chart = new CanvasJS.Chart("chartContainer", {
      theme: "light2",
      animationEnabled: true,
      exportEnabled: true,
      title:{
        text: "Monthly Expense"
      },
      data: [{
        type: "pie",
        showInLegend: true,
        toolTipContent: "<b>{name}</b>: ${y} (#percent%)",
        indexLabel: "{name} - #percent%",
        dataPoints: [
          { y: 450, name: "Food" },
          { y: 120, name: "Insurance" },
          { y: 300, name: "Traveling" },
          { y: 800, name: "Housing" },
          { y: 150, name: "Education" },
          { y: 150, name: "Shopping"},
          { y: 250, name: "Others" }
        ]
      }]
    });
      
    // this.chart.render();


    }

    changeData(project : Project) {

      var dataPoints = [] ; 
      for (let task of project.task_set) {
        dataPoints.push ( {y : task.time , name : task.name , employee : task.employee.first_name + ' '+task.employee.last_name}) ;  
      }
      this.chart = new CanvasJS.Chart("chartContainer", {
        theme: "light1",
        animationEnabled: true,
        exportEnabled: true,
        title:{
          text: project.name + " - Tasks"
        },
        data: [{
          type: "pie",
          showInLegend: true,
          toolTipContent: "<b>{name}</b>: {y} Hours (#percent%) - {employee}",
          indexLabel: "{name} - #percent%",

          dataPoints: dataPoints
        }
      
      ]
      });
        
      this.chart.render();
  
    }




}


