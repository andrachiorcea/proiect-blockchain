import { AccountService } from './../../../services/account.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import ProductCard from 'src/app/shared/models/ProductCard';
import ApplyFunder from 'src/app/shared/models/ApplyFunder';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-finance-project-card',
  templateUrl: './finance-project-card.component.html',
  styleUrls: ['./finance-project-card.component.scss'],
})
export class FinanceProjectCardComponent implements OnInit {
  @Input() product: ProductCard;
  @Output() financeAppliedEmitter: EventEmitter<boolean> = new EventEmitter();
  applyFunderGroup = new FormGroup({
    tokens: new FormControl(0),
  });
  account: string;
  constructor(
    private accountService: AccountService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.account = localStorage.getItem('currentAccount');
    if (this.account == null) {
      alert('Refresh the page immediately');
    }
    this.accountService.getAccountChangedObserver().subscribe((newAccount) => {
      if (newAccount != null) {
        this.account = newAccount;
      }
    });
  }

  onSubmit() {
    const applyFunder: ApplyFunder = Object.assign(
      {},
      this.applyFunderGroup.value
    );
    applyFunder.address = this.account;
    applyFunder.projectId = Number.parseInt(this.product.id.toString());
    applyFunder.tokens = Number.parseInt(applyFunder.tokens.toString());

    this.accountService.fundProject(applyFunder).then((data) => {
      this.financeAppliedEmitter.emit(true);
      this.snackBar.open('Finance done', 'Finance', {
        duration: 2000,
      });
    });
  }
}
