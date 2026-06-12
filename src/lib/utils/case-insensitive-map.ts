export class CaseInsensitiveMap<T> extends Map<string, T> {
  set(key: string, value: T): this {
    return super.set(key.toLowerCase(), value);
  }

  get(key: string): T | undefined {
    return super.get(key.toLowerCase());
  }

  has(key: string): boolean {
    return super.has(key.toLowerCase());
  }
}
