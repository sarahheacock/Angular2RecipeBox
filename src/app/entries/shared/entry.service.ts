import { User } from './entry.model';
import { Injectable, EventEmitter, Output, OnInit } from '@angular/core';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

//declare var gapi: any;

@Injectable()
export class EntryService {
    @Output() onStateChange: EventEmitter<any> = new EventEmitter();
    @Output() onContentChange: EventEmitter<any> = new EventEmitter();
    @Output() onUserChange: EventEmitter<any> = new EventEmitter();

    modalShown: string = 'active';
    modalContent: string = "Loading";
    user: User = {
        name: '',
        userID: '',
        shoppingList: [],
        recipes: [],
        _id: ''
    };
    //api: any;

    constructor(private http: HttpClient, private fb: FacebookService){
        let initParams: InitParams = {
            appId: '1474280852691654',
            xfbml: true,
            version: 'v2.8'
        };
    
        fb.init(initParams);

        if(window.sessionStorage.user){
            this.user = JSON.parse(window.sessionStorage.user);
        }
    }
    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";

    // RECIPES
    getEntries(): Promise<any[]> {
        console.log("get");
        return this.http.get(`${this.url}/api`)
            .toPromise()
            .then(response => response['box'] as any[]);
    }

    // MODAL CONTENT
    changeContent(str){
        this.modalContent = str;
        this.onContentChange.emit(this.modalContent);
        this.toggleState();
    }

    getContent(){
        return this.onContentChange;
    }

    // MODAL TOGGLE
    toggleState() {
        this.modalShown = (this.modalShown === 'inactive') ? 'active': 'inactive';
        console.log(this.modalShown);
        this.onStateChange.emit(this.modalShown);
    }

    getState() {
        return this.onStateChange;
    }

    // USER LOGIN
    loginWithFacebook(): void {
        const options: LoginOptions = {
            scope: 'public_profile',
            return_scopes: true,
            enable_profile_selector: true
        };
        
        this.fb.login(options)
            .then((response: LoginResponse) => {
                console.log(response);
                const token = response.authResponse.accessToken;
                return this.changeUser(`${this.url}/auth/facebook/token?access_token=${token}`, null)
                    .then(user => {
                        this.user = user;
                        this.store();
                    });
            }) 
            .catch((error: any) => console.error(error)); 
    }

    loginWithGmail(googleUser) {
        const id_token = googleUser.getAuthResponse().id_token;
        console.log(id_token);
        // const profile = googleUser.getBasicProfile();
        // const userID = profile.getEmail();
        // const name = profile.getName();
        
        // const body = {
        //     userID: userID,
        //     name: name
        // };

        // console.log(body, this.user);
        // if(this.user.name !== name){
        //     return this.changeUser(`${this.url}/user/gmail/token`, body)
        //     .then(user => {
        //         this.user = user;
        //         this.store();
        //     });
        // }
    }

    changeUser(url, body): Promise<User> {
        if(body){
            return this.http.post(url, body)
            .toPromise()
            .then(response => response as User);
        }
        else {
            return this.http.get(url)
            .toPromise()
            .then(response => response as User);
        }
    }
    //763862879351-ut6n5jru27vvk2dr94u9jd4b71m1va7b.apps.googleusercontent.com
    //iHy7MLbSD6-8VWAkFzo0Q18c
    logoutUser(){
        this.user = {
            name: '',
            userID: '',
            shoppingList: [],
            recipes: [],
            _id: ''
        };
        sessionStorage.removeItem('user');
        this.onUserChange.emit(this.user);
        this.toggleState();
    }

    getUser() {
        return this.onUserChange;
    }

    store() {
        window.sessionStorage.setItem('user', JSON.stringify(this.user));       
        this.onUserChange.emit(this.user);
        this.toggleState();
    }
}
