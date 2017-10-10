import { Component, Input, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { EntryService } from '../shared/entry.service';

//declare var gapi: any;

@Component({
    selector: 'app-add-shopping',
    templateUrl: './ingredients.component.html'
})

export class AddShopping {
    @Input() ingredients: any;
    //subscription: any;

    //TAKE OUT ENTRY SERVICE
    constructor() {
        console.log(this.ingredients);
        //else this.ingredients = [];
    }

    // ngOnInit() {
    //     this.subscription = this.entryService.getContent().subscribe(item => {
    //         const arr = item.data;
    //         console.log(arr);

    //         if(Array.isArray(arr)) this.ingredients = arr;
    //         //else this.ingredients = [];
    //     });
    // }


    // ngOnDestroy() {
    //     this.subscription.unsubscribe();
    // }
}