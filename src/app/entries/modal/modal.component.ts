import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter } from '@angular/core';
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

export class EntryListModal {
  @Output() onToggle = new EventEmitter<string>();
  @Output() updateUser = new EventEmitter<User>();

  @Input() modalShown: string;
  @Input() modalContent: { title:string; data:any; };
  @Input() user: User;
  //subscription: any;
  
  constructor() {}

  ngOnChanges(e) {
    console.log("E", e);
  }

  stateChange(e: string) {
    this.onToggle.emit(e);
  }
  
  userChange(e: User) {
    this.updateUser.emit(e);
  }
}


