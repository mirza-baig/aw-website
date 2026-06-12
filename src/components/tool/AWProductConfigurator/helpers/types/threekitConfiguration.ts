export interface TextAttribute {
  AttributeName: string;
  AttributeValue: string;
}

export interface IntegerAttribute {
  AttributeName: string;
  AttributeValue: number;
}

export interface ThreekitConfiguration {
  AssetId: string;
  TextAttributes: TextAttribute[];
  IntegerAttributes: IntegerAttribute[];
}
