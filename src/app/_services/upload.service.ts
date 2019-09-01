import { Injectable } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabase } from '@angular/fire/database';
import { Upload } from '../_models/upload';
import * as firebase from 'firebase';

@Injectable()
export class UploadService {
    private basePathVehicle: string = '/vehicles';
    constructor(private af: AngularFireModule, private db: AngularFireDatabase) { }

    pushUploadToVehicles(upload: Upload, basePath: string, callback: (finalupload: Upload) => void) {
        let storageRef = firebase.storage().ref();
        if (upload.name == null) {
            upload.name = Math.random().toString(36).substr(2, 9) + upload.file.name;
        }
        let uploadTask = storageRef.child(`${basePath}/${upload.name}`).put(upload.file);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
            },
            (error) => {
            }, () => {
                upload.url = uploadTask.snapshot.downloadURL;
                callback(upload);
            }
        );
    }

    deleteUploaTrainer(upload: Upload) {
        return this.deleteFileDataVehicle(upload.$key).then(() => {
            this.deleteFileStorageVehicle(upload.name)
        }).catch(error => console.log(error))
    }

    private deleteFileDataVehicle(key: string) {
        return this.db.list(`${this.basePathVehicle}/`).remove(key);
    }

    private deleteFileStorageVehicle(name: string) {
        let storageRef = firebase.storage().ref();
        return storageRef.child(`${this.basePathVehicle}/${name}`).delete();
    }

}
