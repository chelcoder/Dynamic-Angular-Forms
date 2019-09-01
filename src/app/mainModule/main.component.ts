import {
  Component,
  OnInit,
  ViewEncapsulation,
  EventEmitter,
  Inject,
  ViewChild,
  ElementRef
} from "@angular/core";
import { Router } from "@angular/router";
import { ScriptLoaderService } from "../_services/script-loader.service";
import { GlobalsService, GlobalVaribale } from "../_services/globals.service";
import { SESSION_STORAGE, WebStorageService } from "angular-webstorage-service";
import swal from "sweetalert2";
import { clientService } from "../_services/clients.service";
declare let mApp: any;
declare let mUtil: any;
declare let mLayout: any;
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { Http } from "@angular/http";
import { environment } from "../../environments/environment.prod";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit {
  modal: EventEmitter<any> = new EventEmitter<any>();
  modalRenew: EventEmitter<any> = new EventEmitter<any>();
  clientId: string;
  daysLeft: number;
  subscriptionPlan: string;
  currentPrice;
  totalNumberOfTrucks;
  newTotalPrice;
  currencyType;
  alertMessage;
  renewAlertMessage;
  planExpired;
  userRole;
  userBrainTreeId;

  @ViewChild("planModal", { static: false }) planModal: ElementRef;

  constructor(
    @Inject(SESSION_STORAGE) private storage: WebStorageService,
    private _clientService: clientService,
    private http: Http
  ) {}
  ngOnInit() {
    this.daysLeft = parseInt(
      localStorage.getItem(GlobalVaribale.trialDaysLeft)
    );
    this.clientId = localStorage.getItem(GlobalVaribale.clientId);
    this.userRole = localStorage.getItem(GlobalVaribale.userRole);
    this.subscriptionPlan = localStorage.getItem(
      GlobalVaribale.subscriptionPlan
    );
    this.currentPrice = localStorage.getItem(GlobalVaribale.price);
    this.totalNumberOfTrucks = localStorage.getItem(
      GlobalVaribale.totalNumberOfTrucks
    );
    this.planExpired = JSON.parse(
      localStorage.getItem(GlobalVaribale.userSubscriptionExpired)
    );
    this.userBrainTreeId = localStorage.getItem(GlobalVaribale.userBrainTreeId);
    if (this.userRole == "admin") {
      if (this.planExpired) {
        setTimeout(v => {
          this.modalRenew.emit("show");
        }, 3000);
      }
    }
  }

  showModal() {
    this.modal.emit("show");
  }

  upgradePlan(action) {
    let clientDetails = {};

    switch (action) {
      case "upgrade":
        clientDetails["price"] = this.newTotalPrice.toString();
        clientDetails["trial"] = false;
        this._clientService
          .updateClient(this.clientId, clientDetails)
          .then(success => {
            Swal.fire({
              position: "center",
              type: "success",
              title: "Upgrade Successful",
              text: "Welcome to Trackplus Premium",
              showConfirmButton: false,
              timer: 2000
            });
            $("button#modalClose").trigger("click");
            localStorage.setItem(GlobalVaribale.trialExpired, "false");
            localStorage.setItem(GlobalVaribale.subscriptionPlan, "PREMIUM");
            setTimeout(v => {
              window.location.reload();
            });
          })
          .catch(error => {
            swal.fire("Error", error.message);
          });
        break;
      case "renew":
        clientDetails["clientId"] = this.clientId;
        clientDetails["braintreeId"] = this.userBrainTreeId;
        clientDetails["price"] = this.currentPrice;
        let url = environment.postUrl + "/paymentUpdate";
        this.http
          .post(url, clientDetails)
          .toPromise()
          .then(v => {
            localStorage.setItem(
              GlobalVaribale.userSubscriptionExpired,
              "false"
            );
            Swal.fire({
              position: "center",
              type: "success",
              title: "Renew Successful",
              text: "Thankyou for choosing Trackplus, Enjoy our service.",
              showConfirmButton: false,
              timer: 2000
            });
            $("button#renewModalClose").trigger("click");
          });
    }
  }

}
