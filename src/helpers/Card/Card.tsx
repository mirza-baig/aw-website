// Cards
import classNames from 'classnames';
import { JSX } from 'react';
export type CardBaseProps = {
  children: React.ReactNode | React.ReactNode[];
  dataComponent?: string;
  classes?: string;
};

const Card = ({ children, dataComponent, classes }: CardBaseProps): JSX.Element => {
  return (
    <div
      className={classNames(
        'theme-white m-0 flex h-full flex-col md:max-w-(--breakpoint-lg) lg:mx-auto',
        classes
      )}
      data-component={dataComponent}
    >
      {children}
    </div>
  );
};
export default Card;
