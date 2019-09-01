import { Injectable, Inject } from "@angular/core";
import { map } from "rxjs/operators";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestore } from "@angular/fire/firestore";
import { Upload } from "../_models/upload";
import { Observable } from "rxjs/Observable";
import { IDocument, Document } from "../_models/document";
import { GlobalVaribale } from "./globals.service";
import { SESSION_STORAGE, WebStorageService } from "angular-webstorage-service";
import * as firebase from "firebase";
@Injectable()
export class DocumentService {
    private basePathVehicle: string = "/documents";
    private clientId: string;
    private uploadedDocument: IDocument = {};
    constructor(
        private _db: AngularFirestore,
        private af: AngularFireModule,
        @Inject(SESSION_STORAGE) private storage: WebStorageService
    ) {
        // let clientId = localStorage.getItem(GlobalVaribale.clientId);
    }

    addNewDoucument(
        Key: string,
        type: string,
        documentData: IDocument,
        callback: () => void
    ) {
        let clientId = localStorage.getItem(GlobalVaribale.clientId);
        this._db
            .collection(GlobalVaribale.clientRef)
            .doc(clientId)
            .collection(type)
            .doc(Key)
            .collection(GlobalVaribale.documentsRef)
            .add(documentData)
            .then(() => {
                callback();
            });
    }
    getDocuments(key: string, type: string): Observable<any[]> {
        let clientId = localStorage.getItem(GlobalVaribale.clientId);
        return this._db
            .collection(GlobalVaribale.clientRef)
            .doc(clientId)
            .collection(type)
            .doc(key)
            .collection(GlobalVaribale.documentsRef)
            .snapshotChanges()
            .pipe(
            map(actions =>
                actions.map(a => {
                    const data = a.payload.doc.data() as Document;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                })
            )
            );
    }

    deteletDocument(
        key: string,
        type: string,
        documentData: Document
    ) {
        let clientId = localStorage.getItem(GlobalVaribale.clientId);        
        return this._db
            .collection(GlobalVaribale.clientRef)
            .doc(clientId)
            .collection(type)
            .doc(key)
            .collection(GlobalVaribale.documentsRef)
            .doc(documentData.$key)
            .delete()
            .then(() => {
                return this.deleteFileStorageDocument(documentData.imgName);
            });
    }

    getDocument(key: string, type: string, dockey: string) {
        let clientId = localStorage.getItem(GlobalVaribale.clientId);
        return this._db
            .collection(GlobalVaribale.clientRef)
            .doc(clientId)
            .collection(type)
            .doc(key)
            .collection(GlobalVaribale.documentsRef)
            .doc(dockey)
            .ref.get();
    }

    updateDocument(
        Key: string,
        type: string,
        documentData: IDocument,
        callback: () => void
    ) {
        let clientId = localStorage.getItem(GlobalVaribale.clientId);

        this._db
            .collection(GlobalVaribale.clientRef)
            .doc(clientId)
            .collection(type)
            .doc(Key)
            .collection(GlobalVaribale.documentsRef)
            .add(documentData)
            .then(() => {
                callback();
            });
    }

    dowloadDocument(imageName: string) {
        let storageRef = firebase.storage().ref();
        let httpsReferecnce = storageRef
            .child("documents/" + imageName)
            .getDownloadURL()
            .then(function(url) {
                let xhr = new XMLHttpRequest();
                xhr.responseType = "blob";
                xhr.onload = function(event) {
                    var blob = xhr.response;
                };
                xhr.open("GET", url);
                console.log(url);
                xhr.send();
            });
    }

    uploadDocuments(
        upload: Upload,
        key: string,
        type: string,
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
            .child(`${this.basePathVehicle}/${upload.name}`)
            .put(upload.file);
        uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            snapshot => {
                // upload in progress
                //upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            error => {
                // upload failed
                console.log(error);
            },
            () => {
                upload.url = uploadTask.snapshot.downloadURL;
                this.uploadedDocument.name = upload.file.name;
                this.uploadedDocument.url = upload.url;
                this.uploadedDocument.type = upload.file.type;
                this.uploadedDocument.size = upload.file.size;
                this.uploadedDocument.imgName = uploadTask.snapshot.metadata.name;
                this.addNewDoucument(key, type, this.uploadedDocument, () => {
                    callback(upload);
                });
            }
        );
    }

    public deleteFileStorageDocument(name: string) {
        let storageRef = firebase.storage().ref();
        return storageRef.child(`${this.basePathVehicle}/${name}`).delete();
    }
}
