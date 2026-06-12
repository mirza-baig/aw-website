import Script from 'next/script';
import { JSX } from 'react';

export const SchemaOrgHelper = ({ id, schema }: { id: string; schema: unknown }): JSX.Element => {
  return (
    <Script
      id={id}
      strategy="beforeInteractive"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
