import { AccountService } from './../../../services/account.service';
import { Component, OnInit } from '@angular/core';
import Product from 'src/app/shared/models/Product';
import ProductCard from 'src/app/shared/models/ProductCard';
import Roles from 'src/app/shared/Roles';

@Component({
  selector: 'app-view-projects',
  templateUrl: './view-projects.component.html',
  styleUrls: ['./view-projects.component.scss'],
})
export class ViewProjectsComponent implements OnInit {
  products: ProductCard[];
  selectedAccount: string;
  selectedAccountRole: string;
  role: string;
  account: string;
  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.account = localStorage.getItem('currentAccount');
    this.getProjects();

    this.accountService.getAccountChangedObserver().subscribe((newAccount) => {
      this.account = newAccount;
      this.accountService.getUserInfo(newAccount).then((data) => {
        this.role = data;
      });
    });
  }

  getProjects() {
    this.accountService.getProjects(this.account).then((data) => {
      this.products = data;
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
