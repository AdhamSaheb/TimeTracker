import { NewUserComponent } from './Components/users/new-user/new-user.component';
import { TokenInterceptorService } from './Services/Interceptors/TokenInterceptor.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { LoginComponent } from './Components/Auth/login/login.component';
import { ChangepasswordComponent } from './Components/Auth/changepassword/changepassword.component';
import { NotfoundComponent } from './Components/notfound/notfound.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UsersComponent } from './Components/users/users.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { DeleteUserComponent } from './Components/users/delete-user/delete-user.component';
import { ProjectsComponent } from './Components/projects/projects.component';
import { ProjectEntryComponent } from './Components/projects/project-entry/project-entry.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateProjectComponent } from './Components/projects/create-project/create-project.component';
import { ProjectEditComponent } from './Components/projects/project-edit/project-edit/project-edit.component';
import { DeleteProjectComponent } from './Components/projects/delete-project/delete-project.component';
import { CreateTaskComponent } from './Components/Tasks/create-task/create-task.component';
import { EditTaskComponent } from './Components/Tasks/edit-task/edit-task.component';
import { DeleteTaskComponent } from './Components/Tasks/delete-task/delete-task.component';

//Material 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { TimeSheetComponent } from './Components/time-sheet/time-sheet.component';
  
//PrimeNG
import {CarouselModule} from 'primeng/carousel';
import { AddTimelogComponent } from './Components/time-sheet/add-timelog/add-timelog.component';

//Pipes
import { SplitT } from './Pipes/splitT.pipe';
import { FinishTaskComponent } from './Components/time-sheet/finish-task/finish-task.component';
import { ManagerReportComponent } from './Components/manager-report/manager-report.component';
// NG/NGX
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    ChangepasswordComponent,
    NotfoundComponent,
    UsersComponent,
    NewUserComponent,
    DeleteUserComponent,
    ProjectsComponent,
    ProjectEntryComponent,
    CreateProjectComponent,
    ProjectEditComponent,
    DeleteProjectComponent,
    CreateTaskComponent,
    EditTaskComponent,
    DeleteTaskComponent,
    TimeSheetComponent,
    AddTimelogComponent,
    //pipes
    SplitT,
    FinishTaskComponent,
    ManagerReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    
    
    ReactiveFormsModule,
    BrowserAnimationsModule,
    //material
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,

    //NGX/ng
    NgxMatSelectSearchModule,
    NgbModule  ,
    ProgressbarModule.forRoot(),
    //PrimeNG
    CarouselModule,
    

  ],
 
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
