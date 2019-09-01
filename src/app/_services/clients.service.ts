import { Inject, Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Client } from "../_models/clients";
import { SESSION_STORAGE, WebStorageService } from "angular-webstorage-service";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";
@Injectable()
export class clientService {
    private userId: string;
    clientCollection: AngularFirestoreCollection<Client>;
    items: Observable<Client[]>;
    constructor(
        private _db: AngularFirestore,
        @Inject(SESSION_STORAGE) private storage: WebStorageService
    ) {
        // this.clientCollection = this._db
        //     .collection('clients');

    }

    getClients(): Observable<any[]> {
        return this._db.collection('clients').snapshotChanges().pipe(
            map(actions =>
                actions.map(a => {
                    const data = a.payload.doc.data() as Client;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                })
            )
        );
    }

    getAdminDrivers(){

        return this._db.collection('users').ref.where("AdminDriver", "==", true).get();
    }
    updateClient(clientId,clientDetails){
        return this._db.collection('clients').doc(clientId).update(clientDetails);
    }

    getClientsById(clientId) {
        return this._db.collection('clients').doc(clientId).valueChanges();
    }
    getDriverData(clientId) {
        return this._db.collection('clients').doc(clientId).collection('drivers').valueChanges();
    }
    getVehicleData(clientId) {
        return this._db.collection('clients').doc(clientId).collection('vehicles').valueChanges();
    }
    getTrailingEquipmentData(clientId) {
        return this._db.collection('clients').doc(clientId).collection('trailingEquipments').valueChanges();
    }
    getJobsData(clientId) {
        return this._db.collection('clients').doc(clientId).collection('jobs').valueChanges();
    }
    addNewClientMaintainanceLimit(clientId, clientMaintainanceData) {
        return this._db.collection('clients').doc(clientId).update(clientMaintainanceData);
    }
}
