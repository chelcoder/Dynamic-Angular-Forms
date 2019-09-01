import { Component, OnInit, ViewEncapsulation, ElementRef, NgZone, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../../../_services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User, IUser } from '../../../../_models/user';
import { CommonStorageService } from "../../../../_services/common-storage.service";
import { DocumentCategory } from '../../../../_models/documentCategory';
import { DocumentService } from '../../../../_services/document.service';
import { Upload } from '../../../../_models/upload';
import { UserGeneralInformationComponent } from './general-information/user-general-information.component';
import { UserDocumentInformationComponent } from './document-information/user-document-information.component';
import { NotificationsService } from 'angular2-notifications';
import swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment';
import { GlobalVaribale } from '../../../../_services/globals.service';
declare var $:any;
@Component({
    selector: 'app-view-user',
    templateUrl: "./view-user.component.html",
    styleUrls: ['./view-user.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class ViewUserComponent implements OnInit {

    @Input() user?:User;
    @Input() actionType?:string;
    @Input() editButton?:boolean = true;
    @Output() changedModal  = new EventEmitter();
    @ViewChild('docCategory' , { static: false }) documentCategory: ElementRef;
    @ViewChild('fileCategory' , { static: false }) fileCategory: ElementRef;
    @ViewChild('uploadButton' , { static: false }) uploadButton: ElementRef;

    public user$: User = {};
    userList: User[] = [];
    userIndex: number;
    userId:any;
    public documentFile :DocumentCategory;
    addDocumentButton:boolean = true;
    removeFileButton:boolean = true;
    loading: boolean = false;
    uploadedFile:Upload;
    isDriverAdmin:boolean = false;
    totalDocumentFiles:any;
    userSubscriptionExpired:boolean = false;
    indexText:string;

    validators = {
        'general':{
            'valid':false,
            'touched':false
        },
        'training':{
            'valid':false,
            'touched':false
        }
    }

    @ViewChild(UserGeneralInformationComponent , { static: false }) general : UserGeneralInformationComponent;
    @ViewChild(UserDocumentInformationComponent , { static: false }) training : UserDocumentInformationComponent;

    constructor(private ngZone: NgZone,
         private _userSVC: UserService,
         private _commonStorageService: CommonStorageService,
         private _route: ActivatedRoute,
         private _router: Router,
         private _docService : DocumentService,
         private _notificationService:NotificationsService) { }

    ngOnInit() {

        this.userList = this._commonStorageService.listData;
        this.userIndex = this._commonStorageService.selectedValueIndex;
        this.userSubscriptionExpired = JSON.parse(localStorage.getItem(GlobalVaribale.userSubscriptionExpired));
        switch(this.actionType){
            case "view":
                    this.user$ = this.user;
                break;
             case "edit":
                this.user$ = this.user;
                 break;
        }
    }

    ngAfterViewInit(){
        this.modalJquery();
    }
    modalJquery(){
        let self = this;
        setTimeout((v)=>{
            jQuery(".tab_list a").click(function(e){
                e.preventDefault();
                jQuery(".tab_list li").removeClass("active");
                jQuery(this).parents("li").addClass("active");
                var thisID = jQuery(this).attr("tabRouteLink");
                self.indexText =jQuery(this)[0].innerText
                let idStr = thisID.split("#");
                jQuery(".tab_info").hide();
                jQuery("#"+idStr[1]).fadeIn();
                if(self.validators[idStr[1].split('_')[0]])
                {
                self.validators[idStr[1].split('_')[0]].touched = true;
                }
            });
            jQuery(".tab_list>li.active>a").trigger("click");
        })


    }


    checkChildValidity()
    {
        let formValidity = true;
        for (var property in this.validators) {
            this.validators[property].touched = true;
            if (!this.validators[property].valid) {
              this[property].checkValidity();
              formValidity = false;
            }
          }

        if(formValidity)
        {
            // console.log();
            this.loading = true;
            this.submitForm(this.user$);
        }
    }


    submitForm(userData:User)

    // TODO this part needs to be refactored many if else loops are here;

    {
        userData.displayName = userData.fName+" "+userData.lName;
        if(this.actionType != 'edit'){
            userData['userStatus'] = 'active';
            if(this.uploadedFile){
                // console.log("file is there");
                this._userSVC.uploadDocuments(this.uploadedFile,'/drivers/profilePic',(uploaded: Upload)=>{
                    userData.imageName = uploaded.name;
                    userData.profileImageUrl = uploaded.url;
                    if(this.isDriverAdmin == false){
                        // console.log("not a admin driver");
                        this._userSVC.addNewDriver(userData, (data) => {
                            if(this.totalDocumentFiles){
                                let response = JSON.parse(data['_body']);
                                let responseuserId = response["userId"];
                                this.totalDocumentFiles.forEach((file,index)=>{
                                    this._userSVC.addDocument(responseuserId,file,()=>{
                                        this.changedModal.emit();
                                        if(this.totalDocumentFiles.length-1 == index){
                                            this.showNotification("success","Driver Added Successfully");
                                        }
                                    })
                                })
                            }else{
                                this.changedModal.emit();
                                this.showNotification("success","Driver Added Successfully");
                            }

                        },error=>{
                            this.loading = false;
                            swal.fire("Error Found","Email Address Already in use","error");
                        })
                    }else{
                        this._userSVC.addAdminDriver(userData, (data) => {
                            if(this.totalDocumentFiles){
                                let response = JSON.parse(data['_body']);
                                let responseuserId = response["userId"];
                                this.totalDocumentFiles.forEach((file,index)=>{
                                    this._userSVC.addDocument(responseuserId,file,()=>{
                                        this.changedModal.emit();
                                        if(this.totalDocumentFiles.length-1 == index){
                                            this.showNotification("success","Admin Driver Added Successfully");
                                        }
                                    })
                                })
                            }else{
                                this.changedModal.emit();
                                this.showNotification("success","Admin Driver Added Successfully");
                            }

                        },error=>{
                            this.loading = false;
                            swal.fire("Error Found","Email Address Already in use","error");

                        });
                    }
                })
            }else{
                userData.profileImageUrl = "https://www.netfort.com/assets/user.png";
                if(this.isDriverAdmin == false){
                    this._userSVC.addNewDriver(userData, (data) => {
                        if(this.totalDocumentFiles){
                            let response = JSON.parse(data['_body']);
                            let responseuserId = response["userId"];
                            this.totalDocumentFiles.forEach((file,index)=>{
                                this._userSVC.addDocument(responseuserId,file,()=>{
                                    this.changedModal.emit();
                                    if(this.totalDocumentFiles.length-1 == index){
                                        this.showNotification("success","Driver Added Successfully");
                                    }
                                })
                            })
                        }else{

                            this.changedModal.emit();
                            this.showNotification("success","Driver Added Successfully");
                        }

                    },error=>{
                        this.loading = false;
                        swal.fire("Error Found","Email Address Already in use","error");
                    })
                }else{
                    this._userSVC.addAdminDriver(userData, (data) => {
                        if(this.totalDocumentFiles){
                            let response = JSON.parse(data['_body']);
                            let responseuserId = response["userId"];
                            this.totalDocumentFiles.forEach((file,index)=>{
                                this._userSVC.addDocument(responseuserId,file,()=>{
                                    this.changedModal.emit();
                                    if(this.totalDocumentFiles.length-1 == index){
                                        this.showNotification("success","Admin Driver Added Successfully");
                                    }
                                })
                            })
                        }else{
                            this.changedModal.emit();
                            this.showNotification("success","Admin Driver Added Successfully");
                        }



                    },error=>{
                        this.loading = false;
                        swal.fire("Error Found","Email Address Already in use","error");
                    });
                }

            }
        }else{
            Reflect.ownKeys(userData).forEach(
                property=>{
                    if(!userData[property])
                    {
                        delete userData[property]
                    }
                }
            )
            if(this.uploadedFile){
                this._userSVC.uploadDocuments(this.uploadedFile,'/drivers/profilePic',(uploaded: Upload)=>{
                    userData.imageName = uploaded.name;
                    userData.profileImageUrl = uploaded.url;
                    this._userSVC.updateDriver(userData.$key, userData, () => {
                        if(this.totalDocumentFiles){
                            this.totalDocumentFiles.forEach((file,fileIndex)=>{
                                this._userSVC.addDocument(userData.$key,file,()=>{
                                });
                                if(this.totalDocumentFiles.length-1 == fileIndex){
                                    this.changedModal.emit();
                                    this.showNotification("success","Driver Updated Successfully");
                                }
                            })
                        }else{
                            this.changedModal.emit();
                            this.showNotification("success","Driver Updated Successfully");
                        }
                    });
                })

            }else{
                this._userSVC.updateDriver(userData.$key, userData, () => {
                    if(this.totalDocumentFiles){
                        this.totalDocumentFiles.forEach((file,fileIndex)=>{
                            this._userSVC.addDocument(userData.$key,file,()=>{
                                console.log("documents added successfully");
                            });
                            if(this.totalDocumentFiles.length-1 == fileIndex){
                                this.changedModal.emit();
                                this.showNotification("success","Driver Updated Successfully");
                            }
                        })
                    }else{
                        this.changedModal.emit();
                        this.showNotification("success","Driver Updated Successfully");
                    }
                });
            }
        }
    }
    editValues(){
        this.actionType = 'edit';
    }
    private showNotification(type,message){
        switch(type){
            case 'error':
                    this._notificationService.error(message,null, {
                        timeOut: 3000,
                        showProgressBar: true,
                        pauseOnHover: true,
                        clickToClose: true
                    });
            break;
            case 'success':
                    this._notificationService.success(message,null, {
                        timeOut: 2000,
                        showProgressBar: true,
                        pauseOnHover: true,
                        clickToClose: true
                    });
            break;
        }

    }


    removeFile(){
        this.fileCategory.nativeElement.innerText = "Choose File";
        this._docService.deleteFileStorageDocument(this.documentFile.fileName).then(v=>{
        });
        this.addDocumentButton = true;
        this.removeFileButton = true

    }

    onListJobChange(event){
        this.changedModal.emit(event);
    }

    getGeneralInformationEvent(event){
        if(event.file){
            this.uploadedFile  = new Upload(event['file']);
        }else{
            this.uploadedFile = null;
        }
        this.isDriverAdmin = event['isAdmin'];

    }
    getDriverDocumentFiles(event){
        this.totalDocumentFiles = event;
    }
    changeDriverStatus(user){
        let userId = user.$key;
        let userDetails : IUser ={ }
        userDetails.userStatus = "inactive";
        this._userSVC.updateDriver(userId, userDetails, () => {
            this.changedModal.emit();
        });
    }
    enlargeImage(event,action){

        let imageElement =event.srcElement;
        if(action == 'open'){
            var $src = $(imageElement).attr("src");
            $(".show_image").fadeIn();
            $(".img-show img").attr("src", $src);
        }else{
            $(".show_image").fadeOut();
        }

}

}
