import { Component, Input, OnChanges, SimpleChanges, } from '@angular/core';
import { Product } from '../../product.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../product.service';

declare var bootstrap: any;

@Component({
  standalone: true,
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styleUrls: ['./modal-edit.component.scss'],
  imports: [FormsModule, CommonModule],
})
export class ModalEditComponent implements OnChanges  {

  @Input() selectedProduct!: Product;
  @Input() originalSku!: string;
  selectedFile: File | null = null;
  editableProduct!: Product;

  constructor(private productService: ProductService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedProduct'] && this.selectedProduct) {
      this.editableProduct = { ...this.selectedProduct };
    }
  }

  onDelete(): void {
    if (confirm(`¿Seguro que deseas eliminar el producto con el sku: ${this.originalSku}?`)) {
      this.productService.deleteProduct(this.originalSku);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedProduct.image = file;
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('skuExisting', this.originalSku);
    formData.append('name', this.editableProduct.name);
    formData.append('sku', this.editableProduct.sku);
    formData.append('category', this.editableProduct.category);
    formData.append('description', this.editableProduct.description);
    formData.append('size', this.editableProduct.size);
    formData.append('weight', this.editableProduct.weight);
    formData.append('price', this.editableProduct.price.toString());
    formData.append('priceUnitary', this.editableProduct.priceUnitary.toString());
    formData.append('priceWholesale', this.editableProduct.priceWholesale.toString());
    formData.append('quantity', this.editableProduct.quantity.toString());

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.productService.updateProduct(formData);
    const modalElement = document.getElementById('editProductModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
  }
}
