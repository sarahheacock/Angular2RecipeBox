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
    @Output() stateChange = new EventEmitter<string>();
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
    error:boolean = false;

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
        const formatNum = (num) => {
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
        };
          
        const checkPhone = (newNum) => {
            //make sure num has <= 11 digits but >= 10 digits
            //newNum.replace("+", "");
            return /^[+]{1}([0-9]{10}|(1|0)[0-9]{10})$/.test(newNum);
        };

        const num = formatNum(text.value.phone);

        if(checkPhone(num) && !this.phones.includes(num)){
            this.phones.splice(0, 0, num);

            this.newPhone = '';
            this.data.changed = true;
            this.send = num;
        }
        else {
            this.error = true;
        }
    }


    onSend(f: NgForm) {
        console.log(this.user);   
        const url = `${this.url}/user/${this.user._id}/message?token=${this.user.userID}`;
        this.start = true;

        this.entryService.postUser(url, {
            ...this.data, 
            send: this.send
        }).then(user => {
            this.userChange.emit(user);
            this.done = true;
        });
    }

    toggle(e){
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
            this.stateChange.emit('');
        }
    }
}