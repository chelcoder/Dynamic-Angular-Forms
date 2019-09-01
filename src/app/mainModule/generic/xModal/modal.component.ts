import { ModalOptions } from './modal-options';
import { Component, OnInit, OnChanges, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'modal-component',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  inputs: ['toggle']
})
export class ModalComponent implements OnInit {
  private toggle: EventEmitter<any>;

  @Input() styles:string;
  @Input() removeHeader:boolean;
  @Input() options: ModalOptions = new ModalOptions();
  @Output() onModalClose = new EventEmitter<any>();

  public showId: string;
  public hideId: string;
  public modalId: string;

  constructor() {
    this.showId = this.randomId();
    this.hideId = this.randomId();
    this.modalId = this.randomId();

  }

  ngOnInit() {
    if(!this.removeHeader)
    {
      this.removeHeader = false;
    }
    this.toggle.subscribe(e => {
      if (e.toLowerCase() === 'show') {
        document.getElementById(this.showId).click();
      } else if (e.toLowerCase() === 'hide') {
        document.getElementById(this.hideId).click();
      }
      // console.log(this.showId,this.hideId,this.modalId);
      //document.getElementById(this.id).click();
    })
  }


  private randomId() {
    let length = 5;
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  xClicked() {
    // document.getElementById(this.hideId).click();
    
    this.onModalClose.emit("hide");
  }
}