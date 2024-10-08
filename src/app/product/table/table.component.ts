import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ClientType, LimitOptions, Page, Product, ProductListPaginated } from '../product.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalImageComponent } from '../modal/modal-image/modal-image.component';

@Component({
  standalone: true,
  selector: 'app-table-product',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [FormsModule, CommonModule, ModalImageComponent],
})
export class TableComponent implements OnInit {

  categories: string[] = [];
  limit: number = 5;
  page: number = 1;
  priceOrder: string = 'asc';
  pages: Page[] = [];
  skuPrefix: string = '';
  namePrefix: string = '';

  clientType: ClientType = ClientType.Wholesale;


  productsPaginated: ProductListPaginated = {
    startIndex: 1,
    endIndex: 1,
    count: 0,
    page: 1,
    pages: 1,
    totalProductsPage: 1,
    products: [],
  };

  selectedProduct: Product = {
    name: '',
    sku: '',
    category: '',
    description: '',
    size: '',
    weight: '',
    price: 0,
    priceUnitary: 0,
    priceWholesale: 0,
    quantity: 0,
    image: null,
  };

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getProducts();
    this.productService.products$.subscribe({
      next: (data: ProductListPaginated) => {
        this.productsPaginated = {
          ...data,
          products: data.products.map(product => ({
            ...product,
            image: this.convertBlobToImageUrl(product.image)
          }))
        };
        this.pages = Array.from({ length: data.pages }, (_, i) => ({ index: i + 1 }));
      }
    });
    
  }

  togglePriceOrder(): void {
    this.priceOrder = this.priceOrder === 'asc' ? 'desc' : 'asc';
    this.getProducts();
  }

  toggleClientType(){
    this.clientType = this.clientType === ClientType.Retail ? ClientType.Wholesale : ClientType.Retail;
  }

  getProducts(): void {
    this.productService.getProductsPaginated(this.categories, this.priceOrder, this.limit, this.page, this.skuPrefix, this.namePrefix);
  }

  onLimitChange(): void {
    this.page = 1;
    this.getProducts();
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.getProducts();
  }

  editProduct(product: Product): void {
    this.selectedProduct = { ...product };
  }

  openImageModal(product: Product): void {
    this.selectedProduct = { ...product };
  }

  private convertBlobToImageUrl(blob: any): string {
    const byteCharacters = atob(blob);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blobObject = new Blob([byteArray], { type: 'image/png' });
    return URL.createObjectURL(blobObject);
  }
}
