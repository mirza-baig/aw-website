export type GuidTypes = Guid | string;

export class Guid {
  private static _empty: Guid; //NOSONAR - Can't be readonly because a static property of the containing type cannot be set at initialization
  static get empty(): Guid {
    if (!Guid._empty) {
      Guid._empty = new Guid('00000000-0000-0000-0000-000000000000');
    }
    return Guid._empty;
  }

  static isGuid(value: unknown): value is GuidTypes {
    if (value instanceof Guid) {
      return true;
    }

    return Guid.validator.test(String(value));
  }

  static newGuid(): Guid {
    return new Guid([Guid.gen(2), Guid.gen(1), Guid.gen(1), Guid.gen(1), Guid.gen(3)].join('-'));
  }

  static parse(value: string): Guid {
    return new Guid(value);
  }

  static tryParse(value: string): { success: boolean; guid: Guid } {
    if (Guid.isGuid(value)) {
      return { success: true, guid: new Guid(value) };
    }
    return { success: false, guid: Guid.empty };
  }

  protected static readonly validator: RegExp =
    /^\s?[{(]?[a-f0-9]{8}[-]?[a-f0-9]{4}[-]?[a-f0-9]{4}[-]?[a-f0-9]{4}[-]?[a-f0-9]{12}[})]?\s?$/i; // NOSONAR - Cannot reduce the complexity

  protected static gen(count: number) {
    let out: string = '';
    for (let i: number = 0; i < count; i++) {
      // tslint:disable-next-line:no-bitwise
      out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return out;
  }

  private formatString(start: string, stop: string) {
    const result = `${start}${this.value.substring(0, 8)}-${this.value.substring(8, 12)}-${this.value.substring(12, 16)}-${this.value.substring(16, 20)}-${this.value.substring(20)}${stop}`;
    return result;
  }

  private value: string;

  constructor(value: unknown) {
    if (value instanceof Guid) {
      this.value = value.value;
      return;
    }

    if (!Guid.isGuid(value)) {
      throw new TypeError(`Guid!new: '${value}' is not in a recognized format.`);
    }

    this.value = String(value)
      .toLowerCase()
      .replaceAll(/[{(\-)}\\s]/g, '');
  }

  public equals(other: GuidTypes): boolean {
    return this.value === other.toString();
  }

  public get isEmpty(): boolean {
    return this === Guid.empty;
  }

  public toString(format: string = 'N'): string {
    switch (format) {
      case 'N':
        return this.value;
      case 'D':
        return this.formatString('', '');
      case 'B':
        return this.formatString('{', '}');
      case 'P':
        return this.formatString('(', ')');
    }
    throw new Error(`Guid!toString: Unknown format '${format}'.`);
  }

  public toJSON(): { value: string } {
    return {
      value: this.toString(),
    };
  }
}
