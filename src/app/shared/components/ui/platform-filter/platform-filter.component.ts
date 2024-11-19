import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-platform-filter',
  standalone: true,
  imports: [],
  templateUrl: './platform-filter.component.html',
  styleUrl: './platform-filter.component.scss'
})
export class PlatformFilterComponent {
  @Output() platformSelected = new EventEmitter<string>();

  selectPlatform(platform: string): void {
    this.platformSelected.emit(platform);
  }
}