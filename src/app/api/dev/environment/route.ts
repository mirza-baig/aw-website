import { environment } from 'startup/environment';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  const result = {
    application: environment.applicationName,
    environment: environment.environmentName,
    role: environment.roleName,
    isLocal: environment.isLocal(),
    isDevelopment: environment.isDevelopment(),
    isUat: environment.isUat(),
    isProduction: environment.isProduction(),
    isPreview: environment.isPreview(),
    isWww: environment.isWww(),
  };

  return Response.json(result);
}
