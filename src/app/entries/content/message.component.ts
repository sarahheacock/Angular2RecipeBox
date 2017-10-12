import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EntryService } from '../shared/entry.service';

//declare var gapi: any;

@Component({
    selector: 'app-text-shopping',
    //template: `<div></div>`,
    templateUrl: './ingredients.component.html',
    styleUrls: ['./content.component.css']
})

export class TextShopping {
    message: boolean = true;

    @Input() ingredients: Array<{name:string; selected:boolean;}>;
    @Input() title: string;
    @Input() phone: string;

    @ViewChild('commentForm') commentForm: NgForm;


    constructor(private entryService: EntryService) {}


    onSubmit(f: NgForm) {
        const result = Object.keys(f.value).reduce((a, b) => {
            if(f.value[b] && b !== "phone") a.push(b);
            return a;
        }, []);

        // console.log({
        //     shoppingListNames: this.title,
        //     shoppingList: result,
        //     phone: f.value["phone"]
        // });

        this.entryService.sendMessage({
            shoppingListNames: this.title,
            shoppingList: result,
            phone: f.value["phone"]
        });
    }

    close() {
        this.entryService.toggleState();
    }
}