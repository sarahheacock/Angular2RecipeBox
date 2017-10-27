import { Component, OnInit, OnChanges, AfterContentInit, Output, EventEmitter, Input } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { User, Recipe } from '../shared/entry.model';

@Component({
    selector: 'app-entry-list',
    templateUrl: 'entry-list.component.html',
    styleUrls: ['entry-list.component.css']
})

export class EntryListComponent implements OnInit, OnChanges {
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
        if(this.user._id){
            this.entryService.
            getUser(userUrl)
            .then(user => {
                this.init(user)
            });   
        }
        else {
            this.init({
                name: '',
                userID: '',
                shoppingList: [],
                shoppingListNames: [],
                recipes: [],
                _id: '',
                phone: ''
            });
        } 
    }

    init(user: User){
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
    }

    ngOnChanges(e){
        console.log("User", e);

        if(e.user){
            if(e.user.previousValue){
                if(e.user.currentValue.name !== e.user.previousValue.name){
                    const user = e.user.currentValue;
                    const userUrl = `${this.url}/user/${user._id}?token=${user.userID}`;
    
                    if(user.userID){
                        this.add(user.recipes) 
                    }
                    else {
                        this.remove();
                    } 
                }
            }
        }
    }

    remove(){
        this.entries.forEach((entry) => {
            entry.recipes = entry.recipes.filter((recipe) => {
                return recipe.href.includes("http");
            });
        });
    }

    add(recipes: Array<Recipe>){
        const categories = this.entries.map((cat) => {
            return cat.category;
        });

        this.entries = (this.user.recipes.length < 1) ? this.entries: this.user.recipes.reduce((a, b) => {
            if(categories.includes(b.href)) {
                this.entries.forEach((entry) => {
                    if(entry.category === b.href) entry.recipes.push(b);
                });
            }
            return a;
        }, this.entries);
    }

    entryEdit(e){
        this.onEntryEdit.emit(e);
    }
}
