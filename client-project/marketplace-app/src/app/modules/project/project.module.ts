import { SharedModule } from './../../shared/shared.module';
import { ProjectRoutingModule } from './project-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ViewProjectsComponent } from './view-projects/view-projects.component';
import { ProjectCardComponent } from './project-card/project-card.component';
import { FinanceProjectsComponent } from './finance-projects/finance-projects.component';
import { FinanceProjectCardComponent } from './finance-project-card/finance-project-card.component';

@NgModule({
  declarations: [CreateProjectComponent, ViewProjectsComponent, ProjectCardComponent, FinanceProjectsComponent, FinanceProjectCardComponent],
  imports: [CommonModule, ProjectRoutingModule, SharedModule],
})
export class ProjectModule {}
