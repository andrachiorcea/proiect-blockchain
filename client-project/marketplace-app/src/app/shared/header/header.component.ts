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

  options = new FormGroup({
    account: new FormControl(''),
  });

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getAccounts().then((data) => {
      this.accounts = data;
      this.options.controls.account.setValue(this.accounts[0]);
      localStorage.setItem('currentAccount', this.accounts[0]);
    });
    this.accountService.getAccountChangedObserver().subscribe((newAccount) => {
      if (newAccount != null) {
        this.accountService.getUserInfo(newAccount).then((data) => {
          if (data === Roles.Manager) {
            this.selectedAccountRole = Roles.ManagerDisplayName;
          }
          if (data === Roles.Freelancer) {
            this.selectedAccountRole = Roles.FreelancerDisplayName;
          }
          if (data === Roles.Evaluator) {
            this.selectedAccountRole = Roles.EvaluatorDisplayName;
          }
          if (data === Roles.Funder) {
            this.selectedAccountRole = Roles.FunderDisplayName;
          }
          if (data === Roles.NotRegistered) {
            this.selectedAccountRole = Roles.NotRegisteredDisplayName;
          }
          localStorage.setItem('currentRole', data);
          localStorage.setItem('currentUser', newAccount);
        });
      }
    });
  }

  changeAccount(data) {
    this.selectedAccount = data;
    localStorage.setItem('currentAccount', this.selectedAccount);
    this.accountService.onAccountChanged(this.selectedAccount);
    console.log(data);
  }
}
