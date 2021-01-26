import { Component, Input, OnInit } from '@angular/core';
import ProductCard from 'src/app/shared/models/ProductCard';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent implements OnInit {
  @Input() product: ProductCard;
  constructor() {}

  ngOnInit(): void {}
}
