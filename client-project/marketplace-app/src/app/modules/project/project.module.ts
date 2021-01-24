import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ViewProjectsComponent } from './view-projects/view-projects.component';



@NgModule({
  declarations: [CreateProjectComponent, ViewProjectsComponent],
  imports: [
    CommonModule
  ]
})
export class ProjectModule { }
