export type Factory<T> = (name: string) => T | null;

export type FactoryBuilderConfig<T> = {
  map: Map<string, T>;
};

export class FactoryBuilder<T> {
  protected map: Map<string, T>;

  constructor(protected config: FactoryBuilderConfig<T>) {
    this.map = new Map([...config.map]);
  }

  getFactory(): Factory<T> {
    return (name: string) => {
      const result = this.map.get(name);
      if (result === undefined) {
        return null;
      }

      return result;
    };
  }
}
