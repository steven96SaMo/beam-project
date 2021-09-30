import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './view/create/create.component';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import { HomeComponent } from './view/home/home.component';
import { UpdateComponent } from './view/update/update.component';
import { ViewEmployeeComponent } from './view/view-employee/view-employee.component';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    children: [
      {
        path: "",
        component: DashboardComponent
      },
      {
        path: "create",
        component: CreateComponent
      },
      {
        path: "update/:id",
        component: UpdateComponent
      },
      {
        path: "view-employee/:id",
        component: ViewEmployeeComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
