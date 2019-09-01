import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.routing';
import { AuthComponent } from './auth.component';
import { AlertComponent } from './_directives/alert.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthGuard } from './_guards/auth.guard';
import { AlertService } from './_services/alert.service';
import { AuthenticationService } from './_services/authentication.service';
import { UserService } from './_services/user.service';
import { fakeBackendProvider } from './_helpers/index';
import { GlobalsService } from '../_services/globals.service';
import { CommonStorageService } from "../_services/common-storage.service";
import { UploadService } from '../_services/upload.service';
@NgModule({
    declarations: [
        AuthComponent,
        AlertComponent,
        LogoutComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        AuthRoutingModule,
        HttpClientModule,
    ],
    providers: [
        AuthGuard,
        AlertService,
        UploadService,
        AuthenticationService,
        UserService,
        GlobalsService,
        CommonStorageService,
        fakeBackendProvider,
        MockBackend,
        BaseRequestOptions,
    ],
    entryComponents: [AlertComponent],
})

export class AuthModule {
}
