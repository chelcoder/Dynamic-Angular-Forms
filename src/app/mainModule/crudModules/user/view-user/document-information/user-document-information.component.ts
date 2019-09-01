import {
  OnInit,
  Component,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from "@angular/core";
import { User } from "../../../../../_models/user";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Upload } from "../../../../../_models/upload";
import { DocumentCategory } from "../../../../../_models/documentCategory";
import { UserService } from "../../../../../_services/user.service";
import { DocumentService } from "../../../../../_services/document.service";
import * as _ from "lodash";
@Component({
  selector: "app-user-document-information",
  templateUrl: "./user-document-information.component.html",
  encapsulation: ViewEncapsulation.None
})
export class UserDocumentInformationComponent implements OnInit {
  public user$: User;
  documentInformationForm: FormGroup;

  @Input() userData?: User;
  @Output() valid = new EventEmitter();
  @Output() changedValue = new EventEmitter();
  @Input() editValues?: boolean;
  @Output() userDocumentFiles = new EventEmitter();

  @ViewChild("licenseFileLabel", { static: false })
  licenseFileLabel: ElementRef;
  @ViewChild("licenseMedicalFileLabel", { static: false })
  licenseMedicalFileLabel: ElementRef;
  @ViewChild("licenseFileUploadText", { static: false })
  licenseFileUploadText: ElementRef;
  @ViewChild("licenseMedicalFileUploadText", { static: false })
  licenseMedicalFileUploadText: ElementRef;

  licenseRemoveButton: Boolean = true;
  licenseMedicalRemoveButton: Boolean = true;
  licenseFileUploadButton: boolean = true;
  licenseMedicalFileUploadButton: boolean = true;
  public licenseFile: File;
  public licenseMedicalFile: File;
  public licenseFileUpload: Upload;
  public licenseMedicalFileUpload: Upload;
  public documentFile: DocumentCategory;

  public totalFiles = [];
  public temptotalFiles = [];

  licenseLoading: boolean = false;
  MRWAHVALoading: boolean = false;
  LicenseMedicalLoading: boolean = false;
  fatigueFileLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _userSvc: UserService,
    private _documentSvc: DocumentService
  ) {}

  ngOnInit() {
    if (this.userData) {
      this.user$ = this.userData;
    }
    this.createFormControls();
  }
  createFormControls() {
    this.documentInformationForm = this.fb.group({
      licenceNumber: [""],
      licenceClass: [""],
      licenceIssueDate: [""],
      licenceExpDate: [""],
      LME: ["", Validators.required],
    });
    const controls = this.documentInformationForm.controls;
    for (const name in controls) {
      if (this.user$[name]) {
        controls[name].patchValue(this.user$[name]);
      }
      this.documentInformationForm
        .get(name)
        .valueChanges.subscribe(val => {
          let changedValueObject = {
            name: name,
            value: val
          };
          this.changedValue.emit(changedValueObject);
          setTimeout(v => {
            this.valid.emit(this.documentInformationForm.valid);
          });
        });
    }
    setTimeout(v => {
      this.valid.emit(this.documentInformationForm.valid);
    });
  }
  public detectLiscenseFile(event, id?) {
    this.licenseLoading = true;
    this.licenseFileUploadButton = false;
    this.licenseFile = event.target.files.item(0);
    this.licenseFileUpload = new Upload(this.licenseFile);
    let docCategory = "License File";
    this.documentFile = new DocumentCategory(this.licenseFileUpload.file);
    this.documentFile.category = docCategory;
    this.uploadDocument(this.licenseFileUpload, docCategory);
    this.licenseRemoveButton = false;
    this.licenseFileLabel.nativeElement.innerText = this.documentFile.name;
  }


  public detectLicenseMedicalFile(event) {
    this.LicenseMedicalLoading = true;
    this.licenseMedicalFileUploadButton = false;
    this.licenseMedicalFile = event.target.files.item(0);
    this.licenseMedicalFileUpload = new Upload(this.licenseMedicalFile);
    this.documentFile = new DocumentCategory(
      this.licenseMedicalFileUpload.file
    );
    let docCategory = "License Medical File";
    this.documentFile.category = docCategory;
    this.uploadDocument(this.licenseMedicalFileUpload, docCategory);
    this.licenseMedicalRemoveButton = false;
    this.licenseMedicalFileLabel.nativeElement.innerText = this.documentFile.name;
  }



  uploadDocument(details, category) {
    this._userSvc.uploadDocuments(
      details,
      "drivers/documents",
      (documents: Upload) => {
        this.documentFile.url = documents.url;
        this.documentFile.fileName = documents.name;
        console.info("document uploaded sucessfully");
        this.licenseFileUploadText.nativeElement.innerHTML = "Uploaded";
        this.licenseMedicalFileUploadText.nativeElement.innerHTML = "Uploaded";
        this.licenseLoading = false;
        this.MRWAHVALoading = false;
        this.LicenseMedicalLoading = false;
        this.fatigueFileLoading = false;
        this.userDocumentFiles.emit(this.totalFiles);
      }
    );

    this.totalFiles.push(this.documentFile);
    this.temptotalFiles = this.totalFiles;
  }

  public removeFile(event, id) {
    let fileNames;
    let delBoolean: Boolean = false;
    switch (id) {
      case "license":
        this.licenseRemoveButton = true;
        this.licenseFileLabel.nativeElement.innerText = "Choose File";
        this.licenseFileUploadButton = true;
        break;
      case "licenseMedicalDocument":
        this.licenseMedicalRemoveButton = true;
        this.licenseMedicalFileLabel.nativeElement.innerText = "Choose File";
        this.licenseMedicalFileUploadButton = true;
        break;
    }
    this.totalFiles = _.remove(this.totalFiles, function(n) {
      fileNames = n.fileName;
      delBoolean = true;
      return n.category != event;
    });
    if (delBoolean == true) {
      this._documentSvc
        .deleteFileStorageDocument(fileNames)
        .then(v => {})
        .then(v1 => {
          this.userDocumentFiles.emit(this.totalFiles);
        });
    }
  }

  checkValidity() {
    for (const name in this.documentInformationForm.controls) {
      this.documentInformationForm.controls[name].markAsTouched();
    }
  }
}
