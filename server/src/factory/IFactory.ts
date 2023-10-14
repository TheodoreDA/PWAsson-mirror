export interface IFactory<T> {
  reset(): IFactory<T>;
  build(): T;
}
