import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [MatPaginator],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() pageIndex = 0;

  @Output() pageChange = new EventEmitter<{ pageIndex: number; pageSize: number }>();

  onPageChange(event: PageEvent) {
    this.pageChange.emit({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize
    });
  }
}
