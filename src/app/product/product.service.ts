import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { Product, ProductListPaginated } from './product.model';
import { BackendUrlService } from '../../config/backend-url.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl: string = 'http://192.168.1.120:8080/product';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  private productsSubject = new BehaviorSubject<ProductListPaginated>({
    startIndex: 1,
    endIndex: 1,
    count: 0,
    page: 1,
    pages: 1,
    totalProductsPage: 1,
    products: [],
  });

  products$: Observable<ProductListPaginated> =
    this.productsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private backendUrlService: BackendUrlService
  ) {
    this.backendUrlService
      .getBackendUrl()
      .pipe(take(1))
      .subscribe((backendUrl) => {
        this.apiUrl = `${backendUrl}/product`;
      });
  }

  /**
   * Fetches the products with pagination, filters, and sorting
   * @param categories - List of categories to filter
   * @param priceOrder - Sorting order of price ('asc' or 'desc')
   * @param limit - Number of items per page
   * @param page - Current page
   */
  getProductsPaginated(
    categories: string[],
    priceOrder: string,
    limit: number,
    page: number,
    skuPrefix?: string,
    namePrefix?: string
  ): void {
    if (!this.apiUrl) {
      return;
    }

    let params = new HttpParams()
      .set('priceOrder', priceOrder)
      .set('limit', limit.toString())
      .set('page', page.toString());

    if (categories.length > 0) {
      params = params.set('categories', categories.join(','));
    }

    if (skuPrefix && skuPrefix.trim().length > 0) {
      params = params.set('skuPrefix', skuPrefix);
    }
    if (namePrefix && namePrefix.trim().length > 0) {
      params = params.set('namePrefix', namePrefix);
    }

    this.http.get<ProductListPaginated>(this.apiUrl + "/all", { headers: this.headers, params: params })
      .pipe(take(1))
      .subscribe((data) => {
        this.productsSubject.next(data);
        
      });
  }


  addProduct(formData: FormData): void {
    this.http.post<Product>(this.apiUrl, formData).subscribe({
      next: (addedProduct) => {
        const currentProductsPaginated = this.productsSubject.value;
        if (currentProductsPaginated) {
          const updatedProducts = [
            ...currentProductsPaginated.products,
            addedProduct,
          ];
          const updatedPaginatedData: ProductListPaginated = {
            ...currentProductsPaginated,
            products: updatedProducts,
            count: currentProductsPaginated.count + 1,
          };
          this.productsSubject.next(updatedPaginatedData);
        }
      },
      error: (err) => console.error('Error adding product', err),
    });
  }

  deleteProduct(productSku: string): void {
    const params = new HttpParams().set('sku', productSku);

    this.http.delete(this.apiUrl, { headers: this.headers, params: params, responseType: 'text' })
      .pipe(
        tap(() => {
          const currentProducts = this.productsSubject.value.products.filter(
            (product) => product.sku !== productSku
          );
          const updatedPaginatedData: ProductListPaginated = {
            ...this.productsSubject.value,
            products: currentProducts,
            count: this.productsSubject.value.count - 1,
          };
          this.productsSubject.next(updatedPaginatedData);
          console.log(`Producto ${productSku} eliminado con éxito.`);
        })
      )
      .subscribe();
  }

  updateProduct(formData: FormData): void {
    const skuExisting = formData.get('skuExisting') as string;

    this.http.put<Product>(this.apiUrl, formData)
      .pipe(
        tap((updatedProduct: Product) => {
          const currentProducts = this.productsSubject.value.products.map((product) =>
            product.sku === skuExisting ? updatedProduct : product
          );
          const updatedPaginatedData: ProductListPaginated = {
            ...this.productsSubject.value,
            products: currentProducts,
          };
          this.productsSubject.next(updatedPaginatedData);
        })
      )
      .subscribe();
  }

}
