import { Component, OnInit, AfterContentInit, Output, EventEmitter, Input } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { Recipe } from '../shared/entry.model';

@Component({
    selector: 'app-entry-list',
    templateUrl: 'entry-list.component.html',
    styleUrls: ['entry-list.component.css']
})

export class EntryListComponent implements OnInit {
    @Output() onEntryLoad = new EventEmitter<string>();
    @Output() onEntryEdit = new EventEmitter<{title:string; data:{
        title:string;
        ingredients:Array<{
            name:string;
            selected:boolean;
        }>;
    }}>();

    @Input() userRecipes: Array<Recipe>;
    entries: any;

    constructor(private entryService: EntryService){}   

    ngOnInit(){
        this.entryService
        .getEntries()
        .then(entries => {
            console.log(entries);
            this.entries = (this.userRecipes.length < 1) ? entries: this.userRecipes.reduce((a, b) => {
                return a;
            }, entries);

            this.onEntryLoad.emit('inactive');
        });
    }

    //ngOnChange

    entryEdit(e){
        this.onEntryEdit.emit(e);
    }
}
