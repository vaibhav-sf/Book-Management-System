import { IRepository } from "../interfaces/IRepository.js";
export class Repository<T> implements IRepository<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  remove(item: T): void {
    const i = this.items.indexOf(item);
    if (i !== -1) this.items.splice(i, 1);
  }
  update(oldItem: T, newItem: T): void {
    const i = this.items.indexOf(oldItem);
    if (i !== -1) this.items[i] = newItem;
  }

  getAll(): T[] {
    return [...this.items];
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  count(): number {
    return this.items.length;
  }
}