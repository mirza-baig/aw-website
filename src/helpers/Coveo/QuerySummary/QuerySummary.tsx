import { QuerySummary as HeadlessQuerySummary } from '@coveo/headless';
import { RichText } from '@sitecore-content-sdk/nextjs';
import { useTheme } from 'lib/context/ThemeContext';
import { FunctionComponent, useEffect, useState } from 'react';

interface QuerySummaryProps {
  controller: HeadlessQuerySummary;
  querySummaryClasses?: string;
  summaryType?: SummaryTypes;
}

export enum SummaryTypes {
  Standard = 'Standard',
  RbAJobQuery = 'RbAJobQuery',
}

export const QuerySummary: FunctionComponent<QuerySummaryProps> = (props) => {
  const { controller, summaryType = SummaryTypes.Standard } = props;
  const [state, setState] = useState(controller.state);

  useEffect(() => controller.subscribe(() => setState(controller.state)), [controller]);
  const { themeName } = useTheme();

  const { hasResults, hasQuery, firstResult, lastResult, total, query } = state;

  if (!hasResults) {
    return null;
  }

  const summary =
    summaryType === SummaryTypes.Standard
      ? [`${themeName === 'aw' ? 'Results' : ''} ${firstResult}-${lastResult} of ${total}`]
      : [
          `Displaying <strong>${firstResult}-${lastResult}</strong> of <strong>${total}</strong> open jobs`,
        ];

  if (hasQuery && query.replace(/\s/g, '').length) {
    summary.push(`for ${query}`);
  }
  return <RichText className={props.querySummaryClasses} field={{ value: summary.join(' ') }} />;
};
