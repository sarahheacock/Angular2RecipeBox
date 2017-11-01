import { Component, AfterViewInit, Output, EventEmitter, Input, NgZone } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';
import { User } from '../shared/entry.model';

declare var gapi: any;

@Component({
    selector: 'app-login',
    template: `
    <div class="modal-body">
        <div class="text-center" [ngSwitch]="name">
            <ng-container *ngSwitchCase="''">
                <div class="pad-button">
                    <button class="btn btn-success btn-block" (click)="loginWithGmail($event)">Sign in with Gmail <i class='fa fa-google' aria-hidden='true'></i></button>
                    <p>OR</p>
                    <button class="btn btn-primary btn-block" (click)="loginWithFacebook($event)">Sign in with Facebook <i class="fa fa-facebook-square" aria-hidden="true"></i></button>
                </div>
            </ng-container>
            <ng-container *ngSwitchDefault>
                <h5>Welcome, {{name}}!</h5>
            </ng-container>
            <br />
        </div>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="toggle($event)">Close</button>
    </div>
    `,
    styleUrls: ['./content.component.css']
})

export class Login implements AfterViewInit{
    @Output() stateChange = new EventEmitter<any>();
    @Output() userChange = new EventEmitter<any>();

    @Input() name: string;
    auth2: any;

    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";

    constructor(private fb: FacebookService, private entryService: EntryService, private ngZone: NgZone){ //, private google:  GoogleSignInProviderService){
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
        this.ngZone.runOutsideAngular(() => {
            this.facebook((token) => {
              // reenter the Angular zone and display done
                this.ngZone.run(() => { 
                    const url = `${this.url}/auth/facebook/token?access_token=${token}`;
                    return this.login(url);
                });        
            });
        });
    }

    facebook(doneCallback: (token:string) => void){
        const options: LoginOptions = {
            scope: 'public_profile',
            return_scopes: true,
            enable_profile_selector: true
        };
        
        this.fb.login(options)
            .then((response: LoginResponse) => {
                const token = response.authResponse.accessToken;
                doneCallback(token); 
            }) 
            .catch((error: any) => console.error(error)); 
    }

    loginWithGmail() {
        //ngZone is used because sometimes the view is not updated when signing into gmail
        this.ngZone.runOutsideAngular(() => {
            this.gmail((token) => {
              // reenter the Angular zone and display done
                this.ngZone.run(() => { 
                    const url = `${this.url}/auth/google/token?access_token=${token}`;
                    return this.login(url);
                });        
            });
        });
    }

    gmail(doneCallback: (token:string) => void){
        this.auth2.grantOfflineAccess().then((authResult) => {
            const token = this.auth2.currentUser.get().getAuthResponse().access_token;
            doneCallback(token);            
        })
        .catch((error: any) => console.error(error)); 
    }

    login(url:string){
        return this.entryService.getUser(url).then(user => {
            this.userChange.emit(user);
        }); 
    }
}