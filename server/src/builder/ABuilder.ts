import { Models } from 'node-appwrite';
import { IBuilder } from './IBuilder';

export abstract class ABuilder<T> implements IBuilder<T> {
  protected object: T;

  protected constructor() {
    this.reset();
  }

  abstract reset(): IBuilder<T>;

  build(): T {
    const object = this.object;

    this.reset();
    return object;
  }

  abstract buildFromDoc(docs: Models.Document): T;

  buildFromDocs(docs: Models.DocumentList<Models.Document>): T[] {
    if (docs == undefined || docs.total == 0) return [];

    return docs.documents.map((doc) => this.buildFromDoc(doc));
  }
}
