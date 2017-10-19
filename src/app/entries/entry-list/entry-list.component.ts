import { Component, OnInit, AfterContentInit, Output, EventEmitter, Input } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { Recipe } from '../shared/entry.model';

@Component({
    selector: 'app-entry-list',
    templateUrl: 'entry-list.component.html',
    styleUrls: ['entry-list.component.css']
})

export class EntryListComponent implements OnInit {
    @Output() onEntryLoad = new EventEmitter<Array<string>>();
    @Output() onEntryEdit = new EventEmitter<{title:string; data:{
        title:string;
        ingredients:Array<{
            name:string;
            selected:boolean;
        }>;
    }}>();
    //@Output() createCategories = new EventEmitter<Array<string>>();

    @Input() userRecipes: Array<Recipe>;
    @Input() userName: string;
    entries: any;

    constructor(private entryService: EntryService){}   

    ngOnInit(){
        this.entryService
        .getEntries()
        .then(entries => {
            console.log(entries);
            const categories = entries.map((cat) => {
                return cat.category;
            });

            this.entries = (this.userRecipes.length < 1) ? entries: this.userRecipes.reduce((a, b) => {
                if(categories.includes(b.href)) {
                    entries.forEach((entry) => {
                        if(entry.category === b.href) entry.recipes.push(b);
                    });
                }
                return a;
            }, entries);

            this.onEntryLoad.emit(categories);
        });
    }

    //ngOnChange

    entryEdit(e){
        this.onEntryEdit.emit(e);
    }
}
