import classNames from 'classnames';
import { useTheme } from 'lib/context/ThemeContext';
import { Line } from 'rc-progress';

import { ProgressBarTheme } from './ProgressBar.Theme';

type ProgressBarProps = {
  percent: number;
  stepLabel: string | string[];
  isComplete: boolean;
  activeStep: number;
  totalSteps: number;
  showSteps?: boolean;
};

const ProgressBar = ({
  percent,
  stepLabel,
  isComplete,
  activeStep,
  totalSteps,
  showSteps = true,
}: Partial<ProgressBarProps>) => {
  const { themeData, themeName } = useTheme(ProgressBarTheme);

  return (
    <div className={classNames('flex flex-col items-end')}>
      <Line
        percent={isComplete ? 100 : percent}
        strokeWidth={3}
        strokeColor={themeName === 'aw' ? '#f26924' : '#6CC14C'}
        trailWidth={3}
        trailColor={themeName === 'aw' ? '#C4BFB6' : '#D2D1D0'}
      />
      <div className="flex w-full flex-row">
        <div className={themeData.classes.stepLabel}>{stepLabel}</div>
        {showSteps && (
          <div className={themeData.classes.stepCount}>
            {activeStep} / {totalSteps}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
