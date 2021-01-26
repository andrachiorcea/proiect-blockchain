import { Component, Input, OnInit } from '@angular/core';
import ProductCard from 'src/app/shared/models/ProductCard';

@Component({
  selector: 'app-finance-project-card',
  templateUrl: './finance-project-card.component.html',
  styleUrls: ['./finance-project-card.component.scss'],
})
export class FinanceProjectCardComponent implements OnInit {
  @Input() product: ProductCard;
  constructor() {}

  ngOnInit(): void {}
}
