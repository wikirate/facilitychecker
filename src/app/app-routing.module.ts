import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WidgetComponent} from "./widget/widget.component";
import {AboutComponent} from "./about/about.component";
import {LocationStrategy, PathLocationStrategy} from "@angular/common";

const routes: Routes = [
  {
    path: 'home', component: WidgetComponent,
  },
  {path: 'about', component: AboutComponent},
  {path: '**', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [{provide: LocationStrategy, useClass: PathLocationStrategy}],
  exports: [RouterModule]
})
export class AppRoutingModule { }
