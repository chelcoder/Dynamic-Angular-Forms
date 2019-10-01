import { Injectable, Inject } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { Observable } from "rxjs/Observable";
import { IUser, User } from "../_models/user";
import { Upload } from "../_models/upload";
import { firestore } from "firebase";
import Timestamp = firestore.Timestamp;
import { Headers, Http } from "@angular/http";
import { map } from "rxjs/operators";
import * as firebase from "firebase";
import { GlobalVaribale } from "./globals.service";
import { SESSION_STORAGE, WebStorageService } from "angular-webstorage-service";
import { environment } from "../../environments/environment";

@Injectable()
export class UserService {
  constructor(
    private _db: AngularFirestore,
    private http: Http,
    @Inject(SESSION_STORAGE) private storage: WebStorageService
  ) {
  }


  addNewDriver(
    userData: IUser,
    callback: (data) => void,
    errorCallback?: (err) => void
  ) {
    const url = environment.postUrl + "/addDriver";
    console.log(userData);
    firebase
      .auth()
      .currentUser.getIdToken()
      .then(authToken => {
        const headers = new Headers({ Authorization: "Bearer " + authToken });
        return this.http
          .post(url, userData, { headers: headers })
          .toPromise();
      })
      .then(res => {
        if (res.ok) {
          callback(res);
        }
      })
      .catch(error => {
        errorCallback(error);
      });
  }
  addAdminDriver(
    userData: IUser,
    callback: (data) => void,
    errorCallback?: (err) => void
  ) {
    const url = environment.postUrl + "/addAdminDriver";
    firebase
      .auth()
      .currentUser.getIdToken()
      .then(authToken => {
        const headers = new Headers({ Authorization: "Bearer " + authToken });
        return this.http
          .post(url, userData, { headers: headers })
          .toPromise();
      })
      .then(res => {
        if (res.ok) {
          callback(res);
        }
      })
      .catch(error => {
        errorCallback(error);
      });
  }
  addDocument(userID: string, documentData: any, callback: () => void) {
    let clientId = localStorage.getItem(GlobalVaribale.clientId);
    this._db
      .collection("clients")
      .doc(clientId)
      .collection("drivers")
      .doc(userID)
      .collection("document")
      .add({ ...documentData })
      .then(v => {
        callback();
      })
      .catch(err => {
        console.error(err);
      });
  }
  getDriverDocument(userID: string) {
    let clientId = localStorage.getItem(GlobalVaribale.clientId);
    return this._db
      .collection(GlobalVaribale.clientRef)
      .doc(clientId)
      .collection(GlobalVaribale.userRef)
      .doc(userID)
      .collection("document")
      .snapshotChanges();
  }

  getDrivers(): Observable<any[]> {
    let clientId = localStorage.getItem(GlobalVaribale.clientId);
    return this._db
      .collection(GlobalVaribale.clientRef)
      .doc(clientId)
      .collection(GlobalVaribale.userRef)
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as User;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  getUser() {
    let clientId = localStorage.getItem(GlobalVaribale.clientId);
    let tempUsers = [];
    return this._db
      .collection(GlobalVaribale.clientRef)
      .doc(clientId)
      .collection(GlobalVaribale.userRef)
      .ref.get().then(users=>{
        
        users.docs.forEach(
          user=>{
            const data = user.data() as User;
            const id = user.id;
            tempUsers.push({id,...data})    
          }
          
        )
        return tempUsers;
      });
  }

  deteletDriver(userData: User) {
    let clientId = localStorage.getItem(GlobalVaribale.clientId);
    return this._db
      .collection(GlobalVaribale.clientRef)
      .doc(clientId)
      .collection(GlobalVaribale.userRef)
      .doc(userData.$key)
      .delete();
  }

  getDriver(uID: string): Promise<User> {
    let clientId = localStorage.getItem(GlobalVaribale.clientId);
    return this._db
      .collection(GlobalVaribale.clientRef)
      .doc(clientId)
      .collection(GlobalVaribale.userRef)
      .doc(uID)
      .ref.get()
      .then(newDriver => {
        let data = newDriver.data() as any;
        Object.keys(data)
          .filter(key => data[key] instanceof Timestamp)
          .forEach(key => (data[key] = data[key].toDate()));
        return new User(data, newDriver.id);
      });
  }

  updateDriver(id: string, userData: any, callback: () => void) {
    let clientId = localStorage.getItem(GlobalVaribale.clientId);
    this._db
      .collection(GlobalVaribale.clientRef)
      .doc(clientId)
      .collection(GlobalVaribale.userRef)
      .doc(id)
      .ref.update({ ...userData })
      .then(() => {
        callback();
      });
  }

  uploadDocuments(
    upload: Upload,
    basePath: string,
    callback: (finalupload: Upload) => void
  ) {
    let storageRef = firebase.storage().ref();
    if (upload.name == null) {
      upload.name =
        Math.random()
          .toString(36)
          .substr(2, 9) + upload.file.name;
    }
    let uploadTask = storageRef
      .child(`${basePath}/${upload.name}`)
      .put(upload.file);
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      snapshot => {
        // upload in progress
        // upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      },
      error => {
        // upload failed
        console.log(error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then(uploadUrl=>{
          upload.url = uploadUrl;
          callback(upload);
        })
      }
    );
  }

  getImageFromFireStorage() {
    let storageRef = firebase
      .storage()
      .ref()
      .child("AssetsImages/dummy_person.png");
    return storageRef.getDownloadURL();
  }
  getDriverSubscriptionPlan(userSubscriptionPlan) {
    return this._db
      .collection("subscriptions")
      .ref.where("name", "==", userSubscriptionPlan)
      .get();
  }
}
