import { AccountService } from './../../../services/account.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import ProductCard from 'src/app/shared/models/ProductCard';
import ApplyFunder from 'src/app/shared/models/ApplyFunder';

@Component({
  selector: 'app-finance-project-card',
  templateUrl: './finance-project-card.component.html',
  styleUrls: ['./finance-project-card.component.scss'],
})
export class FinanceProjectCardComponent implements OnInit {
  @Input() product: ProductCard;
  applyFunderGroup = new FormGroup({
    tokens: new FormControl(0),
  });
  account: string;
  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.account = localStorage.getItem('currentAccount');
    this.accountService.getAccountChangedObserver().subscribe((newAccount) => {
      this.account = newAccount;
    });
  }

  onSubmit() {
    const applyFunder: ApplyFunder = Object.assign(
      {},
      this.applyFunderGroup.value
    );
    applyFunder.address = this.account;
    applyFunder.projectId = this.product.productId;
    this.accountService.fundProject(applyFunder).then((data) => {
      console.log('success');
    });
  }
}
