import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { EntryService } from '../shared/entry.service';

//declare var gapi: any;

@Component({
    selector: 'app-header',
    template: 
    `
    <header>
        <div class="header-content">
            <h1>{{(this.name) ? this.name + "'s Recipe Box" : "Recipe Box"}}</h1>
            <span [ngSwitch]="name">
                <ng-container *ngSwitchCase="''">
                    <button type="button" class="btn btn-lg btn-primary" (click)="stateChange($event)"  name="Sign In">
                        Login <i class="fa fa-sign-in" aria-hidden="true"></i>
                    </button>
                </ng-container>
                <ng-container *ngSwitchDefault>
                    <button type="button" class="btn btn-lg btn-outline-danger" (click)="stateChange($event)"  name="Logout">
                        Logout <i class="fa fa-sign-out" aria-hidden="true"></i>
                    </button>
                </ng-container>
            </span>
            <button type="button" class='btn btn-lg btn-outline-primary' (click)="stateChange($event)" name="Add Recipe">
                Add Recipe <i class="fa fa-plus-circle" aria-hidden="true"></i>
            </button>
            <button type="button" class="btn btn-lg btn-outline-secondary" (click)="stateChange($event)" name="Text Shopping List">
                Text Shopping List <b>( {{this.length}} )</b>
            </button>
        </div>
    </header>
    `,
    styleUrls: ["header.component.css"]
})

export class HeaderContent {
    name: string = '';
    length: number = 0;
    //auth2: any;
    subscription: any;

    constructor(private entryService: EntryService) {
        this.name = this.entryService.user.name;
        this.length = this.entryService.user.shoppingList.length;
    }

    ngOnInit() {
        this.subscription = this.entryService.getUser().subscribe(item => {
            this.name = item.name;
            this.length = item.shoppingList.length;
        });
    }

    ngAfterViewInit() {
        //this.auth2 = gapi.auth2.getAuthInstance();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    // formChange(e){
    //     console.log(e.target.name);
    //     this.entryService.changeContent(e.target.name);
    // }
  
    stateChange(e){
        console.log(e.target.name);
        this.entryService.changeContent({
            title: e.target.name,
            data: this.name
        });
        //this.entryService.changeContent("Sign In");
    }
}