import fs from 'fs';
import path from 'path';

import buildFactory, {
  FormItemDetailProviderObjectFile,
} from './templates/form-item-detail-provider-factory';
import { getItems } from './utils';

const DEFAULT_OUTPUT_PATH = '.sitecore/';

/**
 * Configuration object for generating form action factory.
 */
export type GenerateFormItemDetailProviderFactoryConfig = {
  /**
   * Path for the XMCloud repository.
   */
  rootPath: string;

  /**
   * Name of the generated file.
   */
  generatedFile: string;

  /**
   * Optional path where the generated will be saved.
   * If not provided, the default '.sitecore/' will be used.
   */
  destinationPath?: string;
};

// Matches TypeScript files that are not type definition files (name.d.ts) or storybook stories (name.stories.tsx)
const fileFormat = new RegExp(/(form-item-detail-provider)\.ts$/);

const fieldFormat = new RegExp(/.+\/(.+)\/helpers$/);

/**
 * Generates the form action factory file and saves it to the filesystem.
 */
export function generateFormItemDetailProviderFactory({
  rootPath,
  generatedFile,
  destinationPath,
}: GenerateFormItemDetailProviderFactoryConfig) {
  return async () => {
    const packages: Array<any> = [];
    const actions = getList(rootPath);

    actions.unshift(...packages);

    const fileContent = buildFactory(actions);

    const outputPath = path.resolve(destinationPath ?? DEFAULT_OUTPUT_PATH, generatedFile);
    console.log(`Writing form item detail provider factory to ${outputPath}`);
    fs.writeFileSync(outputPath, fileContent, {
      encoding: 'utf8',
    });
  };
}

function getList(path: string): Array<FormItemDetailProviderObjectFile> {
  const items = getItems({
    path,
    resolveItem: (path, name) => {
      return {
        path: `${path}/${name}`,
        fieldName: path.match(fieldFormat)![1],
      };
    },
    cb: (item) => console.debug(`Registering form item detail provider ${item.fieldName}`),
    fileFormat: fileFormat,
  });

  return items;
}
