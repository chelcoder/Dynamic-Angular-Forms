import { Injectable, Inject } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  CanActivateChild,
  ActivatedRoute
} from "@angular/router";
import { Observable } from "rxjs/Observable";
import { AngularFireAuth } from "@angular/fire/auth";
import { SESSION_STORAGE, WebStorageService } from "angular-webstorage-service";
import { GlobalVaribale } from "../../_services/globals.service";

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private _router: Router,
    private _afAuth: AngularFireAuth,
    @Inject(SESSION_STORAGE) private storage: WebStorageService
  ) {}
  currentRoute = "";
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this._afAuth.authState.map(auth => {
      this.currentRoute = state.url;
      if (auth && auth.uid && localStorage.getItem(GlobalVaribale.clientId)) {

        return true

      } else {
        this._router.navigate(["/login"]);
        return false;
      }
    });
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.canActivate(route, state);
  }
}
