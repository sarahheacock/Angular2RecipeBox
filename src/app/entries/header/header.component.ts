import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { EntryService } from '../shared/entry.service';

//declare var gapi: any;

@Component({
    selector: 'app-header',
    template: 
    `
    <h1>Recipe Box</h1>
    <button type="button" class="btn btn-lg btn-primary" (click)="stateChange()">
        Add Recipe
    </button>
    <button type="button" class="btn btn-lg btn-outline-secondary" (click)="stateChange()">
        {{(!this.name) ? 'Login' : 'Logout'}}
    </button>
    
    `
})

export class HeaderContent {
    name: string = '';
    //auth2: any;
    subscription: any;

    constructor(private entryService: EntryService) {
        this.name = this.entryService.user.name;
    }

    ngOnInit() {
        this.subscription = this.entryService.getUser().subscribe(item => this.name=item.name);
    }

    ngAfterViewInit() {
        //this.auth2 = gapi.auth2.getAuthInstance();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
  
    stateChange() {
        this.entryService.changeContent("Sign In");
    }
}