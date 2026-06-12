import { Guid } from 'lib/utils/object-utils/guid';

export type SitecoreIdTypes = string | Guid | SitecoreId;

export class SitecoreId {
  private static _null: SitecoreId; //NOSONAR - Can't be readonly because a static property of the containing type cannot be set at initialization
  static get null(): SitecoreId {
    if (!SitecoreId._null) {
      SitecoreId._null = new SitecoreId(Guid.empty);
    }
    return SitecoreId._null;
  }

  static isId(id: unknown): id is SitecoreIdTypes {
    if (id instanceof SitecoreId) {
      return true;
    }
    if (id instanceof Guid) {
      return true;
    }

    return Guid.isGuid(String(id));
  }

  static newId(): SitecoreId {
    return new SitecoreId(Guid.newGuid());
  }

  static isNullOrEmpty(id: SitecoreId | null | undefined): boolean {
    return id?.isNull ?? true;
  }

  readonly id: Guid;

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

  public equals(other: SitecoreIdTypes): boolean {
    return this.id.toString() === other.toString();
  }

  public get isNull(): boolean {
    return this === SitecoreId.null;
  }

  toString(format: string = 'N') {
    return this.id.toString(format);
  }

  toShortId(): string {
    return this.id.toString('N').toUpperCase();
  }

  public toJSON(): { id: string } {
    return {
      id: this.toString(),
    };
  }
}
