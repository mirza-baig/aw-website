'use client';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { JSX, useEffect } from 'react';

const TrustArcHeaderSnippet = (trustArcCmId: string) => {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script
        src={`https://consent.trustarc.com/v2/autoblockasset/core.min.js?cmId=${trustArcCmId}`}
      ></script>
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src={`https://consent.trustarc.com/v2/autoblock?cmId=${trustArcCmId}`}></script>
      <script
        type="text/javascript"
        async={true}
        src={`https://consent.trustarc.com/v2/notice/${trustArcCmId}`}
      ></script>
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener("message", function(event) {
              var eventDataJson = null;
              try {
                eventDataJson = JSON.parse(event.data);
              } catch (e) {
              }
              // Safeguard to make sure we are only getting events from TrustArc
              if (eventDataJson && eventDataJson.source === "preference_manager") {
                // Means that the user has submited their preferences
                if (eventDataJson.message === "submit_preferences") {
                  setTimeout(function () {
                    window.location.reload();
                  }, 20);
                }
              }
            }, false);
          `,
        }}
      ></script>
    </>
  );
};

export const TrustArcScript = (): JSX.Element => {
  const { page } = useSitecore();
  const trustArcCmId = process.env.NEXT_PUBLIC_AW_TRUSTARC_CMID ?? '';
  const showTrustArc = trustArcCmId && !page?.layout.sitecore.context.pageEditing;

  useEffect(() => {
    // Track added nodes for cleanup
    const addedNodes: Node[] = [];

    const consentBannerFragment = document.createElement('div');
    consentBannerFragment.id = 'consent-banner';

    if (showTrustArc) {
      document.body.prepend(consentBannerFragment);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      TrustArcHeaderSnippet(trustArcCmId).props.children.forEach((child: any) => {
        if (child.type === 'script') {
          const scriptEl = document.createElement('script');
          // Copy attributes
          if (child.props.src) {
            scriptEl.src = child.props.src;
          }
          if (child.props.type) {
            scriptEl.type = child.props.type;
          }
          if (child.props.async) {
            scriptEl.async = child.props.async;
          }
          // For inline scripts
          if (child.props.dangerouslySetInnerHTML?.__html) {
            scriptEl.text = child.props.dangerouslySetInnerHTML.__html;
          }

          document.head.appendChild(scriptEl);
          addedNodes.push(scriptEl);
        }
      });
    }

    return () => {
      // Handles the case where element is already removed, in that case there would be no parent
      // element and it will do nothing rather than throw an error.
      consentBannerFragment.remove();

      // Remove all added script nodes
      addedNodes.forEach((node) => {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      });
    };
  }, [page, trustArcCmId, showTrustArc]);

  return <></>;
};
