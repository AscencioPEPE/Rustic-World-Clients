import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ClientType, Product } from '../../product.model';

declare var bootstrap: any;

@Component({
  standalone: true,
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styleUrls: ['./modal-image.component.scss'],
  imports: [CommonModule]
})
export class ModalImageComponent {
  @Input() selectedProduct!: Product;
  @Input() clientType!: ClientType;

  constructor() { }
  
  closeImageModal(): void {

  }

}
