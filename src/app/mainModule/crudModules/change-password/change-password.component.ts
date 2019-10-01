import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../auth/_services';
import { GlobalsService } from '../../../_services/globals.service';


@Component({
    selector: "app-change-password",
    templateUrl: "./change-password.component.html",
    encapsulation: ViewEncapsulation.None,
    // styleUrls: ['./profile.component.scss']
})


export class ChangePasswordComponent implements OnInit {
    loading = false;
    public addProfile: FormGroup;
    public userEmail: string;
    public password?: FormControl;
    public rePassword?: FormControl;
    public currentPassword?: FormControl;


    constructor(private _service: NotificationsService, private globalService: GlobalsService, private router: Router, private authService: AuthenticationService) {

    }
    ngOnInit() {
        this.createFormControls();
        this.createForm();
    }

    private createFormControls() {
        this.password = new FormControl('', Validators.required);
        this.rePassword = new FormControl('', Validators.required);
        this.currentPassword = new FormControl('', Validators.required);
        this.userEmail = this.globalService.userEmail
    }
    private createForm() {
        this.addProfile = new FormGroup({
            password: this.password,
            rePassword: this.rePassword,
            currentPassword: this.currentPassword,
        });
    }

    editProfile() {
        if (this.password.value == this.rePassword.value) {
            this.authService.updatePassword(this.password.value, this.globalService.userEmail, this.currentPassword.value).then(
                v => {
                    this._service.success('Success', 'Passwords changed successfully');
                    this.router.navigate(['/index']);
                },
                err => {
                    this._service.error('Error', err.message);
                }
            )


        }
        else {
            this._service.error('Error', 'Passwords do not match');
            console.log('no matchs');
        }
    }



}
