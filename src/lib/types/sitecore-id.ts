import { Guid } from 'lib/types/guid';

export type SitecoreIdTypes = string | Guid | SitecoreId;

/** Represents values accepted as Sitecore IDs. */
export class SitecoreId {
  private static _null: SitecoreId; //NOSONAR - Can't be readonly because a static property of the containing type cannot be set at initialization

  /** @returns The shared null Sitecore ID singleton. */
  static get null(): SitecoreId {
    if (!SitecoreId._null) {
      SitecoreId._null = new SitecoreId(Guid.empty);
    }
    return SitecoreId._null;
  }

  /**
   * Determines whether a value can represent a Sitecore ID.
   *
   * @param id The value to validate.
   * @returns True when the value is a Sitecore ID, Guid, or valid GUID string.
   */
  static isId(id: unknown): id is SitecoreIdTypes {
    if (id instanceof SitecoreId) {
      return true;
    }
    if (id instanceof Guid) {
      return true;
    }

    return Guid.isGuid(String(id));
  }

  /** @returns A Sitecore ID containing a newly generated GUID. */
  static newId(): SitecoreId {
    return new SitecoreId(Guid.newGuid());
  }

  /**
   * Determines whether an ID is null, undefined, or the null singleton.
   *
   * @param id The ID to check.
   * @returns True when the ID is null, undefined, or the null singleton.
   */
  static isNullOrEmpty(id: SitecoreId | null | undefined): boolean {
    return id?.isNull ?? true;
  }

  /** The normalized GUID value. */
  readonly id: Guid;

  /**
   * Creates a Sitecore ID from a GUID, string, or existing Sitecore ID.
   *
   * @param id The value used to create the ID.
   * @throws {TypeError} If the value is not a valid GUID or supported ID.
   */
  constructor(id: unknown) {
    if (id instanceof SitecoreId) {
      this.id = id.id;
      return;
    }
    if (id instanceof Guid) {
      this.id = id;
      return;
    }

    if (!SitecoreId.isId(id)) {
      throw new TypeError(`SitecoreId!new: '${id}' is not a valid id`);
    }

    this.id = Guid.parse(String(id));
  }

  /**
   * Compares this ID with another supported ID value.
   *
   * @param other The ID to compare.
   * @returns True when both IDs have the same compact GUID representation.
   */
  public equals(other: SitecoreIdTypes): boolean {
    return this.id.toString() === other.toString();
  }

  /** @returns True only when this instance is the null singleton. */
  public get isNull(): boolean {
    return this === SitecoreId.null;
  }

  /**
   * Converts the ID to a GUID string.
   *
   * @param format The GUID format, such as `N`, `D`, `B`, or `P`.
   * @returns The formatted GUID string.
   */
  toString(format: string = 'N') {
    return this.id.toString(format);
  }

  /** @returns The ID as an uppercase compact GUID string. */
  toShortId(): string {
    return this.id.toString('N').toUpperCase();
  }

  /** @returns An object containing the compact ID string. */
  public toJSON(): { id: string } {
    return {
      id: this.toString(),
    };
  }
}
