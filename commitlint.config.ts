import type { UserConfig } from '@commitlint/types';

const Configuration: UserConfig = {
  plugins: ['commitlint-plugin-jira-rules'],
  extends: ['jira'],
  rules: {
    'jira-task-id-project-key': [2, 'always', ['EW','AWEB']],
    'header-full-stop': [2, 'always', '.'],
  },
};

export default Configuration;
