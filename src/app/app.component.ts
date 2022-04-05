import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  view: string = 'default';

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
          console.log(params); // { orderby: "price" }
          // @ts-ignore
        this.view = params.view;
          console.log(this.view); // price
        }
      );
  }

}
