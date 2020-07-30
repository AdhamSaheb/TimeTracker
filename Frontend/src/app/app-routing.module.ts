import { HomeComponent } from './Components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './Components/Auth/login/login.component';
import { ChangepasswordComponent } from './Components/Auth/changepassword/changepassword.component';
import { NotfoundComponent } from './Components/notfound/notfound.component';
import { UsersComponent } from './Components/users/users.component';
import { ProjectsComponent } from './Components/projects/projects.component';
import { TimeSheetComponent } from './Components/time-sheet/time-sheet.component';
import {ManagerGuardService} from './Services/Guards/manager-guard.service'
import {AdminGuardService} from './Services/Guards/admin-guard.service'
import {ManagerEmployeeGuardService} from './Services/Guards/manager-employee-guard.service'
import { ManagerReportComponent } from './Components/manager-report/manager-report.component';

const routes: Routes = [

  { path: '', component: HomeComponent, pathMatch : 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'changepassword', component: ChangepasswordComponent, },
  { path: 'users', component: UsersComponent , canActivate : [AdminGuardService] } ,
  { path: 'projects', component: ProjectsComponent , canActivate : [ManagerGuardService] } ,
  { path: 'timesheet', component: TimeSheetComponent , canActivate : [ManagerEmployeeGuardService]  } ,
  { path: 'report', component: ManagerReportComponent , canActivate : [ManagerEmployeeGuardService]  } ,
  { path: '**', component: NotfoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
