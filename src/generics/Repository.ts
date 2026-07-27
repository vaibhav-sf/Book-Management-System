export class Repository<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  remove(index: number): void {
    this.items.splice(index, 1);
  }

  update(index: number, item: T): void {
    this.items[index] = item;
  }

  getAll(): T[] {
    return [...this.items];
  }

  get(index: number): T {
    return this.items[index];
  }

  count(): number {
    return this.items.length;
  }
}