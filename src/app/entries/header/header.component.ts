import { Component, OnInit, OnDestroy, AfterViewInit, OnChanges } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { User } from '../shared/entry.model';
import { Recipe } from '../shared/entry.model';

@Component({
    selector: 'app-header',
    templateUrl: "header.component.html",
    styleUrls: ["header.component.css"]
})

export class HeaderContent{
    length: number = 0;
    user: User = {
        name: '',
        userID: '',
        shoppingList: [],
        shoppingListNames: [],
        recipes: [],
        _id: '',
        phone: ''
    };

    modalShown: string = 'active';
    modalContent: { title:string; data:any } = {
        title: "Loading",
        data: null
    };

    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";


    constructor(private entryService: EntryService){ //, private google:  GoogleSignInProviderService){
        if(window.sessionStorage.user){
            this.user = JSON.parse(window.sessionStorage.user);
            this.count();
            console.log(this.user);
        }
    }

    count(){
        this.length = this.user.shoppingList.reduce((a, b) => {
            if(b.selected) a++;
            return a;
        }, 0);
    }
  
    stateChange(str){
        console.log(str);
        const data = null;

        const obj = {
            title: str,
            data: data
        };

        if(this.user.name){
            this.modalContent = obj;
        } 
        else{
            this.modalContent = {
                title: "Sign In",
                data: this.user.name
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

    //==============EDIT USER===============================
    updateUser(obj: User) {
        console.log(obj);
        
        this.user = obj;
        window.sessionStorage.setItem('user', JSON.stringify(obj));
        this.count();
        this.toggleState('inactive');
    } 
}