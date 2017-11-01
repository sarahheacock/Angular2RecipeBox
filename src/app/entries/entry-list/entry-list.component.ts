import { Component, OnInit, OnChanges, AfterContentInit, Output, EventEmitter, Input, NgZone } from '@angular/core';
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
    @Output() onEntryEdit = new EventEmitter<{title:string; data:any;}>();

    @Input() user: User;
    @Input() modalContent: {
        title:string; data:any;
    }
    entries: any;
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
                const previous = e.user.previousValue.recipes || [];
                const current = e.user.currentValue.recipes || [];

                if(e.user.currentValue.name !== e.user.previousValue.name){
                    console.log("SIGN IN");
                    const user = e.user.currentValue;
                    //const userUrl = `${this.url}/user/${user._id}?token=${user.userID}`;
    
                    if(user.userID){
                        this.addAll(user.recipes) 
                    }
                    else {
                        this.remove();
                        // this.ngZone.runOutsideAngular(() => {
                        //     this.remove(() => {
                        //         this.ngZone.run(() => {
                        //             console.log("ngZone");
                        //             this.toggle();
                        //         });
                        //     });
                        // });
                        
                    } 
                }
                else if(e.user.currentValue.recipes.length > e.user.previousValue.recipes.length){
                    //find new one
                    console.log("ADD");
                    const newRecipe = current.reduce((a, b) => {
                        if(!previous.includes(b)) return b;
                        else return a;
                    }, {});

                    this.add(newRecipe);
                }
                else if(e.user.currentValue.recipes.length < e.user.previousValue.recipes.length){
                    //find old
                    console.log('DELETE');
                    this.delete(this.modalContent.data.category, this.modalContent.data._id);
                }
                else if(this.modalContent.title === 'Edit Recipe'){
                    console.log('EDIT');
                    //find edited recipe
                    this.user.recipes.forEach((recipe) => {
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
                this.toggle();
            }
        }
    }

    //user sign out
    // remove(doneCallback: () => void){
    //     this.entries.forEach((entry, i) => {
    //         entry.recipes = entry.recipes.filter((recipe) => {
    //             return recipe.href.includes("http");
    //         });
    //         //this.toggle();
    //         if(i === this.entries.length - 1) doneCallback();
    //     });
    // }
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
        //console.log(recipe);

        this.entries.forEach((entry) => {
            if(entry.category === category){
                // let index;
                entry.recipes.forEach((recipe, i) => {
                    if(recipe._id === id){
                        //entry.recipes = entry.recipes.slice(0, i).concat(entry.recipes.slice(i + 1));
                        //entry.recipes.splice(i, 1, {...recipe});
                        entry.recipes.splice(i, 1);
                        
                        // index = i
                        //this.toggle();
                    } 
                });

                // const arr1 = entry.recipes.slice(0, index);
                // const arr2 = entry.recipes.slice(index + 1);
                // entry.recipes = arr1.concat(arr2);

                console.log(entry.recipes);
            }
        });
    }

    //user edit recipe and NOT change categories
    edit(recipe: Recipe){
        //console.log(recipe);
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
        //TOGGLE DOES NOT APPEAR TO WORK UNLESS ANOTHER ENTRY IS INTESERTED
        if(this.modalContent.title){
            // this.modalContent.title = '';
            // this.modalContent.data = null;
            
            this.onEntryEdit.emit({
                title: '',
                data: null
            });
        }
    }

    entryEdit(e){
        this.onEntryEdit.emit(e);
    }
}
