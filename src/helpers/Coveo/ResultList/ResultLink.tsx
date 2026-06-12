import { buildInteractiveResult, Result } from '@coveo/headless';
import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { CoveoEngineContext } from 'lib/coveo';
import { filterProtocol } from 'lib/utils/url-utils/filter-protocol';
import { FunctionComponent, ReactNode, useContext, useEffect } from 'react';

interface InteractiveResultProps {
  children?: ReactNode;
  result: Result;
}

export const ResultLink: FunctionComponent<InteractiveResultProps> = (props) => {
  const engine = useContext(CoveoEngineContext);

  const controller =
    engine &&
    buildInteractiveResult(engine, {
      options: { result: props.result },
    });

  useEffect(() => () => controller?.cancelPendingSelect(), [controller]);

  if (!engine || !controller) {
    return <></>;
  }

  const isDocumentLink =
    props.result.raw['sc_templateid'] ===
    SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Data.Documents.TechnicalDocument.Id.replaceAll(
      '-',
      ''
    );

  return isDocumentLink ? (
    <a
      href={filterProtocol(props.result.clickUri)}
      className={isDocumentLink && 'documentLink'}
      title={props.result.raw['ew_documenttitle'] as string}
      target="_blank"
      rel="noreferrer"
    >
      {props.children}
    </a>
  ) : (
    <a
      href={filterProtocol(props.result.clickUri)}
      onClick={() => controller.select()}
      onContextMenu={() => controller.select()}
      onMouseDown={() => !isDocumentLink && controller.select()}
      onMouseUp={() => controller.select()}
      onTouchStart={() => controller.beginDelayedSelect()}
      onTouchEnd={() => controller.cancelPendingSelect()}
    >
      {props.children}
    </a>
  );
};
