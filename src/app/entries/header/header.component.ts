import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { EntryService } from '../shared/entry.service';

//declare var gapi: any;

@Component({
    selector: 'app-header',
    templateUrl: "header.component.html",
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

  
    stateChange(str){
        console.log(str);
        this.entryService.changeContent({
            title: str,
            data: this.name
        });
    }
}