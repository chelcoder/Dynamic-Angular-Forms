import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
// import { LayoutModule } from '../../layouts/layout.module';
// import { DefaultComponent } from '../default.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalsService } from '../../../_services/globals.service';
import { UserService } from '../../../auth/_services/user.service';
import { AuthenticationService } from '../../../auth/_services/authentication.service';
import { UploadService } from '../../../_services/upload.service';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../../../../environments/environment';
import {clientService} from "../../../_services/clients.service";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

const routes: Routes = [


            {
                "path": "",
                "component": ProfileComponent
            },
            {
                path:"view",
                component:ProfileComponent
            },


];
@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes),  FormsModule,
        ReactiveFormsModule,SweetAlert2Module,

    ], exports: [
        RouterModule,
        FormsModule,
        ReactiveFormsModule
    ], declarations: [
        ProfileComponent,
    ],
    providers: [
        GlobalsService,
        UserService,
        AuthenticationService,
        UploadService,
        clientService
    ]
})
export class ProfileModule {



}
