import { Component, OnInit } from '@angular/core';
import 'rxjs/add/observable/fromEvent';
import { User } from '../../../_models/user';
import { ChatMessage } from '../../../_models/message';
import { UserService } from '../../../_services/user.service';
import { ChatService } from '../../../_services/chat.service';
@Component({
    selector: 'app-chat',
    templateUrl: "./chat.component.html",
    styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {

    drivers$: User[] = [];
    tempDrivers$: User[] = [];
    originalDrivers$: User[] = [];
    selectedDriver: User;
    constructor(private _driverService: UserService, private _chatService: ChatService) { }
    messageText: string;
    chatMessages: ChatMessage[] = [];

    ngOnInit() {

        this._driverService.getUser().then(newDrivers => {
            this.drivers$ = newDrivers.map(driver => new User(driver));
            this.drivers$ = this.drivers$.sort(function(a, b) {
                return (b.lastMessageTime.getTime()) - (a.lastMessageTime.getTime());
            });
            this.tempDrivers$ = this.drivers$;
        });

    }

    ngAfterViewInit() {

    }


    selectDriver(driver) {
        this.selectedDriver = driver;
        this._chatService.getMessages(this.selectedDriver.$key).subscribe(
            v => {
                v.forEach(msg=>{
                    var tempMsg:any = {...msg};
                    msg.time = tempMsg['time'].toDate() 
                })
                this.chatMessages = v.sort(function(a, b) {
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.

                    return (a.time.getTime()) - (b.time.getTime());
                })

            }
        );

    }


    sendMessage() {
        if (this.messageText.trim().length != 0) {
            let message: any = {};
            message.admin = true;
            message.message = this.messageText;
            message.time = new Date();
            if (this.selectedDriver) {
                this._chatService.addMessage(message, this.selectedDriver.$key, () => {
                    this.messageText = '';
                    this.drivers$.forEach(
                        v => {
                            if (v.$key == this.selectedDriver.$key) {
                                v.lastMessage = message.message;
                                v.lastMessageTime = message.time;
                            }
                        }
                    )
                    this.drivers$ = this.drivers$.sort(function(a, b) {
                        return (b.lastMessageTime.getTime()) - (a.lastMessageTime.getTime());
                    })
                })
            }
            else {
                this.drivers$.forEach(
                    (v, index) => {
                        this._chatService.addMessage(message, v.$key, () => {
                            v.lastMessage = message;
                            if (index == (this.drivers$.length - 1)) {
                                this.messageText = '';
                            }
                        })
                    }
                )
            }
        }


    }


    searchData(searchData) {
        this.drivers$ = this.tempDrivers$;
        this.drivers$ = this.drivers$.filter(
            v => {
                return v.displayName.toLowerCase().indexOf(searchData.toLowerCase()) !== -1;

            }
        );
    }

    selectAll() {
        this.selectedDriver = null;
    }


}
