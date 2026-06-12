// Small hack to force relative URLs for images fetched from GraphQL
export const forceRelativeUrl = (url?: string): string => `/-/${(url as string).split('/-/')[1]}`;
