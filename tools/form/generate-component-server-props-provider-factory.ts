import fs from 'fs';
import path from 'path';

import buildFactory, {
  ComponentServerPropsProviderObjectFile,
} from './templates/component-server-props-provider-factory';
import { getItems } from './utils';

const DEFAULT_OUTPUT_PATH = '.sitecore/';

/**
 * Configuration object for generating form action factory.
 */
export type GenerateComponentServerPropsFactoryConfig = {
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
const fileFormat = new RegExp(/(component-server-props)\.ts$/);

const fieldFormat = new RegExp(/.+\/(.+)\/helpers$/);

/**
 * Generates the form action factory file and saves it to the filesystem.
 */
export function generateComponentServerPropsProviderFactory({
  rootPath,
  generatedFile,
  destinationPath,
}: GenerateComponentServerPropsFactoryConfig) {
  return async () => {
    const packages: Array<any> = [];
    const actions = getList(rootPath);

    actions.unshift(...packages);

    const fileContent = buildFactory(actions);

    const outputPath = path.resolve(destinationPath ?? DEFAULT_OUTPUT_PATH, generatedFile);
    console.log(`Writing component server props factory to ${outputPath}`);
    fs.writeFileSync(outputPath, fileContent, {
      encoding: 'utf8',
    });
  };
}

function getList(path: string): Array<ComponentServerPropsProviderObjectFile> {
  const items = getItems({
    path,
    resolveItem: (path, name) => {
      return {
        path: `${path}/${name}`,
        fieldName: path.match(fieldFormat)![1],
      };
    },
    cb: (item) => console.debug(`Registering component server props provider ${item.fieldName}`),
    fileFormat: fileFormat,
  });

  return items;
}
