import { Component, OnInit, Inject } from "@angular/core";
import "rxjs/add/observable/fromEvent";
import { GlobalVaribale } from "../../../_services/globals.service";
import { SESSION_STORAGE, WebStorageService } from "angular-webstorage-service";

declare let mLayout: any;
@Component({
  selector: "app-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.css"]
})
export class SideNavComponent implements OnInit {
  isSuperAdmin: boolean = false;
  userRole: string = "";
  trial;
  plan: string;
  showMaps: boolean = false;
  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService) {}
  ngOnInit() {

    this.userRole = localStorage.getItem(GlobalVaribale.userRole);
   }
}
