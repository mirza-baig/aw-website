import fs from 'fs';
import path from 'path';
// import generateFieldFactory, { ComponentFile, PackageDefinition } from './templates/form-factory';
import { getItems } from './utils';
import buildFormActionFactory from './templates/form-action-factory';

const DEFAULT_OUTPUT_PATH = '.sitecore/';

/**
 * Configuration object for generating form action factory.
 */
export type GenerateFormActionFactoryConfig = {
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
const fileFormat = new RegExp(
  /(.+)(?<!\.d)(?<!\.mock-data)(?<!\.Theme)(?<!\.stories)(?<!\.test)(?<!\.helpers)(?<!\.graphql)\.tsx?$/
);

/**
 * Generates the form action factory file and saves it to the filesystem.
 */
export function generateFormActionFactory({
  rootPath,
  generatedFile,
  destinationPath,
}: GenerateFormActionFactoryConfig) {
  return async () => {
    const packages: Array<any> = [];
    const actions = getFormActionList(rootPath);

    actions.unshift(...packages);

    const fileContent = buildFormActionFactory(actions);

    const outputPath = path.resolve(destinationPath ?? DEFAULT_OUTPUT_PATH, generatedFile);
    console.log(`Writing form action factory to ${outputPath}`);
    fs.writeFileSync(outputPath, fileContent, {
      encoding: 'utf8',
    });
  };
}

function getFormActionList(path: string): Array<any> {
  const actions = getItems({
    path,
    resolveItem: (path, name) => ({
      path: `${path}/${name}`,
      actionName: name,
      moduleName: name.replace(/[^\w]+/g, ''),
    }),
    cb: (item) => console.debug(`Registering form action ${item.actionName}`),
    fileFormat: fileFormat,
  });

  return actions;
}
