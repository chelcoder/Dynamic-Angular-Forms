import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
// import { LayoutModule } from '../../layouts/layout.module';
// import { DefaultComponent } from '../default.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalsService } from '../../../_services/globals.service';
import { UserService } from '../../../auth/_services';
import { AuthenticationService } from '../../../auth/_services';
import { ChangePasswordComponent } from './change-password.component';

const routes: Routes = [

            {
                "path": "",
                "component": ChangePasswordComponent
            },

];
@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), FormsModule,
        ReactiveFormsModule
    ], exports: [
        RouterModule,
        FormsModule,
        ReactiveFormsModule
    ], declarations: [
        ChangePasswordComponent
    ],
    providers: [
        GlobalsService,
        UserService,
        AuthenticationService
    ]
})
export class ChangePasswordModule {



}
