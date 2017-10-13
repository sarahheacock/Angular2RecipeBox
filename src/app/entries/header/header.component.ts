import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { User } from '../shared/entry.model';

//declare var gapi: any;

@Component({
    selector: 'app-header',
    templateUrl: "header.component.html",
    styleUrls: ["header.component.css"]
})

export class HeaderContent {
    //name: string = '';
    length: number = 0;
    //cart: Array<string> = [];
    //auth2: any;
    subscription: any;
    user: User;
   // recipes: Array<string> = [];

    constructor(private entryService: EntryService) {
        this.format(this.entryService.user);
        
    }

    ngOnInit() {
        this.subscription = this.entryService.getUser().subscribe(item => {
            this.format(item);
        });
        // this.entryService.initG();
    }

    format(item){
        //this.name = item.name;
        this.length = item.shoppingList.length;
        this.user = item
    }

    ngAfterViewInit() {
        //this.auth2 = gapi.auth2.getAuthInstance();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

  
    stateChange(str){
        console.log(str);
        const data = (str.includes("Text")) ? {
            title: this.user.shoppingListNames.join(', '),
            ingredients: this.user.shoppingList,
            phone: this.user.phone
        } : this.user.name;

        this.entryService.changeContent({
            title: str,
            data: data
        });
    }
}