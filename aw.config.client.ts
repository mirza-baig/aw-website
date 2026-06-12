/**
 * Client-side configuration for Andersen Windows application
 * Contains only NEXT_PUBLIC_* environment variables that are safe to expose to the browser
 */
const clientConfig = {
  /** Application-level settings */
  app: {
    environment: process.env.NEXT_PUBLIC_AW_ENVIRONMENT ?? 'production',
    application: process.env.NEXT_PUBLIC_AW_APPLICATION ?? 'Application',
    role: process.env.NEXT_PUBLIC_AW_ROLE ?? 'www',
  },

  //** Application Insights monitoring */
  applicationInsights: {
    connectionString: process.env.NEXT_PUBLIC_AW_APPLICATIONINSIGHTS_CONNECTION_STRING ?? '',
  },

  /** Chatbot (Tech Doc AI) configuration - client settings */
  chatbot: {
    entra: {
      tenantId: process.env.NEXT_PUBLIC_AW_CHTBT_ENTRA_TENANT_ID ?? '',
      clientId: process.env.NEXT_PUBLIC_AW_CHTBT_ENTRA_CLIENT_ID ?? '',
      redirectUri: process.env.NEXT_PUBLIC_AW_CHTBT_ENTRA_REDIRECT_URI ?? '',
      logoutRedirect: process.env.NEXT_PUBLIC_AW_CHTBT_ENTRA_LOGOUT_REDIRECT ?? '',
    },
  },

  /** Coveo search integration - client settings */
  coveo: {
    organizationId: process.env.NEXT_PUBLIC_AW_COVEO_ORGANIZATION_ID ?? '',
    farmName: process.env.NEXT_PUBLIC_AW_COVEO_FARM_NAME ?? '',
  },

  /** Google APIs */
  google: {
    apiKey: process.env.NEXT_PUBLIC_AW_GOOGLE_API_KEY ?? '',
    recaptcha: {
      siteKey: process.env.NEXT_PUBLIC_AW_RECAPTCHA_SITE_KEY ?? '',
    },
  },

  /** IFrame Resizer */
  iframeResizer: {
    license: process.env.NEXT_PUBLIC_AW_IFRAMERESIZER_LICENSE ?? '',
  },

  /** Online Scheduling */
  onlineScheduling: {
    domain: process.env.NEXT_PUBLIC_AW_ONLINE_SCHEDULING_DOMAIN ?? '',
    key: process.env.NEXT_PUBLIC_AW_ONLINE_SCHEDULING_KEY ?? '',
  },

  /** iQ+ Paradigm integration - client settings */
  paradigm: {
    baseUrl: process.env.NEXT_PUBLIC_AW_PARADIGM_BASE_IMAGE_URL ?? '',
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
  },

  /** TrustArc privacy */
  trustArc: {
    cmid: process.env.NEXT_PUBLIC_AW_TRUSTARC_CMID ?? '',
  },
};

export default clientConfig;
