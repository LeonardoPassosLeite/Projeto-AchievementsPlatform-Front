export class InfinitePaginator {
  page = 1;
  pageSize = 10;
  loading = false;
  hasMore = true;

  reset(): void {
    this.page = 1;
    this.hasMore = true;
    this.loading = false;
  }

  advance(): void {
    this.page++;
  }
}

export function isNearBottom(element: HTMLElement, threshold = 100): boolean {
  return element.scrollTop + element.clientHeight >= element.scrollHeight - threshold;
}
