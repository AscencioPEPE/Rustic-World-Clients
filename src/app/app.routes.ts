import { Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';

export const routes: Routes = [
    { path: 'product', component: ProductComponent },
    { path: '', redirectTo: '/product', pathMatch: 'full' }
];
