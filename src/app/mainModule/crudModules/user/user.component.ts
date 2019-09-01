import {
  Component,
  Inject,
  OnInit,
  ViewEncapsulation,
  EventEmitter
} from "@angular/core";
import { User, IUser } from "../../../_models/user";
import { UserService } from "../../../_services/user.service";
import { Router } from "@angular/router";
import { CommonStorageService } from "../../../_services/common-storage.service";
import { SESSION_STORAGE, WebStorageService } from "angular-webstorage-service";
import {
  GlobalVaribale,
  GlobalsService
} from "../../../_services/globals.service";
declare var $: any;

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit {
  public users$: User[];
  public tempDriver: User[];
  public searchFilterId: number;
  public addDriverBoolean: boolean = true;
  public paramsValue: string = "working";
  public showDeleted: boolean = false;
  public userRole: string;
  public userEmail: string;
  public isAdmin: boolean = false;
  public searchData: boolean = false;
  public modal: EventEmitter<any> = new EventEmitter<any>();
  public actionType;
  public userSubscriptionExpiredStatus: boolean;
  public userObject: User = {};

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _commonStorageService: CommonStorageService,
    private _globalService: GlobalsService,
    @Inject(SESSION_STORAGE) private storage: WebStorageService
  ) {}

  ngOnInit() {
    this.userRole = localStorage.getItem(GlobalVaribale.userRole);
    this.isAdmin = localStorage.getItem(GlobalVaribale.userRole) == "admin";
    this.userEmail = this._globalService.userEmail;
    this.userSubscriptionExpiredStatus = JSON.parse(
      localStorage.getItem(GlobalVaribale.userSubscriptionExpired)
    );
    this._userService.getDrivers().subscribe(newDrivers => {
      this.users$ = newDrivers.map(user => new User(user));
      this.tempDriver = this.users$;
      this.users$ = this.users$.filter(v => {
        return v.userStatus !== "inactive";
      });
      if (this.userRole == "user") {
        this.users$ = this.users$.filter(v => {
          return v.email == this.userEmail;
        });
      }
    });
    this.checkSubscription();
  }

  deleteVehicle(user: User) {
    return this._userService.deteletDriver(user);
  }

  viewDriver(user: User, index) {
    this._commonStorageService.listData = this.users$;
    this._commonStorageService.selectedValueIndex = index;
    this.userObject = user;
    this.actionType = "view";
    this._commonStorageService.selectedValueIndex = index;
    this.modal.emit("show");
  }
  addDriver() {
    this.actionType = "add";
    this.modal.emit("show");
  }
  clearSearch() {
    this.users$ = this.tempDriver;
  }

  search(searchData) {
    this.searchData = searchData && searchData.length > 0;
    this.users$ = this.tempDriver;
    setTimeout(() => {
      jQuery("tr.SearchAllData").attr("hidden", "true");
      jQuery("tr.SearchAllData:Contains(" + searchData + ")").removeAttr(
        "hidden"
      );
    });
  }

  checkSubscription() {

  }


  checkBoxCheck(value) {
    if (this.showDeleted) {
      this.users$ = this.tempDriver;
      this.users$ = this.users$.filter(v => {
        return v.userStatus == "inactive";
      });
    } else {
      this.users$ = this.tempDriver;
      this.users$ = this.users$.filter(v => {
        return v.userStatus !== "inactive";
      });
    }
    $(document).ready(function() {
      var tableRow = $("td")
        .filter(function() {
          return $(this).text() == "inactive" || $(this).text() == "";
        })
        .closest("tr");
      tableRow.css("color", "red");
    });
  }

  preventDeletedDriverDeletion(item, index) {
    if (item.userStatus == "inactive") {
      return true;
    } else {
      return false;
    }
  }
  addVehicle() {
    this.actionType = "add";
    this.modal.emit("show");
  }
  modalClose() {
    this.actionType = null;
  }
  outputValue() {
    this.modal.emit("hide");
  }
}
