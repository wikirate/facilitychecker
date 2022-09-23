import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    // @ts-ignore
    document.getElementById("offcanvasBottom").addEventListener('hidePrevented.bs.offcanvas', function (e) {
      console.log("Hello hidePrevented.bs.offcanvas")
    })
    // @ts-ignore
    document.getElementById("offcanvasBottom").addEventListener('hide.bs.offcanvas', function (e) {
      console.log("Hello hide.bs.offcanvas")
    })
  }

}
