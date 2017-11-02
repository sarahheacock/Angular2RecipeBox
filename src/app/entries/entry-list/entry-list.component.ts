import { Component, OnInit, OnChanges, AfterContentInit, Output, EventEmitter, Input, NgZone } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { User, Recipe } from '../shared/entry.model';

@Component({
    selector: 'app-entry-list',
    templateUrl: 'entry-list.component.html',
    styleUrls: ['entry-list.component.css']
})

export class EntryListComponent implements OnInit, OnChanges {
    @Output() updateModal = new EventEmitter<{
        title:string;
        data:any;
    }>();
    @Output() updateUser = new EventEmitter<any>();

    @Input() user: User;
    @Input() modalContent: {
        title:string; 
        data:any;
    }

    entries: any;
    options: Array<string>;

    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";
    constructor(private entryService: EntryService, private ngZone: NgZone){}   

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
                phone: []
            });
        } 
    }

    init(user: User){
        this.entryService
        .getEntries()
        .then(entries => {
            //get category options for adding recipes
            this.options = entries.map((cat) => {
                return cat.category;
            });

            //combine user and api recipes
            this.entries = (this.user.recipes.length < 1) ? entries: this.user.recipes.reduce((a, b) => {
                if(this.options.includes(b.href)) {
                    entries.forEach((entry) => {
                        if(entry.category === b.href) entry.recipes.push(b);
                    });
                }
                return a;
            }, entries);

            this.toggle();
            //this.updateUser.emit(user);
        });
    }

    ngOnChanges(e){
        console.log("User", e);
    }


    entryEdit(e){
        this.updateModal.emit(e);
    }

    userEdit(user){
        const title = this.modalContent.title;
        if(title === "Sign In"){
            console.log('SIGN IN');
            this.addAll(user.recipes);
        }
        else if(title === "Logout"){
            console.log('LOGOUT');
            this.remove();
        }
        else if(title === "Add Recipe"){
            console.log('ADD RECIPE');
            const newRecipe = user.recipes.reduce((a, b) => {
                if(!this.user.recipes.includes(b)) return b;
                else return a;
            }, {});

            this.add(newRecipe);
        }
        else if(title === "Delete Recipe"){
            console.log('DELETE');
            this.delete(this.modalContent.data.category, this.modalContent.data._id);
        } 
        else if(title === "Edit Recipe"){
            console.log('EDIT RECIPE', this.user.recipes);
            user.recipes.forEach((recipe) => {
                if(recipe._id === this.modalContent.data._id){
                    if(recipe.href !== this.modalContent.data.href){
                        this.move(recipe, this.modalContent.data.href);
                    }
                    else{
                        this.edit(recipe);
                    }
                }
            });
        }
        this.updateUser.emit(user);
        this.toggle();
    }


    remove(){
        this.entries.forEach((entry, i) => {
            entry.recipes = entry.recipes.filter((recipe) => {
                return recipe.href.includes("http");
            });
        });
    }

    //user sign in
    addAll(recipes: Array<Recipe>){
        recipes.forEach((recipe) => {
            this.add(recipe);
        });
    }

    //user add recipe or sign in
    add(recipe: Recipe){
        this.entries.forEach((entry) => {
            if(entry.category === recipe.href){
                entry.recipes.push(recipe);
                //this.toggle();
            } 
        });
    }

    //user delete recipe
    delete(category:string, id:string){
        this.entries.forEach((entry) => {
            if(entry.category === category){
                // let index;
                entry.recipes.forEach((recipe, i) => {
                    if(recipe._id === id){
                        entry.recipes.splice(i, 1);
                    } 
                });
                console.log(entry.recipes);
            }
        });
    }

    //user edit recipe and NOT change categories
    edit(recipe: Recipe){
        console.log(recipe);
        this.entries.forEach((entry) => {
            //console.log(moved);
            if(entry.category === recipe.href){
                entry.recipes.forEach((record, i) => {
                    if(record._id === recipe._id){
                        entry.recipes.splice(i, 1, recipe);
                        //this.toggle();
                    } 
                });
            } 
        });
    }

    //user edit recipe and change categories
    move(recipe: Recipe, cat: string){
        this.entries.forEach((entry) => {
            //console.log(moved);
            if(entry.category === recipe.href){ //push to new
                entry.recipes.push(recipe);
            }
            else if(entry.category === cat){ //remove from old
                entry.recipes.forEach((record, i) => {
                    if(record._id === recipe._id){
                        entry.recipes.splice(i, 1);
                        //this.toggle();
                    } 
                });
            }
        });
    }

    //get rid of modal
    toggle(){
        //TOGGLE DOES NOT APPEAR TO WORK UNLESS ANOTHER ENTRY IS INSERTED
        if(this.modalContent.title){            
            this.updateModal.emit({
                title: '',
                data: null
            })
        }
    }
}
