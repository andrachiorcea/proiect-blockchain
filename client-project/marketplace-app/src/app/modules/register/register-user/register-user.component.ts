import { RegisterServiceService } from '../../../services/register-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {
  address: string | undefined;
  balance: string | undefined;
  constructor(private registerService: RegisterServiceService) { }

  ngOnInit() {
    this.getAccountAndBalance();
  }

  getAccountAndBalance = () => {
    const that = this;
    this.registerService.getAccount().
    then((retAccount: any) => {
      this.address = retAccount;
      console.log('transfer.components :: getAccountAndBalance :: that.user');
    }).catch(function(error) {
      console.log(error);
    });
  }

}
