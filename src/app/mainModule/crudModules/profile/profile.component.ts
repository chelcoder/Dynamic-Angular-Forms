import {
  Component,
  Inject,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";
import { Helpers } from "../../../helpers";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {
  GlobalsService,
  GlobalVaribale
} from "../../../_services/globals.service";
import {  AuthenticationService } from "../../../auth/_services";
import { UploadService } from "../../../_services/upload.service";
import { Upload } from "../../../_models/upload";
import { SESSION_STORAGE, WebStorageService } from "angular-webstorage-service";
import { clientService } from "../../../_services/clients.service";
import { IUserDetails, UserDetails } from "../../../_models/userDetails";
import { MapsAPILoader } from "@agm/core/services/maps-api-loader/maps-api-loader";
import { AgmMap } from "@agm/core/directives/map";
import "sweetalert2/src/sweetalert2.scss";
import { Http } from "@angular/http";
import * as moment from "moment-timezone";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit {
  @ViewChild("copyUrl", {static: false}) copiedUrl: ElementRef;
  @ViewChild("AgmMap", {static: false}) agmMap: AgmMap;
  @ViewChild("profilePicLabel", {static: false}) profilePicLabel: ElementRef;

  public addProfile: FormGroup;
  public UserEmail?: FormControl;
  public userPhoto: string;
  public fullName?: FormControl;
  public loading = false;
  public selectedFile: any;
  public userDetails: IUserDetails = {};
  public clientId;
  public isAdmin: boolean = false;
  public bounds: any;
  public formReady: boolean = false;
  public userDescription: UserDetails;
  public userRole: string;

  constructor(
    @Inject(SESSION_STORAGE) private storage: WebStorageService,
    private _globalService: GlobalsService,
    private authService: AuthenticationService,
    private _upSvc: UploadService,
    private _clientService: clientService,
    public mapsAPILoader: MapsAPILoader,
    private _route: ActivatedRoute,
    private http: Http
  ) {}
  ngOnInit() {
    this.isAdmin = localStorage.getItem(GlobalVaribale.userRole) == "admin";
    this.userRole = localStorage.getItem(GlobalVaribale.userRole);

    // Helpers.setLoading(true);


    this._route.queryParams.subscribe(params => {
      this.clientId = params["userId"];

      this._clientService
        .getClientsById(this.clientId)
        .subscribe(clientData => {
          this.userDetails = new UserDetails(clientData);
          const datas: UserDetails = this.userDetails;
          let currentDate = moment()
            .tz("Australia/Perth")
            .format("X");


          this.userDescription = datas;
          this.createFormControls();
          this.createForm();
          this.formReady = true;
          this.UserEmail.setValue(this._globalService.userEmail);
          this.fullName.setValue(this._globalService.userDisplayName);
          this.userPhoto = this._globalService.userPhoto;

        });
    });
  }





  private createFormControls() {
    this.UserEmail = new FormControl("", Validators.required);
    this.fullName = new FormControl("", Validators.required);
  }
  private createForm() {
    this.addProfile = new FormGroup({
      UserEmail: this.UserEmail,
      fullName: this.fullName
    });
  }

  fileCheck(event) {
    this.selectedFile = event.target.files.item(0);
    this.profilePicLabel.nativeElement.innerText = this.selectedFile.name;
  }

  editProfile() {
    this.loading = true;
    if (this.selectedFile) {
      let currentUpload = new Upload(this.selectedFile);
      this._upSvc.pushUploadToVehicles(
        currentUpload,
        "/profiles",
        (uploaded: Upload) => {
          this.userPhoto = uploaded.url;
          this.updateUser();
        }
      );
    } else {
      this.updateUser();
    }
  }

  updateUser() {
    this.authService
      .updateUser(this.fullName.value, this.userPhoto, this.UserEmail.value)
      .then(v => {
        if (this._globalService.userEmail != this.UserEmail.value.trim()) {
          this.authService.updateEmail(this.UserEmail.value.trim()).then(v => {
            this.loading = false;
            window.location.reload();
          });
        } else {
          this.loading = false;
          window.location.reload();
        }
      });
  }


}
