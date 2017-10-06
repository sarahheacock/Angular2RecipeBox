import { Component, EventEmitter, Output } from '@angular/core';
import { EntryService } from '../shared/entry.service';

@Component({
    selector: 'app-modal-button',
    template: 
    `
    <h1>{{(this.name) ? this.name + "'s Recipe Box" : 'Recipe Box'}}</h1>
    <button type="button" class="btn btn-lg btn-primary" (click)="stateChange()">
        Add Recipe
    </button>
    <button type="button" class="btn btn-lg btn-outline-secondary" (click)="stateChange()">
        Login
    </button>
    `
})

export class EntryListButton {
    name: string = '';

    constructor(private entryService: EntryService) {
        this.name = this.entryService.user.name;
    }
  
    stateChange() {
        this.entryService.changeContent("Sign In");
    }
    
}