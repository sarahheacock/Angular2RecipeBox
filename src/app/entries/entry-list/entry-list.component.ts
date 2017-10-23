import { Component, OnInit, AfterContentInit, Output, EventEmitter, Input } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { User, Recipe } from '../shared/entry.model';

@Component({
    selector: 'app-entry-list',
    templateUrl: 'entry-list.component.html',
    styleUrls: ['entry-list.component.css']
})

export class EntryListComponent implements OnInit {
    @Output() onEntryLoad = new EventEmitter<{
        options:Array<string>;
        user:User;
    }>();
    @Output() onEntryEdit = new EventEmitter<{title:string; data:{
        title:string;
        ingredients:Array<{
            name:string;
            selected:boolean;
        }>;
    }}>();
    //@Output() createCategories = new EventEmitter<Array<string>>();

    // @Input() userRecipes: Array<Recipe>;
    // @Input() userName: string;
    @Input() user: User;
    entries: any;
    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";

    constructor(private entryService: EntryService){}   

    ngOnInit(){
        const userUrl = `${this.url}/user/${this.user._id}?token=${this.user.userID}`;

        //NEED TO CHANGE SO THAT UNDEFINED URL DOES NOT FETCH
        this.entryService.
        getUser(userUrl)
        .then(user => {
            this.entryService
            .getEntries()
            .then(entries => {
                console.log(entries);
                const categories = entries.map((cat) => {
                    return cat.category;
                });
    
                this.entries = (this.user.recipes.length < 1) ? entries: this.user.recipes.reduce((a, b) => {
                    if(categories.includes(b.href)) {
                        entries.forEach((entry) => {
                            if(entry.category === b.href) entry.recipes.push(b);
                        });
                    }
                    return a;
                }, entries);
    
                this.onEntryLoad.emit({
                    options: categories, 
                    user: user
                });
            });
        });

        
    }

    //ngOnChange

    entryEdit(e){
        this.onEntryEdit.emit(e);
    }
}
