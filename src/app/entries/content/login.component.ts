import { Component, AfterViewInit, AfterViewChecked } from '@angular/core';
//import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';
import { EntryService } from '../shared/entry.service';
import $ from "jquery";


// declare var gapi: any;

//<button class="btn btn-success">Sign in with Google <i class="fa fa-google-plus" aria-hidden="true"></i></button>
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class Login {
    constructor(private entryService: EntryService) { }

    // ngAfterViewInit() {
    //     gapi.signin2.render('my-signin2', {
    //         'scope': 'profile email',
    //         'width': 250,
    //         'longtitle': false,
    //         'theme': 'light',
    //         'onsuccess': param => this.onSignIn(param)
    //     });
    // }
    
    // ngAfterViewChecked() {
    //     //abcRioButton abcRioButtonLightBlue
    //     //abcRioButtonIcon
    //     //abcRioButtonContents
    //     $('.abcRioButton').removeClass('abcRioButtonLightBlue').removeClass('abcRioButton').addClass("btn btn-success").prepend("<span>Sign in with Gmail  <i class='fa fa-google' aria-hidden='true'></i></span>");
    //     $('.abcRioButtonContentWrapper').css({'display': 'none'});
    // }

    login() {
        this.entryService.loginWithFacebook();
    }

    // onSignIn(googleUser) {
    //     this.entryService.loginWithGmail(googleUser);
    // }

    signOut() {
        this.entryService.logoutUser();
        // if(this.entryService.user.userID.includes('@')){
        //     gapi.auth2.getAuthInstance().signOut().then(() => {
        //         console.log('User signed out.');
        //         this.entryService.logoutUser();
        //     });
        // }
        // else {
        //     console.log('User signed out.');
        //     this.entryService.logoutUser();
        // }
    }
}