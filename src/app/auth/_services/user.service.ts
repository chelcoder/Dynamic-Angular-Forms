import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs/Observable';
import { User } from "../_models/index";
import { environment } from "../../../environments/environment";
import * as firebase from 'firebase';


@Injectable()
export class UserService {

    mainurl: String = environment.postUrl;

    constructor(private _afAuth: AngularFireAuth, private http: Http, private _router: Router) {
    }

    verify() {

        // return this.http.get('/api/verify', this.jwt()).map((response: Response) => response.json());
    }

    forgotPassword(email: string) {
        return firebase.auth().sendPasswordResetEmail(email);
        // return this.http.post('/api/forgot-password', JSON.stringify({ email }), this.jwt()).map((response: Response) => response.json());
    }

    getAll() {
        return this.http.get('/api/users', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(user: User) {
        return this.http.post(this.mainurl + '/clientSignup', user);
    }

    createBraintree() {
        let braintreeData = { id: 1, data: 'test' };
        return this.http.post(this.mainurl + '/newBraintreeCustomer', braintreeData);
    }

    getPlans() {
        return this.http.get(this.mainurl + '/getPlans');
    }


    getCustomer(customerId) {
        return this.http.post(this.mainurl + '/getCustomer', customerId);
    }

    update(user: User) {
        return this.http.put('/api/users/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token, 'Content-Type': 'application/json' });
            return new RequestOptions({ headers: headers });
        }
    }
}