import { AccountService } from './../../../services/account.service';
import ProductCard from 'src/app/shared/models/ProductCard';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-finance-projects',
  templateUrl: './finance-projects.component.html',
  styleUrls: ['./finance-projects.component.scss'],
})
export class FinanceProjectsComponent implements OnInit {
  products: ProductCard[];
  role: string;
  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getAccountChangedObserver().subscribe((newAccount) => {
      this.accountService.getUserInfo(newAccount).then((data) => {
        this.role = data;
      });
    });

    this.products = [
      {
        description: 'expertise expertise expertise',
        dev: 10,
        rev: 20,
        expertise: 'title expertise ceva',
        manager: 'teste test',
      },
      {
        description: 'expertise expertise expertise',
        dev: 10,
        rev: 20,
        expertise: 'title expertise ceva',
        manager: 'teste test',
      },
      {
        description: 'expertise expertise expertise',
        dev: 10,
        rev: 20,
        expertise: 'title expertise ceva',
        manager: 'teste test',
      },
      {
        description: 'expertise expertise expertise',
        dev: 10,
        rev: 20,
        expertise: 'title expertise ceva',
        manager: 'teste test',
      },
    ];
  }
}
