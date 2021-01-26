import { AccountService } from './../../../services/account.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import User from 'src/app/shared/models/User';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
})
export class RegisterUserComponent implements OnInit {
  account: string | undefined;
  accountType: string;
  registerUserGroup = new FormGroup({
    role: new FormControl(''),
    name: new FormControl(''),
    reputation: new FormControl(''),
    expertise: new FormControl(''),
    tokens: new FormControl(0),
  });
  constructor(
    private accountService: AccountService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.accountService.getAccounts().then((data) => {
      this.account = data[0];
      this.getUserStatus(this.account);
    });

    this.accountService.getAccountChangedObserver().subscribe((newAccount) => {
      this.account = newAccount;
      this.getUserStatus(this.account);
    });
  }

  getUserStatus(account) {
    this.accountService.getUserInfo(account).then((data) => {
      this.accountType = data;
    });
  }

  onSubmit() {
    // Make sure to create a deep copy of the form-model
    const user: User = Object.assign({}, this.registerUserGroup.value);
    user.address = this.account;

    this.accountService.registerUser(user).then(
      (data) => {
        this.snackBar.open('Register successfully', 'Register', {
          duration: 2000,
        });
        localStorage.setItem('currentAccount', this.account);
        this.accountService.onAccountChanged(this.account);
      },
      (error) => {
        this.snackBar.open(error, 'Register failed', {
          duration: 2000,
        });
      }
    );
  }
}
