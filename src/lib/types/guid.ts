/** Values accepted as GUIDs. */
export type GuidTypes = Guid | string;

/** Represents and formats a normalized GUID value. */
export class Guid {
  private static _empty: Guid; //NOSONAR - Can't be readonly because a static property of the containing type cannot be set at initialization

  /** @returns The shared empty GUID singleton. */
  static get empty(): Guid {
    if (!Guid._empty) {
      Guid._empty = new Guid('00000000-0000-0000-0000-000000000000');
    }
    return Guid._empty;
  }

  /**
   * Determines whether a value is a recognized GUID.
   *
   * @param value The value to validate.
   * @returns True when the value is a Guid or recognized GUID string.
   */
  static isGuid(value: unknown): value is GuidTypes {
    if (value instanceof Guid) {
      return true;
    }

    return Guid.validator.test(String(value));
  }

  /** @returns A newly generated GUID. */
  static newGuid(): Guid {
    return new Guid([Guid.gen(2), Guid.gen(1), Guid.gen(1), Guid.gen(1), Guid.gen(3)].join('-'));
  }

  /**
   * Parses a GUID string.
   *
   * @param value The GUID string to parse.
   * @returns A Guid instance.
   * @throws {TypeError} If the value is not a recognized GUID format.
   */
  static parse(value: string): Guid {
    return new Guid(value);
  }

  /**
   * Attempts to parse a GUID string without throwing.
   *
   * @param value The GUID string to parse.
   * @returns A success result with the parsed GUID, or a failure result containing Guid.empty.
   */
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
      out += Math.trunc((1 + Math.random()) * 0x10000) // NOSONAR - This is an acceptable RNG
        .toString(16)
        .substring(1);
    }
    return out;
  }

  private formatString(start: string, stop: string) {
    const result = `${start}${this.value.substring(0, 8)}-${this.value.substring(8, 12)}-${this.value.substring(12, 16)}-${this.value.substring(16, 20)}-${this.value.substring(20)}${stop}`;
    return result;
  }

  private readonly value: string;

  /**
   * Creates a Guid from a GUID instance or recognized GUID string.
   *
   * @param value The value used to create the GUID.
   * @throws {TypeError} If the value is not a recognized GUID format.
   */
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

  /**
   * Compares this GUID with another GUID value.
   *
   * @param other The GUID or GUID string to compare.
   * @returns True when both values represent the same GUID.
   */
  public equals(other: GuidTypes): boolean {
    return this.value === other.toString();
  }

  /** @returns True only for the Guid.empty singleton. */
  public get isEmpty(): boolean {
    return this === Guid.empty;
  }

  /**
   * Converts the GUID to a string in the requested format.
   *
   * @param format `N` for compact, `D` for dashed, `B` for braces, or `P` for parentheses.
   * @returns The formatted GUID string.
   * @throws {Error} If the format is unsupported.
   */
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

  /** @returns An object containing the compact GUID value. */
  public toJSON(): { value: string } {
    return {
      value: this.toString(),
    };
  }
}
