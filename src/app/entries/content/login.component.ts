import { Component, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';
import { User } from '../shared/entry.model';

declare var gapi: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./content.component.css']
})

export class Login implements AfterViewInit{
    @Output() stateChange = new EventEmitter<string>();
    @Output() userChange = new EventEmitter<User>();

    @Input() name: string;
    auth2: any;

    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";

    constructor(private fb: FacebookService, private entryService: EntryService){ //, private google:  GoogleSignInProviderService){
        let initParams: InitParams = {
            appId: '1474280852691654',
            xfbml: true,
            version: 'v2.8'
        };
    
        fb.init(initParams);
    }

    ngAfterViewInit() {
        gapi.load('auth2', () => {
            this.auth2 = gapi.auth2.init({ //SOMETIMES THERE IS AN ERROR GAPI DNE
                client_id: '763862879351-ut6n5jru27vvk2dr94u9jd4b71m1va7b.apps.googleusercontent.com',
                fetch_basic_profile: false,
                scope: 'profile'
            });
        });
    }

    toggle(e){
        this.stateChange.emit('inactive');
    }

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

                this.entryService.getUser(url)
                    .then(user => {
                        this.userChange.emit(user);
                        //this.stateChange.emit('inactive');
                    });
            }) 
            .catch((error: any) => console.error(error)); 
    }

    loginWithGmail() {
        this.auth2.grantOfflineAccess().then((authResult) => {
            const token = this.auth2.currentUser.get().getAuthResponse().access_token;
            const url = `${this.url}/auth/google/token?access_token=${token}`;

            return this.entryService.getUser(url)
            .then(user => {
                this.userChange.emit(user);
                //this.stateChange.emit('inactive');
            });
        });
    }
}