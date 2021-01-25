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
  accountType: string;
  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.accountService.getAccounts().then(data => {
      this.account = data[0];
      this.getUserStatus(this.account);
    });

    this.accountService.getAccountChangedObserver().subscribe(newAccount => {
      this.account = newAccount;
      this.getUserStatus(this.account);
    })

  }

  getUserStatus = (account) => {
    this.accountService.getUserInfo(account).then(data => {
      this.accountType = data;
    })
  }
  getAccountAndBalance = () => {
    // const that = this;
    // this.registerService.getAccount().
    // then((retAccount: string[]) => {
    //  console.log(retAccount);
    //   console.log('transfer.components :: getAccountAndBalance :: that.user');
    // }).catch(function(error) {
    //   console.log(error);
    // });
  }
}
