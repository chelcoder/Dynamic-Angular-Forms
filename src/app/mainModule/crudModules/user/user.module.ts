import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserComponent } from "./user.component";
import { Routes, RouterModule } from "@angular/router";
//import { LayoutModule } from '../../../layouts/layout.module';
// import { DefaultComponent } from '../default.component';
import { UploadService } from "../../../_services/upload.service";
import { DataTableModule } from "angular-6-datatable";
import { DataListModule } from "primeng/datalist";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { ViewUserComponent } from "./view-user/view-user.component";
import { UserService } from "../../../_services/user.service";
import { AgmCoreModule } from "@agm/core";
import { environment } from "../../../../environments/environment";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { Ng5SliderModule } from "ng5-slider";
import { BsDatepickerModule, DatepickerModule } from "ngx-bootstrap";
import { SharedModule } from "primeng/shared";
import { GenericModule } from "../../generic/generic.module";
import { UserGeneralInformationComponent } from "./view-user/general-information/user-general-information.component";
import { UserDocumentInformationComponent } from "./view-user/document-information/user-document-information.component";
import {DocumentService} from "../../../_services/document.service";

const routes: Routes = [
  {
    path: "",
    component: UserComponent
  },
  {
    path: "list",
    component: UserComponent
  },
  {
    path: "view",
    component: ViewUserComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    Ng5SliderModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    RouterModule.forChild(routes),
    DataTableModule,
    DataListModule,
    FormsModule,
    SweetAlert2Module.forRoot(),
    ReactiveFormsModule,
    GenericModule,
    SharedModule,
    NgbModule
  ],
  exports: [
    RouterModule,
    ViewUserComponent
  ],
  declarations: [
    UserComponent,
    ViewUserComponent,
    UserGeneralInformationComponent,
    UserDocumentInformationComponent,
  ],
  providers: [
    UserService,
    DocumentService,
    UploadService,
  ]
})
export class UserModule {}
