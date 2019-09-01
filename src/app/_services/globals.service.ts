import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/fromPromise';
import { environment } from '../../environments/environment';
import { Http } from '@angular/http';
@Injectable()
export class GlobalsService {
    userRole: string;
    userDisplayName: string;
    userClientId: string;
    userEmail: string;
    userPhoto: string;
    loggedUser: any;
    adminDriver: boolean;
    constructor(private _afauth: AngularFireAuth,
        private _db: AngularFirestore,
        private http:Http
        ) {
        this.userClientId = null;
        this.userRole = null;
        this.adminDriver = null;
        this.refreshUser();
    }

    refreshUser()
    {
        const currentUser = this._afauth.auth.currentUser;
        this.loggedUser = currentUser;
        if (currentUser) {
            this.userDisplayName = currentUser.displayName;
            this.userEmail = currentUser.email;
            this.userPhoto = currentUser.photoURL;
            localStorage.setItem(GlobalVaribale.fullName,this.userDisplayName);
            const userRef = this._db.collection("users").doc(currentUser.uid).ref;
            userRef.get().then(userRefDoc => {
                const data = userRefDoc.data();
                this.userClientId = data.client;
                this.userRole = data.Role;
                this.adminDriver = data.AdminDriver;
            });
        }
    }

    getAuditors() {
        return this._db.collection('auditors').ref.get();
    }

    getClientID(): Observable<any> {

        const currentUser = this._afauth.auth.currentUser;
        const userRef = this._db.collection("users").doc(currentUser.uid).ref;
        return Observable.fromPromise(
            userRef.get().then(userRefDoc => {
                const data = userRefDoc.data();
                return data;
            })
        );
    }

    getClientsDetailsById(clientId: any) {
        return this._db.collection('clients').doc(clientId).ref.get();
    }
    getReferralCodeFromAuditor(referralCode:any){
        return this._db.collection('auditors').ref.where("code","==",referralCode).get();
    }
    getClientEmailAddress(email:string){
        return this._db.collection('users').ref.where('emailAddress','==',email).get();
    }
    checkClientEmailAddress(email){
        let url = environment.postUrl+'/checkEmail';
        return this.http.post(url,email).toPromise();
    }


}

export enum GlobalVaribale {
    clientId = "clientID",
    userRole = "userRole",
    clientRef = "clients",
    vehicleRef = "vehicles",
    massManagementRef = "amms",
    jobsRef = "jobs",
    userRef = "drivers",
    trailingEqpRef = "trailingEquipments",
    documentsRef = "documents",
    stopsRef = "stops",
    dayEndJobsRef = "dayEndJobs",
    userSubscription = "userSubscriptionPlan",
    userBrainTreeId = "userBrainTreeId",
    maxOdometerLimit = "maxOdometerLimit",
    maxNumberOfDaysForMaintainance = "maxNumberOfDaysForMaintainance",
    adminDriver = "AdminDriver",
    standAloneLatitude = "standAloneLatitude",
    standAloneLongitude = "standAloneLongitude",
    totalJobsCount = "totalJobsCount",
    userSubscriptionExpired = "userSubscriptionExpired",
    trialDaysLeft = "trialDaysLeft",
    trialExpired = "trialExpired",
    subscriptionId = "subscriptionId",
    subscriptionPlan = "subscriptionPlan",
    totalNumberOfTrucks = "totalNumberOfTrucks",
    price="price",
    premiumPricePerTruck = "premiumPricePerTruck",
    fullName="fullName"

}
