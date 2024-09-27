import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GenericModule } from '../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  @Input() categories: { label: string, value: string }[] = [];
  @Output() categorySelected = new EventEmitter<string>();

  onCategoryClick(value: string): void {
    console.log('Category Clicked:', value); // Adicione esta linha
    this.categorySelected.emit(value);
  }
}