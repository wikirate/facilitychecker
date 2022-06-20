import {Component, OnInit} from "@angular/core";
import {faShare} from "@fortawesome/free-solid-svg-icons";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, ParamMap, Params, Router} from "@angular/router";

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  lang: string = 'en';

  shareIcon = faShare;
  languageNames: any =
    {
      'en': "English",
      'es': "Español",
      'de': "Deutsch",
      'el': "Ελληνικά"
    }

  constructor(
    public translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    translate.addLangs(['en', 'es', 'de', 'el']);
    translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['lang'] !== undefined && this.languageNames[params['lang']] != undefined && params['lang'] != this.lang)
        this.lang = params['lang']
      else
        this.lang = 'en'
      this.translate.use(this.lang);

    })
  }

  switchLang(lang: string) {
    if (lang != 'en')
      this.router.navigate([this.router.url], {queryParams: {lang: lang}});
    else
      this.router.navigate([this.router.url], {queryParams: {}});
  }

  navigateToAboutPage() {
    if (this.lang != 'en')
      this.router.navigate(['/about'], {queryParams: {lang: this.lang}});
    else
      this.router.navigate(['/about'], {queryParams: {}});
  }

  navigateToHomePage() {
    if (this.lang != 'en')
      this.router.navigate(['/home'], {queryParams: {lang: this.lang}});
    else
      this.router.navigate(['/home'], {queryParams: {}});
  }

}
