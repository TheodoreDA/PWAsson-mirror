export interface IBuilder<T> {
  reset(): IBuilder<T>;
  build(): T;
}
