export function isScrolledToBottom(event: Event, offset: number = 100): boolean {
    const element = event.target as HTMLElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    return scrollTop + clientHeight >= scrollHeight - offset;
}