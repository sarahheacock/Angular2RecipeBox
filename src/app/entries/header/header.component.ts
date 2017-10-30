import { Component, OnInit, OnDestroy, AfterViewInit, OnChanges } from '@angular/core';
import { EntryService } from '../shared/entry.service';
//import {  } from '../shared/entry.model';
import { User, Recipe } from '../shared/entry.model';

@Component({
    selector: 'app-header',
    templateUrl: "header.component.html",
    styleUrls: ["header.component.css"]
})

export class HeaderContent{
    //length: number = 0;
    user: User = {
        name: '',
        userID: '',
        shoppingList: [],
        shoppingListNames: [],
        recipes: [],
        _id: '',
        phone: []
    };

    modalShown: string = 'active';
    modalContent: { title:string; data:any } = {
        title: "Loading",
        data: null
    };
    options: Array<string> = [];
    length: number = this.user.shoppingList.reduce((a, b) => { 
        if(b.selected) a += 1;
        return a; 
    }, 0)

    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";


    constructor(private entryService: EntryService){ //, private google:  GoogleSignInProviderService){
        if(window.sessionStorage.user){
            const user = JSON.parse(window.sessionStorage.user);
            this.user = (user.name) ? user: {
                name: '',
                userID: '',
                shoppingList: [],
                shoppingListNames: [],
                recipes: [],
                _id: '',
                phone: ''
            };

            this.count();
            console.log(this.user);
        }
    }

    // ngOnInit(){
    //     if(this.user.userID) this.fetchUser();
    // }

    count(){
        this.length = this.user.shoppingList.reduce((a, b) => {
            if(b.selected) a++;
            return a;
        }, 0);
    }
  
    stateChange(str){
        console.log(str);

        if(this.user.name){
            if(str === "Shopping List"){
                this.modalContent = {
                    title: "Shopping List",
                    data: {
                        shoppingListNames: [],
                        shoppingList: []
                    }
                };
            }
            else if(str === 'Add Recipe'){
                this.modalContent = {
                    title: str,
                    data: {
                        title: '',
                        ingredients: '',
                        directions: '',
                        pic: 'Tile-Dark-Grey-Smaller-White-97_pxf5ux',
                        href: '',
                        _id: ''
                    }
                };
            }
            else {
                this.modalContent = {
                    title: str,
                    data: null
                };
            }
        } 
        else{
            this.modalContent = {
                title: "Sign In",
                data: null
            };
        }

        this.toggleState('active');
    }

    // ==============MODAL CONTENT===============================
    toggleState(e) {
        if(!e) this.modalShown = (this.modalShown === 'inactive') ? 'active': 'inactive';
        else this.modalShown = e;

        console.log("header", this.modalShown);
    }

    changeModalContent(e: {title:string; data:any;}) {
        this.modalContent = e;
        this.toggleState('active');
    }

    updateOptions(e: {options: Array<string>; user: User;}) {
        this.options = e.options;
        //this.user = e.user;
        this.modalShown = 'inactive';
        this.updateUser(e.user);
        console.log(this.options);
    }

    //==============EDIT USER===============================
    // fetchUser() {
        
    //     this.entryService.getUser(userUrl).then(user => {
    //         //this.user = user;
    //         this.updateUser(user);
    //     });
    // }

    updateUser(obj: User) {
        console.log(obj);
        
        this.user = obj;

        //window.focus();
        window.sessionStorage.setItem('user', JSON.stringify(obj));

        this.count();
        this.toggleState('inactive');
    } 
}