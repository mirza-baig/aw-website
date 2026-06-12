import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config-cli';
import {
  extractFiles,
  generateMetadata,
  generateSites,
  writeImportMap,
} from '@sitecore-content-sdk/nextjs/tools';
import { generateComponentServerPropsProviderFactory } from 'tools/form/generate-component-server-props-provider-factory';
import { generateFormActionFactory } from 'tools/form/generate-form-action-factory';
import { generateFormItemDetailProviderFactory } from 'tools/form/generate-form-item-detail-provider-factory'
import { generateFormPageDetailProviderFactory } from 'tools/form/generate-form-page-detail-provider-factory';
import { generateSiteInfo } from 'tools/generate-site-info/generate-site-info';
import { generateTemplateTypes } from 'tools/generate-template-types/generate-template-types';

import scConfig from './sitecore.config';

export default defineCliConfig({
  config: scConfig,
  build: {
    commands: [
      generateMetadata(),
      generateSites(),
      generateSiteInfo({
        generatedFile: 'aw-sites.ts',
      }),
      extractFiles(),
      generateTemplateTypes({
        xmcloudRepoPath: process.env.AW_XM_CLOUD_REPO_PATH ?? '',
        generatedFile: 'AndersenWindows.model.ts',
      }),
      generateFormActionFactory({
        rootPath: 'src/helpers/CustomForms/SubmitActions/Actions',
        generatedFile: 'aw-form-action-factory.ts',
      }),
      generateFormItemDetailProviderFactory({
        rootPath: 'src/components/forms/GenericFormBuilder',
        generatedFile: 'aw-form-item-detail-provider-factory.ts',
      }),
      generateFormPageDetailProviderFactory({
        rootPath: 'src/components/forms/GenericFormBuilder',
        generatedFile: 'aw-form-page-detail-provider-factory.ts',
      }),
      generateComponentServerPropsProviderFactory({
        rootPath: 'src/components',
        generatedFile: 'aw-component-server-props-provider-factory.ts',
      }),
      writeImportMap({
        paths: ['src/components'],
        exclude: ['src/components/**/helpers/**', 'src/components/**/tests/**'],
      }),
    ],
  },
  componentMap: {
    paths: ['src/components'],
    exclude: ['src/components/content-sdk/*', 'src/components/**/helpers/**', 'src/components/**/tests/**'],
  },
});
