interface TextAttribute {
  AttributeName: string;
  AttributeValue: string;
}

interface IntegerAttribute {
  AttributeName: string;
  AttributeValue: number;
}

interface ThreekitConfiguration {
  AssetId: string;
  TextAttributes: TextAttribute[];
  IntegerAttributes: IntegerAttribute[];
}

type ConfigurationObject = Record<string, string | number>;

export const convertThreekitConfigToObject = (
  config: ThreekitConfiguration
): ConfigurationObject => {
  const configObject: ConfigurationObject = {};

  // Add all text attributes
  config.TextAttributes.forEach((attr) => {
    configObject[attr.AttributeName] = attr.AttributeValue;
  });

  // Add all integer attributes
  config.IntegerAttributes.forEach((attr) => {
    configObject[attr.AttributeName] = attr.AttributeValue;
  });

  return configObject;
};
