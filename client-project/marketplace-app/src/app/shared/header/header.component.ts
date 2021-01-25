import { AccountService } from './../../services/account.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  accounts: string[];
  selectedAccount: string;
  disableSelect = new FormControl(false);
  options: FormGroup;
  constructor(private accountService: AccountService, fb: FormBuilder) {
    this.options = fb.group({
      accountControl: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.accountService.getAccounts().then(data => this.accounts = data);

  }

  changeAccount(data) {
    this.selectedAccount = data;
    localStorage.setItem('currentAccount', this.selectedAccount);
    this.accountService.onAccountChanged(this.selectedAccount);
    console.log(data);
  }

}
