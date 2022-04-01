import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CountryService} from "./services/country.service";
import {FacilitiesService} from "./services/facilities.service";
import {ChartsService} from "./services/charts.service";
import {FormsModule} from "@angular/forms";
import {HighlightSearchTerm} from "./pipes/higlightsearchterm.pipe";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DataService} from "./services/data.service";
import {HttpClientModule} from "@angular/common/http";
import {NumFormatPipe} from "./pipes/num-format.pipe";
import {FloatFormatPipe} from "./pipes/float-format.pipe";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@NgModule({
  declarations: [
    AppComponent,
    HighlightSearchTerm,
    NumFormatPipe,
    FloatFormatPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    NgbModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [CountryService, FacilitiesService, ChartsService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
