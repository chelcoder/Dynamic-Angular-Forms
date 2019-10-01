import { Inject, Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { SESSION_STORAGE, WebStorageService } from "angular-webstorage-service";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";

import { ChatMessage } from "../_models/message";
import { GlobalVaribale } from "./globals.service";

@Injectable()
export class ChatService {
  constructor(
    private _db: AngularFirestore,
    @Inject(SESSION_STORAGE) private storage: WebStorageService
  ) {}

  addMessage(messageData: any, driverId: string, callback: () => void) {
    console.log(messageData);
    let clientId = localStorage.getItem(GlobalVaribale.clientId);
    this._db
      .collection("clients")
      .doc(clientId)
      .collection("drivers")
      .doc(driverId)
      .collection("message")
      .add(messageData)
      .then(v => {
        callback();
      });
  }

  getLatestMessage(callback: (data) => void) {
    let clientId = localStorage.getItem(GlobalVaribale.clientId);
    this._db
      .collection("clients")
      .doc(clientId)
      .ref.onSnapshot(v => {
        callback(v.data());
      });
  }

  getMessages(driverKey: string): Observable<ChatMessage[]> {
    let clientId = localStorage.getItem(GlobalVaribale.clientId);
    return this._db
      .collection("clients")
      .doc(clientId)
      .collection("drivers")
      .doc(driverKey)
      .collection("message")
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as ChatMessage;
            const id = a.payload.doc.id;
            
            return { id, ...data };
          })
        )
      );
  }
}
