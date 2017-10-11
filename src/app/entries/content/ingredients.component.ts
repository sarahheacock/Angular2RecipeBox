import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EntryService } from '../shared/entry.service';

//declare var gapi: any;

@Component({
    selector: 'app-add-shopping',
    templateUrl: './ingredients.component.html',
    styleUrls: ['./login.component.css']
})

export class AddShopping {
    @Input() ingredients: Array<{name:string; selected:boolean;}>;
    @Input() title: string;

    @ViewChild('commentForm') commentForm: NgForm;

    constructor(private entryService: EntryService) {
    }


    onSubmit(f: NgForm) {
        const result = Object.keys(f.value).reduce((a, b) => {
            if(f.value[b]) a.push(b);
            return a;
        }, []);

        this.entryService.addToList({
            shoppingListNames: this.title,
            shoppingList: result
        });
    }

    close() {
        this.entryService.toggleState();
    }
}