import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { NgForm } from '@angular/forms';
import { User } from '../shared/entry.model';

@Component({
    selector: 'app-send-message',
    templateUrl: './send-message.component.html',
    styleUrls: ['./content.component.css']
})


export class SendMessage{
    @Output() userChange = new EventEmitter<User>();
    @Output() modalChange = new EventEmitter<{
        title:string;
        data:any;
    }>();    

    @Input() user: User;
    @Input() data: {
        shoppingListNames: Array<string>;
        shoppingList: Array<{name:string; selected:boolean;}>;
        changed: boolean;
    };

    phones:Array<any> = [];
    send:any = '';
    newPhone:string = '';

    start:boolean = false;
    done:boolean = false;
    error:string = '';

    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";
    constructor(private entryService: EntryService) {}

    ngOnInit(){
        if(this.user.phone.length > 0){
            console.log(this.user.phone);
            this.phones = this.user.phone.map((i) => { return i; });
            this.send = this.user.phone[0];
        }
        //this.newPhone = '';
    }

    addPhone(text: NgForm){
        console.log(text.value);         
        const num = this.formatNum(text.value.newPhone);

        if(this.checkPhone(num) && !this.phones.includes(num)){
            this.phones.splice(0, 0, num);

            this.newPhone = '';
            this.data.changed = true;
            this.send = num;
        }
        else {
            //this.error = true;
            this.error = this.newPhone;
        }
    }

    formatNum(num) {
        const newNum = num.replace(/[^0-9]/gi, '');
        if(newNum.length === 11){
          return "+" + newNum;
        }
        else if(newNum.length === 10){
          return "+1" + newNum;
        }
        else {
          return newNum;
        }
    }

    checkPhone(newNum) {
        //make sure num has <= 11 digits but >= 10 digits
        //newNum.replace("+", "");
        return /^[+]{1}([0-9]{10}|(1|0)[0-9]{10})$/.test(newNum);
    }

    onChange(e){
        console.log("hi");
        this.error = '';
    }


    onSend(f: NgForm) {
        console.log(this.user);
        

        // if(checkPhone(this.send)){
        const url = `${this.url}/user/${this.user._id}/message?token=${this.user.userID}`;
        this.start = true;
        this.done = false;

        const send = (this.send) ? this.send: this.newPhone;

        this.entryService.postUser(url, {
            ...this.data, 
            send: send
        }).then(user => {
            if(!user.name){
                this.start = false;
                this.error = send || "''";
                console.log(user);
            }
            else {
                this.done = true;
                this.userChange.emit(user);
            }
        });
        // }
        // else {
        //     this.error = true;
        // }
    }

    toggle(f: NgForm){
        if(this.data.changed && !this.done && !this.start){
            this.modalChange.emit({
                title: "Save Changes",
                data: {
                    shoppingListNames: this.data.shoppingListNames,
                    shoppingList: this.data.shoppingList,
                    phone: this.phones
                }
            });
        }
        else{
            this.modalChange.emit({
                title: '',
                data: null
            });
        }
    }
}