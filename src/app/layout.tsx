import './globals.css';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

function getFaviconForHost(host: string) {
  // SQ-NOSCAN-START
  // For future use when RbA migrates to this platform
  // if (host.includes('renewalbyandersen.com')) {
  //   return {
  //     url: '/rba/rbafavicon.png',
  //     type: 'image/png',
  //   };
  // }
  // SQ-NOSCAN-END

  return {
    url: '/aw/awfavicon.svg',
    type: 'image/svg+xml',
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';

  const favicon = getFaviconForHost(host);

  return {
    icons: {
      icon: [
        {
          url: favicon.url,
          type: favicon.type,
        },
      ],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
