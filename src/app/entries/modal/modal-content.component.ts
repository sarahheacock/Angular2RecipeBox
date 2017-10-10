import { Component, OnInit, OnDestroy } from '@angular/core';
import { EntryService } from '../shared/entry.service';


@Component({
  selector: 'app-modal-content',
  templateUrl: 'modal-content.component.html'
})

export class ContentModal {
  show: boolean = true;
  hide: any[] = ["Loading", "Logout", "Sign In"];
  content: string;
  data: any;
  subscription: any;
  
  constructor(private entryService: EntryService) {
    const modal = this.entryService.modalContent;
    this.content = modal.title;
    this.data = modal.data;
    this.show = !this.hide.includes(modal.title);
    console.log(this.content, this.show);
  }

  ngOnInit() {
    this.subscription = this.entryService.getContent().subscribe(item => {
      this.content = item.title;
      this.data = item.data;
      this.show = !this.hide.includes(item.title);
      console.log("onInit", this.content, this.show);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  stateChange() {
    this.entryService.toggleState();
  }
}