export interface IRepository<T> {
    add(item: T): void;
    remove(item: T): void;
    update(oldItem: T, newItem: T): void;
    getAll(): T[];
    get(index: number): T | undefined;
    count(): number;
}