import { Component, EventEmitter, ElementRef, Input, Output, QueryList, SimpleChanges, TemplateRef, ViewChildren, OnChanges } from '@angular/core';
import { GenericModule } from '../../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent<T extends { id: number; gameName: string, status: S }, S> implements OnChanges {
  @ViewChildren('scrollContainer') scrollContainers!: QueryList<ElementRef>;

  @Input() items: T[] = [];
  @Input() statuses: S[] = [];
  @Input() getStatusName!: (status: S) => string;
  @Input() itemTemplate!: TemplateRef<any>;
  @Output() statusUpdated = new EventEmitter<{ id: number; newStatus: S }>();

  organizedItems: { status: S, items: T[] }[] = [];

  canScrollLeftMap: Record<string, boolean> = {};
  canScrollRightMap: Record<string, boolean> = {};

  private updateScrollTimeout: ReturnType<typeof setTimeout> | null = null;

  ngAfterViewInit(): void {
    setTimeout(() => this.updateScrollState(), 500);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.hasSignificantChange(changes)) {
      this.organizeItems();
    }
  }

  private organizeItems(): void {
    this.organizedItems = this.statuses.map(status => ({
      status,
      items: this.items.filter(item => item.status === status) as T[] || [],
    }));
  }

  private hasSignificantChange(changes: SimpleChanges): boolean {
    return (
      (changes['items'] && !this.arraysAreEqual(changes['items'].previousValue, changes['items'].currentValue)) ||
      (changes['statuses'] && !this.arraysAreEqual(changes['statuses'].previousValue, changes['statuses'].currentValue))
    );
  }

  private arraysAreEqual(a: any[], b: any[]): boolean {
    if (!a || !b || a.length !== b.length) return false;
    return new Set(a).size === new Set(b).size;
  }


  private scheduleScrollUpdate(): void {
    if (this.updateScrollTimeout) {
      clearTimeout(this.updateScrollTimeout);
    }

    this.updateScrollTimeout = setTimeout(() => this.updateScrollState(), 300);
  }

  updateScrollState(): void {
    this.scrollContainers.forEach((containerRef) => {
      const container = containerRef.nativeElement as HTMLElement;
      const status = container.getAttribute('data-status');
      if (!status) return;

      this.canScrollLeftMap[status] = container.scrollLeft > 0;
      this.canScrollRightMap[status] = container.scrollLeft + container.clientWidth < container.scrollWidth;
    });
  }

  prevSlide(status: S): void {
    this.scrollByAmount(status, -0.5);
  }

  nextSlide(status: S): void {
    this.scrollByAmount(status, 0.5);
  }

  private scrollByAmount(status: S, multiplier: number): void {
    const container = this.getContainerByStatus(status);
    if (!container) return;

    container.scrollBy({ left: container.clientWidth * multiplier, behavior: 'smooth' });
    this.scheduleScrollUpdate();
  }

  private getContainerByStatus(status: S): HTMLElement | null {
    return this.scrollContainers.find(ref => ref.nativeElement.getAttribute('data-status') === this.getStatusName(status))?.nativeElement ?? null;
  }


} 