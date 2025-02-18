export interface Kanban<T, S> {
    status: S;
    items: T[];
}