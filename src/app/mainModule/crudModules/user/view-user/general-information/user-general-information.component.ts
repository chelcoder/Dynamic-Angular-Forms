import { Component, ViewEncapsulation, OnInit, EventEmitter, Output, Input, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { User } from "../../../../../_models/user";
import { Upload } from "../../../../../_models/upload";
import { UserService } from "../../../../../_services/user.service";

@Component({
    selector: 'app-user-general-information',
    templateUrl: "./user-general-information.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class UserGeneralInformationComponent implements OnInit {

    public user$: User;
    userGeneralInformationForm : FormGroup;
    inputTypeProperty = 'password';
    @Input() userData?: User;
    @Input() actionType?: any;
    @Output() valid = new EventEmitter();
    @Output() changedValue = new EventEmitter();
    @Input() editValues?:boolean;
    @Output() generalInformationEvent = new EventEmitter();

    @ViewChild('profileImage', { static: false }) profileImage : ElementRef;
    profileImageRemoveButton:boolean = true;
    public selectedFile: File;
    isAdmin:boolean = false;
    outGoingObject = {'file': null,'isAdmin':null};

    constructor(private fb : FormBuilder,
                private userSvc:UserService){

    }

    ngOnInit() {
        if(this.userData){
            this.user$ = this.userData;
        }
        this.createFormControls();

    }
    createFormControls(){
        this.userGeneralInformationForm = this.fb.group({
            fName: ['',Validators.required],
            lName: ['',Validators.required],
            jobTitle: [''],
            email: ['',Validators.required],
            phoneNumber: ['',[Validators.required,Validators.pattern("^[0-9]*$")]],
            address: [''],
            userStatus: [''],
            phoneNumber1: [''],
            information: [''],
            emergencyContact:[''],
            password:['']

        })
        const controls = this.userGeneralInformationForm.controls;
        for (const name in controls) {
            if(this.user$[name])
            {
            controls[name].patchValue(this.user$[name]);
            controls['password'].patchValue("");
            }
            this.userGeneralInformationForm.get(name).valueChanges.subscribe(val=>{
                let changedValueObject = {
                    'name': name,
                    'value': val
                }
                this.changedValue.emit(changedValueObject);
                setTimeout((v)=>{
                    this.valid.emit(this.userGeneralInformationForm.valid);
                })


            })
        }
        setTimeout((v)=>{
            this.valid.emit(this.userGeneralInformationForm.valid);
        })
    }
    public detectFiles(event) {
        this.selectedFile = event.target.files.item(0);
        this.profileImage.nativeElement.innerHTML = this.selectedFile.name;

       this.outGoingObject.file = this.selectedFile;
        this.generalInformationEvent.emit(this.outGoingObject);

    }

    checkValidity()
    {
        for (const name in this.userGeneralInformationForm.controls) {
                this.userGeneralInformationForm.controls[name].markAsTouched();
            }
    }

    isAdminCheck(event) {
        if (event.target.checked) {
            this.isAdmin = true;
        } else {
            this.isAdmin = false;
        }
        this.outGoingObject.isAdmin = this.isAdmin;
        this.generalInformationEvent.emit(this.outGoingObject);
    }
}

