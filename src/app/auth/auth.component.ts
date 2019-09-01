import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  Inject,
  ElementRef
} from "@angular/core";
import { ActivatedRoute, Router, RouterState } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { ScriptLoaderService } from "../_services/script-loader.service";
import { AuthenticationService } from "./_services/authentication.service";
import { AlertService } from "./_services/alert.service";
import { UserService } from "./_services/user.service";
import { AlertComponent } from "./_directives/alert.component";
import { LoginCustom } from "./_helpers/login-custom";
import { Helpers } from "../helpers";
import { SESSION_STORAGE, WebStorageService } from "angular-webstorage-service";
import { GlobalsService, GlobalVaribale } from "../_services/globals.service";
import { UploadService } from "../_services/upload.service";
import { environment } from "../../environments/environment";
import Swal from "sweetalert2/dist/sweetalert2.js";

@Component({
  selector: ".m-grid.m-grid--hor.m-grid--root.m-page",
  styleUrls: ["./templates/login-1.component.css"],
  templateUrl: "./templates/login-1.component.html",
  encapsulation: ViewEncapsulation.None
})
export class AuthComponent implements OnInit {
  public model: any = {};
  public loading = false;
  public returnUrl: string;
  public selectedFile: any;
  public noUserFoundMessage: string;
  public plans: any;
  public environmentUrl = "";
  public clientId: string;
  public logintemplate = {
    showPaymentOptions: true,
    showUserDetailOptions: true,
    showLoginPage: false,
    forgottenPasswordSection: true
  };
  public buttonText = "Start Your Free Trial";

  @ViewChild("alertSignin", { read: ViewContainerRef, static: false })
  alertSignin: ViewContainerRef;
  @ViewChild("alertSignup", { read: ViewContainerRef, static: false })
  alertSignup: ViewContainerRef;
  @ViewChild("alertForgotPass", { read: ViewContainerRef, static: false })
  alertForgotPass: ViewContainerRef;
  @ViewChild("signupForm", { static: true }) signUpForm: ElementRef;
  @ViewChild("agree", { static: false }) agree: ElementRef;
  @ViewChild("cardBody", { static: false }) cardBody: ElementRef;

  constructor(
    private _router: Router,
    private _script: ScriptLoaderService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _authService: AuthenticationService,
    private _alertService: AlertService,
    private _afAuth: AngularFireAuth,
    private _upSvc: UploadService,
    private cfr: ComponentFactoryResolver,
    @Inject(SESSION_STORAGE) private storage: WebStorageService,
    private _globals: GlobalsService,
  ) {}
  ngOnInit() {
    this.environmentUrl = environment.postUrl;
    this.model.remember = true;
    this.returnUrl = this._route.snapshot.queryParams["returnUrl"] || "/";
    if (this._router.url === "/signup") {
      this.generic("signUp");
    }
    localStorage.removeItem(GlobalVaribale.clientId);
    localStorage.removeItem(GlobalVaribale.userRole);
    this._script
      .loadScripts(
        "body",
        [
          "assets/vendors/base/vendors.bundle.js",
          "assets/themingAssets/scripts/base/scripts.bundle.js"
        ],
        true
      )
      .then(() => {
        Helpers.setLoading(false);
        LoginCustom.init();
      });


  }

  generic(data) {
    switch (data) {
      case "forgotPassword":
        this.logintemplate.forgottenPasswordSection = false;
        this.logintemplate.showLoginPage = true;
        break;
      case "cancel":
        this.logintemplate.showLoginPage = false;
        this.logintemplate.forgottenPasswordSection = true;
        break;
      case "backToLogin":
        this.logintemplate.showLoginPage = false;
        this.logintemplate.forgottenPasswordSection = true;
        this.model = {};
    }
  }


  signin() {
    this.loading = true;
    this._afAuth.auth
      .signInWithEmailAndPassword(this.model.email, this.model.password)
      .then(user => {
        if (user.user.emailVerified) {
          if (this._globals.userClientId && this._globals.userRole) {
            localStorage.setItem(
              GlobalVaribale.clientId,
              this._globals.userClientId
            );
              localStorage.setItem(GlobalVaribale.userRole, "admin");


            this.loading = false;
            this._router.navigate([this.returnUrl]).then(v => {
              // window.location.reload()
            });
          } else {
            this._globals.getClientID().subscribe(
              data => {
                let userEmail = this._afAuth.auth.currentUser.email;
                if (data !== undefined) {
                  localStorage.setItem(GlobalVaribale.clientId, data.client);
                  this.clientId = data.client;

                    localStorage.setItem(GlobalVaribale.userRole, "admin");

                  this._router.navigate([this.returnUrl]).then(v => {
                    // window.location.reload();
                  });


                } else {
                  this.noUserFoundMessage =
                    "Sorry No User with " + userEmail + " Found";
                  this.loading = false;
                }
              },
              error => {}
            );
          }
        } else {
          this.loading = false;
          this.showAlert("alertSignin");
          this._alertService.error("Email address not verified. Please recheck your email");
        }
      })
      .catch(error => {
        this.showAlert("alertSignin");
        this._alertService.error(error);
        this.loading = false;
      });
  }








  forgotPass() {
    this.loading = true;
    let textMessage = "Email sent to " + this.model.email;
    this._userService
      .forgotPassword(this.model.email)
      .then(data => {
        this.showAlert("alertSignin");
        this._alertService.success(
          "Cool! Password recovery instruction has been sent to your email.",
          true
        );
        this.loading = false;
        Swal.fire({
          position: "center",
          type: "success",
          title: "Password Reset Successful",
          text: textMessage,
          showConfirmButton: false,
          timer: 2000
        });
        this.generic("cancel");
        this.model = {};
      })
      .catch(error => {
        this.showAlert("alertForgotPass");
        this._alertService.error(error);
        this.loading = false;
      });
  }


  showAlert(target) {
    this[target].clear();
    let factory = this.cfr.resolveComponentFactory(AlertComponent);
    let ref = this[target].createComponent(factory);
    ref.changeDetectorRef.detectChanges();
  }




}
