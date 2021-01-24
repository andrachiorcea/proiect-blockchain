import { AccountService } from './../../services/account.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  accounts: string[];
  selectedAccount: string;
  disableSelect = new FormControl(false);
  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.getAccounts().then(data => this.accounts = data);
  }

  changeAccount(data) {
    this.selectedAccount = data;
    localStorage.setItem('currentAccount', this.selectedAccount);
    console.log(data);
  }

}
