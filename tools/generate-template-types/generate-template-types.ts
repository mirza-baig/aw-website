import chalk from 'chalk';
import child_process from 'child_process';
import fs from 'fs';
import path from 'path';

const DEFAULT_OUTPUT_PATH = '.sitecore/';

/**
 * Configuration object for generating template types.
 */
export type GenerateTemplateTypesConfig = {
  /**
   * Path for the XMCloud repository.
   */
  xmcloudRepoPath: string;

  /**
   * Name of the generated types file.
   */
  generatedFile: string;

  /**
   * Optional path where the generated types will be saved.
   * If not provided, the default '.sitecore/' will be used.
   */
  destinationPath?: string;
};

export const generateTemplateTypes = ({
  xmcloudRepoPath,
  generatedFile,
  destinationPath,
}: GenerateTemplateTypesConfig): (() => Promise<void>) => {
  return async () => {
    const outputPath = path.resolve(destinationPath ?? DEFAULT_OUTPUT_PATH, generatedFile);
    const sourcePath = path.resolve(
      xmcloudRepoPath,
      'authoring',
      'codegen',
      'output',
      generatedFile
    );

    const repoExists = fs.existsSync(xmcloudRepoPath);
    const outputExists = fs.existsSync(outputPath);

    if (!repoExists && !outputExists) {
      console.error(
        chalk.red(
          `Error generating template types, XMCloud solution repository '${xmcloudRepoPath}' not found and previous run does not exist. Did you forget to set 'AW_XM_CLOUD_REPO_PATH' in your .env.local file?`
        )
      );
      process.exit(-1);
    }

    if (!repoExists) {
      console.log(
        chalk.yellow(
          `Warning: XMCloud solution repository '${xmcloudRepoPath}' not found, but '${outputPath}' exists. Continuing with a possibly stale file.`
        )
      );
      process.exit();
    }

    try {
      console.log(chalk.blue(`Executing leprechaun in '${xmcloudRepoPath}'...`));
      child_process.execSync('npm run leprechaun', { cwd: xmcloudRepoPath });
    } catch (error) {
      console.error(chalk.red('Error during leprechaun execution'));
      console.error(error);
      process.exit(-1);
    }

    console.log(chalk.blue(`Copying '${sourcePath}' to '${outputPath}'...`));
    fs.copyFileSync(sourcePath, outputPath);

    console.log(chalk.green(`Generating template types complete.`));
  };
};
