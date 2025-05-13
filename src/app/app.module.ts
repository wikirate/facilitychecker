import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CountryService} from "./services/country.service";
import {FacilitiesService} from "./services/facilities.service";
import {ChartsService} from "./services/charts.service";
import {FormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DataService} from "./services/data.service";
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {NumFormatPipe} from "./pipes/num-format.pipe";
import {FloatFormatPipe} from "./pipes/float-format.pipe";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {BrandsService} from "./services/brands.service";
import {ArrayFormatPipe} from "./pipes/array-format.pipe";
import {HeaderComponent} from "./header/header.component";
import {WidgetComponent} from './widget/widget.component';
import {AboutComponent} from './about/about.component';
import {FooterComponent} from './footer/footer.component';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {provideMarkdown} from 'ngx-markdown';
import {BrowserModule} from '@angular/platform-browser';

@NgModule({ declarations: [
        AppComponent,
        HeaderComponent,
        NumFormatPipe,
        FloatFormatPipe,
        ArrayFormatPipe,
        WidgetComponent,
        AboutComponent,
        FooterComponent
    ],
    bootstrap: [AppComponent], imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        NgbModule,
        FontAwesomeModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient]
            }
        })], providers: [CountryService, FacilitiesService, ChartsService, DataService, BrandsService, provideHttpClient(withInterceptorsFromDi()), provideMarkdown()] })
export class AppModule {
}

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
