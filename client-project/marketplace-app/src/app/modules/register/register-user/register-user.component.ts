import { AccountService } from './../../../services/account.service';
import { RegisterServiceService } from '../../../services/register-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {
  account: string | undefined;
  balance: string | undefined;
  constructor(private registerService: RegisterServiceService, private accountService: AccountService) { }

  ngOnInit() {
    this.account = localStorage.getItem('currentAccount');

    this.getUserStatus();
    this.getAccountAndBalance();
  }

  getUserStatus = () => {
    this.accountService.getUserInfo(this.account).then(data => {
      console.log(data);
    })
  }
  getAccountAndBalance = () => {
    const that = this;
    this.registerService.getAccount().
    then((retAccount: string[]) => {
     console.log(retAccount);
      console.log('transfer.components :: getAccountAndBalance :: that.user');
    }).catch(function(error) {
      console.log(error);
    });
  }
}
