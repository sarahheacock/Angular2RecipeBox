import { Component, OnDestroy, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { EntryService } from '../shared/entry.service';
import { User } from '../shared/entry.model';

//import 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: 'modal.component.html',
  styleUrls: ['modal.component.css'],
  animations: [
    trigger('showModal', [
      state('inactive', style({
        display: 'none',
        top: '-600px',
        opacity: '0'
      })),
      state('active', style({
        display: 'relative',
        top: '0px',
        opacity: '1'
      })),
      transition('inactive <=> active', animate('500ms ease-out'))
    ])
  ]
})

export class EntryListModal implements OnChanges{
  modalShown: string;
  //@Output() onToggle = new EventEmitter<any>();
  @Output() updateUser = new EventEmitter<any>();
  @Output() onEntryEdit = new EventEmitter<{ title:string; data:any }>();

  //@Input() modalShown: string;
  @Input() modalContent: { title:string; data:any; };
  @Input() user: any;
  @Input() options: Array<string>;
  //subscription: any;
  
  constructor() {}

  // ngOnInit(){
  //   this.modalShown = (this.modalContent.title) ? 'active': "inactive";
  // }

  ngOnChanges(e) {
    console.log("E", e);
    if(e.modalContent){
      this.modalShown = (this.modalContent.title) ? 'active': "inactive";
    }
  }

  stateChange(e) {
    this.onEntryEdit.emit({
      title: '',
      data: null
    });
  }
  
  userChange(e) {
    this.updateUser.emit(e);
  }

  modalChange(e) {
    this.onEntryEdit.emit(e);
  }
}


