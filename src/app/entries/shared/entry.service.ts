import { User } from './entry.model';
import { Injectable, EventEmitter, Output, OnInit } from '@angular/core';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';
import { GoogleSignInProviderService } from 'ngx-google-sign-in';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

declare var gapi: any;

@Injectable()
export class EntryService {
    @Output() onStateChange: EventEmitter<any> = new EventEmitter();
    @Output() onContentChange: EventEmitter<any> = new EventEmitter();
    @Output() onUserChange: EventEmitter<any> = new EventEmitter();

    modalShown: string = 'active';
    modalContent: { title:string; data:any } = {
        title: "Loading",
        data: null
    };
    user: User = {
        name: '',
        userID: '',
        shoppingList: [],
        shoppingListNames: [],
        recipes: [],
        _id: ''
    };
    auth2: any;

    constructor(private http: HttpClient, private fb: FacebookService){ //, private google:  GoogleSignInProviderService){
        let initParams: InitParams = {
            appId: '1474280852691654',
            xfbml: true,
            version: 'v2.8'
        };
    
        fb.init(initParams);
        //google.init("763862879351-ut6n5jru27vvk2dr94u9jd4b71m1va7b.apps.googleusercontent.com");

        gapi.load('auth2', () => {
            this.auth2 = gapi.auth2.init({
              client_id: '763862879351-ut6n5jru27vvk2dr94u9jd4b71m1va7b.apps.googleusercontent.com',
              fetch_basic_profile: false,
              scope: 'profile'
              // Scopes to request in addition to 'profile' and 'email'
              //scope: 'additional_scope'
            });
        });

        if(window.sessionStorage.user){
            this.user = JSON.parse(window.sessionStorage.user);
            console.log(this.user);
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
    changeContent(obj){
        if(this.user.name){
            this.modalContent = obj;
        } 
        else{
            this.modalContent = {
                title: "Sign In",
                data: this.user.name
            };
        } 

        console.log(this.modalContent);
        
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
                const url = `${this.url}/auth/facebook/token?access_token=${token}`;
                console.log({url: url});
                return this.changeUser(url)
                    .then(user => {
                        this.user = user;
                        this.store();
                    });
            }) 
            .catch((error: any) => console.error(error)); 
    }

    loginWithGmail() {
        this.auth2.grantOfflineAccess().then((authResult) => {
            this.auth2.currentUser.listen((googleUser) => {
                if (!googleUser.isSignedIn()) {
                    return;
                }
    
                console.log(googleUser);
                const token = googleUser.getAuthResponse().access_token;
                const url = `${this.url}/auth/google/token?access_token=${token}`;
                console.log(url);
    
                return this.changeUser(url)
                .then(user => {
                    this.user = user;
                    this.store();
                });
            });
        });
    }

    logoutUser(){
        return this.changeUser(`${this.url}/auth/logout`)
        .then(user => {
            this.user = user;
            this.user._id = '';
            this.store();
        });
    }

    store() {
        console.log(this.user);
        window.sessionStorage.setItem('user', JSON.stringify(this.user));       
        this.onUserChange.emit(this.user);
        this.toggleState();
    }


    changeUser(url): Promise<User> {
        return this.http.get(url)
        .toPromise()
        .then(response => response as User);
    }

    getUser() {
        return this.onUserChange;
    }
}
