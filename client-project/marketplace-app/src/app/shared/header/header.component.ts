import { AccountService } from './../../services/account.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import Roles from '../Roles';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  accounts: string[];
  selectedAccount: string;
  selectedAccountRole: string;
  disableSelect = new FormControl(false);
  options: FormGroup;
  account: FormControl;

  constructor(private accountService: AccountService, fb: FormBuilder) {
    this.options = fb.group({
      account: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.accountService.getAccounts().then((data) => (this.accounts = data));
    this.accountService.getAccountChangedObserver().subscribe((newAccount) => {
      this.accountService.getUserInfo(newAccount).then((data) => {
        if (data === Roles.Manager) {
          this.selectedAccountRole = Roles.ManagerDisplayName;
        }
        if (data === Roles.Freelancer) {
          this.selectedAccountRole = Roles.FreelancerDisplayName;
        }
        if (data === Roles.NotRegistered) {
          this.selectedAccountRole = Roles.NotRegisteredDisplayName;
        }
      });
    });
  }

  changeAccount(data) {
    this.selectedAccount = data;
    localStorage.setItem('currentAccount', this.selectedAccount);
    this.accountService.onAccountChanged(this.selectedAccount);
    console.log(data);
  }
}
