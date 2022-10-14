import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, ParamMap, Params, Router} from "@angular/router";
import {filter} from "rxjs";
import {CookieService} from "ngx-cookie-service";

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  view: string = 'default';

  constructor(private route: ActivatedRoute, private router: Router, private cookieService: CookieService) {
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
          // @ts-ignore
          this.view = params.view;
        }
      );

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      // @ts-ignore
      .subscribe((event: NavigationEnd) => {
        if (this.cookieService.check('cookieconsent_status') && this.cookieService.get('cookieconsent_status') === 'allow') {
          gtag('config', 'UA-34941429-11',
            {
              'page_path': event.urlAfterRedirects,
              'anonymize_ip': true
            }
          );
        }
      });
  }

}
