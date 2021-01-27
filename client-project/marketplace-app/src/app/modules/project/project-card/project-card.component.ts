import { AccountService } from 'src/app/services/account.service';
import { Component, Input, OnInit } from '@angular/core';
import ProductCard from 'src/app/shared/models/ProductCard';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent implements OnInit {
  @Input() product: ProductCard;
  @Input() role: string;
  account: string;
  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.account = localStorage.getItem('currentAccount');
    this.accountService.getAccountChangedObserver().subscribe((newAccount) => {
      this.account = newAccount;
    });
  }

  applyAsFreelancer() {
    this.accountService.applyAsFreelancer(this.product.id, 20, this.account);
  }
  applyAsEvaluator() {
    this.accountService.applyAsEvaluator(this.product.id, this.account);
  }
}
