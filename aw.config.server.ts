import { toBoolean } from 'lib/utils/string-utils/to-boolean';

/**
 * Server-side configuration for Andersen Windows application
 * Contains both public and server-only environment variables
 * This file should only be imported in server-side code (API routes, getServerSideProps, etc.)
 */
const serverConfig = {
  /** Application-level settings */
  app: {
    environment: process.env.NEXT_PUBLIC_AW_ENVIRONMENT ?? 'production',
    application: process.env.NEXT_PUBLIC_AW_APPLICATION ?? 'Application',
    role: process.env.NEXT_PUBLIC_AW_ROLE ?? 'www',
  },

  /** Bazaarvoice integration */
  bazaarvoice: {
    apiKey: process.env.AW_BAZAARVOICE_API_KEY ?? '',
    apiUrl: process.env.AW_BAZAARVOICE_API_URL ?? '',
  },

  /** Chatbot (Tech Doc AI) configuration */
  chatbot: {
    api: {
      baseUrl: process.env.AW_CHTBT_API_BASE_URL ?? '',
      username: process.env.AW_CHTBT_API_USERNAME ?? '',
      password: process.env.AW_CHTBT_API_PASSWORD ?? '',
    },
    entra: {
      tenantId: process.env.NEXT_PUBLIC_AW_CHTBT_ENTRA_TENANT_ID ?? '',
      clientId: process.env.NEXT_PUBLIC_AW_CHTBT_ENTRA_CLIENT_ID ?? '',
      clientSecret: process.env.AW_CHTBT_ENTRA_CLIENT_SECRET ?? '',
      redirectUri: process.env.NEXT_PUBLIC_AW_CHTBT_ENTRA_REDIRECT_URI ?? '',
      logoutRedirect: process.env.NEXT_PUBLIC_AW_CHTBT_ENTRA_LOGOUT_REDIRECT ?? '',
    },
  },

  /** Coveo search integration */
  coveo: {
    apiKey: process.env.AW_COVEO_API_KEY ?? '',
    organizationId: process.env.NEXT_PUBLIC_AW_COVEO_ORGANIZATION_ID ?? '',
    farmName: process.env.NEXT_PUBLIC_AW_COVEO_FARM_NAME ?? '',
    indexer: {
      sites: process.env.AW_COVEO_INDEXER_SITES ?? '[]',
      source: process.env.AW_COVEO_INDEXER_SOURCE ?? 'edge',
    },
  },

  /** Enterprise Web API */
  enterpriseApi: {
    url: process.env.AW_ENTERPRISE_WEB_API_URL ?? '',
    key: process.env.AW_ENTERPRISE_WEB_API_KEY ?? '',
  },

  /** Google APIs */
  google: {
    apiKey: process.env.NEXT_PUBLIC_AW_GOOGLE_API_KEY ?? '',
    recaptcha: {
      siteKey: process.env.NEXT_PUBLIC_AW_GOOGLE_RECAPTCHA_SITE_KEY ?? '',
      secretKey: process.env.AW_GOOGLE_RECAPTCHA_SECRET_KEY ?? '',
      projectId: process.env.AW_GOOGLE_RECAPTCHA_PROJECT_ID ?? '',
    },
  },

  /** IFrame Resizer */
  iframeResizer: {
    license: process.env.NEXT_PUBLIC_AW_IFRAMERESIZER_LICENSE ?? '',
  },

  /** Marlimar integration */
  marlimar: {
    baseUrl: process.env.AW_MARLIMAR_BASE_URL ?? 'https://api.marlimar.com',
    hashKeys: {
      shareAR: process.env.AW_MARLIMAR_HASH_KEYS_SHARE_AR ?? '',
    },
  },

  /** Mulesoft API integration */
  mulesoft: {
    apiUrl: process.env.AW_MULESOFT_API_URL ?? '',
    clientId: process.env.AW_MULESOFT_CLIENT_ID ?? '',
    clientSecret: process.env.AW_MULESOFT_CLIENT_SECRET ?? '',
  },

  /** Online Scheduling */
  onlineScheduling: {
    domain: process.env.NEXT_PUBLIC_AW_ONLINE_SCHEDULING_DOMAIN ?? '',
    key: process.env.NEXT_PUBLIC_AW_ONLINE_SCHEDULING_KEY ?? '',
  },

  /** iQ+ Paradigm integration */
  paradigm: {
    authApiUrl: process.env.AW_PARADIGM_AUTH_API_URL ?? '',
    configApiUrl: process.env.AW_PARADIGM_CONFIG_API_URL ?? '',
    appApiUrl: process.env.AW_PARADIGM_APP_API_URL ?? '',
    clientId: process.env.AW_PARADIGM_CLIENT_ID ?? '',
    authSystemId: process.env.AW_PARADIGM_AUTH_SYSTEM_ID ?? '',
    authUsername: process.env.AW_PARADIGM_AUTH_USERNAME ?? '',
    authPassword: process.env.AW_PARADIGM_AUTH_PASSWORD ?? '',
  },

  /** Renewal by Andersen (RBA) integration */
  rba: {
    submitFormEndpointUrl: process.env.AW_RBA_SUBMITFORM_ENDPOINT_URL ?? '',
    authorizationKey: process.env.AW_RBA_AUTHORIZATION_KEY ?? '',
  },

  /** Renoworks design tool */
  renoworks: {
    apiUrl: process.env.NEXT_PUBLIC_AW_RENOWORKS_API_URL ?? '',
    rwd: process.env.NEXT_PUBLIC_AW_RENOWORKS_RWD ?? '',
  },

  /** Salesforce integration */
  salesforce: {
    salesCloud: {
      orgIds: {
        aw: process.env.NEXT_PUBLIC_AW_SF_SC_ORG_IDS_AW ?? '',
      },
      webToLeadUrl: process.env.NEXT_PUBLIC_AW_SF_SC_WEB_TO_LEAD_URL ?? '',
    },
    marketingCloud: {
      authBaseUrl: process.env.AW_SF_MC_AUTH_BASE_URL ?? '',
      restBaseUrl: process.env.AW_SF_MC_REST_BASE_URL ?? '',
      clientId: process.env.AW_SF_MC_CLIENT_ID ?? '',
      clientSecret: process.env.AW_SF_MC_CLIENT_SECRET ?? '',
      accountIds: {
        AW: process.env.AW_SF_MC_ACCOUNT_IDS_AW ?? '',
      },
      tokenTtlMinutes: Number(process.env.AW_SF_MC_TOKEN_TTL_MINUTES ?? 20),
      cacheEnabled: true,
    },
  },

  site: {
    isrInterval: parseInt(process.env.AW_SITE_ISR_INTERVAL || '5'),
    ignoreMediaRedirect: toBoolean(process.env.AW_SITE_IGNORE_MEDIA_REDIRECT),
  },

  /** TrustArc privacy */
  trustArc: {
    cmid: process.env.NEXT_PUBLIC_AW_TRUSTARC_CMID ?? '',
  },

  /** Shareholder Meeting Registration */
  shareholderRegistration: {
    zoomURL: process.env.AW_SHAREHOLDER_ZOOM_URL ?? '',
    salt: process.env.AW_SHAREHOLDER_SALT ?? '',
    codesSha256: process.env.AW_SHAREHOLDER_CODES_SHA256 ?? '[]',
  },

  /** Lever Job Application Service */
  lever: {
    baseUrl: process.env.AW_LEVER_API_HOST ?? '',
    apiKey: process.env.AW_LEVER_API_KEY ?? '',
  },

  /** Salesforce Marketing Cloud */
  /** External Database (Sequelize MSSQL) */
  externalDb: {
    database: process.env.AW_EXTERNALDB_NAME!,
    username: process.env.AW_EXTERNALDB_USER!,
    password: process.env.AW_EXTERNALDB_PASSWORD ?? '',
    server: process.env.AW_EXTERNALDB_SERVER!,
    port: 1433,
    dialect: 'mssql' as const,
  },

  /** Send Grid System */
  sendGrid: {
    apiKey: process.env.AW_SENDGRID_API_KEY ?? '',
  },
};

export default serverConfig;
