import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Params} from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  view: string = 'default';

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
          // @ts-ignore
          this.view = params.view;
        }
      );
  }

}
