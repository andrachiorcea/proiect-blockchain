import { AccountService } from './../../../services/account.service';
import ProductCard from 'src/app/shared/models/ProductCard';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-finance-projects',
  templateUrl: './finance-projects.component.html',
  styleUrls: ['./finance-projects.component.scss'],
})
export class FinanceProjectsComponent implements OnInit {
  products: ProductCard[] = [];
  role: string;
  account: string;
  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.account = localStorage.getItem('currentAccount');
    this.getProjectsForFinance();

    this.accountService.getAccountChangedObserver().subscribe((newAccount) => {
      this.account = newAccount;
      this.accountService.getUserInfo(newAccount).then((data) => {
        this.role = data;
      });
    });
  }

  getProjectsForFinance() {
    this.accountService.getProjectsForFinance(this.account).then((data) => {
      for (let i = 0; i < data.length; i++) {
        const obj = Object.assign({}, data[i]);
        // tslint:disable-next-line: radix
        if (obj['DEV'] != undefined) {
          obj.dev = Number.parseInt(obj['DEV']);
        }
        if (obj['REV'] != undefined) {
          obj.rev = Number.parseInt(obj['REV']);
        }

        this.products.push(obj);
      }
    });
  }

  // this.products = [
  //   {
  //     productId: 1,
  //     description: 'expertise expertise expertise',
  //     dev: 10,
  //     rev: 20,
  //     expertise: 'title expertise ceva',
  //     manager: 'teste test',
  //   },
  //   {
  //     productId: 2,
  //     description: 'expertise expertise expertise',
  //     dev: 10,
  //     rev: 20,
  //     expertise: 'title expertise ceva',
  //     manager: 'teste test',
  //   },
  //   {
  //     productId: 3,
  //     description: 'expertise expertise expertise',
  //     dev: 10,
  //     rev: 20,
  //     expertise: 'title expertise ceva',
  //     manager: 'teste test',
  //   },
  //   {
  //     productId: 4,
  //     description: 'expertise expertise expertise',
  //     dev: 10,
  //     rev: 20,
  //     expertise: 'title expertise ceva',
  //     manager: 'teste test',
  //   },
  // ];
}
