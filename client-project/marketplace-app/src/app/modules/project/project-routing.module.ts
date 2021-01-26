import { CreateProjectComponent } from './create-project/create-project.component';
import { ViewProjectsComponent } from './view-projects/view-projects.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FinanceProjectsComponent } from './finance-projects/finance-projects.component';

const routes: Routes = [
  {
    path: 'projects',
    component: ViewProjectsComponent,
  },
  {
    path: 'create-project',
    component: CreateProjectComponent,
  },
  {
    path: 'finance-projects',
    component: FinanceProjectsComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ProjectRoutingModule {}
