import {Component, DoCheck, OnChanges, OnInit, ViewChild} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {interval, Observable} from "rxjs";

declare let gtag: Function;

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentComponent implements OnInit {

  cookie_consent: boolean = false;

  constructor(private cookieService: CookieService, private router: Router) {
    this.cookie_consent = cookieService.check('cookieconsent_status')
  }

  ngOnInit(): void {
    interval(1000)
      .subscribe(() => {
        if (!this.cookieService.check('cookieconsent_status')) {
          this.onClear()
        }
      });
  }


  onAccept() {
    this.cookieService.set('cookieconsent_status', 'allow', {expires: 365, path: '/', domain: 'localhost'})
    gtag('consent', 'update', {
      'ad_storage': 'granted',
      'analytics_storage': 'granted'
    })
    this.cookie_consent = true
  }

  onDecline() {
    gtag('consent', 'update', {
      'ad_storage': 'denied',
      'analytics_storage': 'denied'
    })
    this.cookieService.deleteAll('/', 'localhost')
    this.cookieService.set('cookieconsent_status', 'deny', {expires: 365, path: '/', domain: 'localhost'})
    this.cookie_consent = true
  }

  onClear() {
    gtag('consent', 'update', {
      'ad_storage': 'denied',
      'analytics_storage': 'denied'
    })
    this.cookie_consent = false
  }
}
