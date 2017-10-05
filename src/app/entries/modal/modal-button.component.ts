import { Component, EventEmitter, Output } from '@angular/core';
import { EntryService } from '../shared/entry.service';

@Component({
    selector: 'app-modal-button',
    template: `
    <button type="button" class="btn btn-lg btn-outline-primary" (click)="stateChange()">
        Add Recipe
    </button>
    `,
    //providers: [EntryService]
})

export class EntryListButton {
    //@Output() onStateChange: EventEmitter<any> = new EventEmitter();   
    
    constructor(private entryService: EntryService) {}
  
    stateChange() {
        this.entryService.changeContent("Sign In");
        //this.onStateChange.emit(this.entryService.modalShown);
    }
}