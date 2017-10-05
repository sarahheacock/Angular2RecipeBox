import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EntryService } from '../shared/entry.service';

//import 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: 'modal.component.html',
  styleUrls: ['modal.component.css'],
  animations: [
    trigger('showModal', [
      state('inactive', style({
        display: 'none',
        top: '-600px'
      })),
      state('active', style({
        display: 'block',
        top: '0px'
      })),
      transition('inactive <=> active', animate('500ms ease-out'))
    ])
  ]
})

export class EntryListModal {
  modalShown: string;
  subscription: any;
  
  constructor(private entryService: EntryService) {
    this.modalShown = this.entryService.modalShown;
  }

  ngOnInit() {
    this.subscription = this.entryService.getState().subscribe(item => this.modalShown=item);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  stateChange() {
    this.entryService.toggleState();
  }
}


