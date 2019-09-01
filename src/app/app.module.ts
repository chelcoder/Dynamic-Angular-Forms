import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { StorageServiceModule } from "angular-webstorage-service";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScriptLoaderService } from "./_services/script-loader.service";
import { AuthModule } from "./auth/auth.module";
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { environment } from '../environments/environment';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AgmCoreModule } from '@agm/core';
import { MainRoutingModule } from './mainModule/main.routing.module';
import { MainComponent } from './mainModule/main.component';
import { GenericModule } from './mainModule/generic/generic.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { xModalModule } from './mainModule/generic/xModal/xModal.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
@NgModule({
    declarations: [
        MainComponent,
        AppComponent,
    ],
    imports: [
        GenericModule,
        BrowserModule,
        StorageServiceModule,
        BrowserAnimationsModule,
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AngularFirestoreModule,
        xModalModule,
        AngularFireModule.initializeApp(environment.firebase),
        AppRoutingModule,
        MainRoutingModule,

        AuthModule,
        NgbModule,
        SimpleNotificationsModule.forRoot(),
        SweetAlert2Module.forRoot()

    ],
    providers: [ScriptLoaderService],
    bootstrap: [AppComponent]
})
export class AppModule { }
