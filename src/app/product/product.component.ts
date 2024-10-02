import { Component, OnInit } from '@angular/core';
import { TableComponent } from './table/table.component';
import { AddFormComponent } from './add-form/add-form.component';

@Component({
  imports: [TableComponent,AddFormComponent],
  standalone: true,
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  
}
