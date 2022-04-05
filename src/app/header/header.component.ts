import {Component, OnInit} from "@angular/core";
import {faShare} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  shareIcon = faShare;

  ngOnInit(): void {
  }

}
