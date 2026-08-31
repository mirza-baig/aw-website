import { isEqualIgnoreCase } from 'lib/utils/string-utils/is-equal-ignore-case';

import { Environments } from './environments';
import { Roles } from './roles';

export class Environment {
  readonly environmentName: string;
  readonly applicationName: string;
  readonly roleName: string;

  constructor({
    environmentName,
    applicationName,
    roleName,
  }: {
    environmentName: Environments | string;
    applicationName: string;
    roleName: Roles | string;
  }) {
    this.applicationName = applicationName;
    this.environmentName = environmentName;
    this.roleName = roleName;
  }

  isEnvironment(environment: Environments | string): boolean {
    return isEqualIgnoreCase(this.environmentName, environment);
  }

  isRole(role: Roles | string): boolean {
    return isEqualIgnoreCase(this.roleName, role);
  }

  isProduction(): boolean {
    return this.isEnvironment(Environments.production);
  }

  isUat(): boolean {
    return this.isEnvironment(Environments.uat);
  }

  isDevelopment(): boolean {
    return this.isEnvironment(Environments.development);
  }

  isLocal(): boolean {
    return this.isEnvironment(Environments.local);
  }

  isPreview(): boolean {
    return this.isRole(Roles.preview);
  }

  isWww(): boolean {
    return this.isRole(Roles.www);
  }

  isVercelProduction(): boolean {
    // Vercel should return one of three different VERCEL_ENV values: development, preview, and production.
    return process.env.VERCEL_ENV?.toLowerCase() === 'production';
  }
}
