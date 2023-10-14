import { IFactory } from './IFactory';

export abstract class AFactory<T> implements IFactory<T> {
  protected object: T;

  protected constructor() {
    this.reset();
  }

  abstract reset(): IFactory<T>;

  build(): T {
    const object = this.object;

    this.reset();
    return object;
  }
}
