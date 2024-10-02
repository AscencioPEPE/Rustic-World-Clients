import { Component, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-add-form-product',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss'],
  imports: [FormsModule, CommonModule],
})
export class AddFormComponent implements OnInit {

  showForm: boolean = true;

  product: Product = {
    name: '',
    sku: '',
    category: '',
    description: '',
    size:'',
    weight:'',
    price: 0,
    priceUnitary: 0,
    priceWholesale: 0,
    quantity: 0,
    image: '',
  };
  selectedFile: File | null = null; 
  constructor(private productService: ProductService) {}



  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  ngOnInit() {}

  onSubmit() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('name', this.product.name);
      formData.append('sku', this.product.sku);
      formData.append('category', this.product.category);
      formData.append('description', this.product.description);
      formData.append('size', this.product.size);
      formData.append('weight', this.product.weight);
      formData.append('price', this.product.price.toString());
      formData.append('priceUnitary', this.product.priceUnitary.toString());
      formData.append('priceWholesale', this.product.priceWholesale.toString());
      formData.append('quantity', this.product.quantity.toString());
      formData.append('image', this.selectedFile);
      this.productService.addProduct(formData);
    }
  }
  

  toggleForm() {
    this.showForm = !this.showForm;
  }
}
