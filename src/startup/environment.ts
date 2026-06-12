import config from 'aw.config.server';
import { Environment } from 'lib/environment/environment';
import { Environments } from 'lib/environment/environments';
import { Roles } from 'lib/environment/roles';
import { defaultIfNullOrEmpty } from 'lib/utils/string-utils/default-if-null-or-empty';

const environmentName = defaultIfNullOrEmpty(config.app.environment, Environments.production);
const applicationName = defaultIfNullOrEmpty(config.app.application, 'Application');
const roleName = defaultIfNullOrEmpty(config.app.role, Roles.www);

export const environment = new Environment({ environmentName, applicationName, roleName });
