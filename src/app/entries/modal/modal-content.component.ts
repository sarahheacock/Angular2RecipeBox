import { Component, OnInit, OnDestroy } from '@angular/core';
// import { trigger, state, style, animate, transition } from '@angular/animations';

// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EntryService } from '../shared/entry.service';

//import 'rxjs';

@Component({
  selector: 'app-modal-content',
  template: `<div>{{this.content}}</div>`,
})

export class ContentModal {
  content: string;
  subscription: any;
  
  constructor(private entryService: EntryService) {
    this.content = this.entryService.modalContent;
  }

  ngOnInit() {
    this.subscription = this.entryService.getContent().subscribe(item => this.content=item);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}