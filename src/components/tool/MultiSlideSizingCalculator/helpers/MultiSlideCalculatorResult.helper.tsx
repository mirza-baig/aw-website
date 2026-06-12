import classNames from 'classnames';
import { useTheme } from 'lib/context/ThemeContext';

import { MultiSlideSizingCalculatorTheme } from './MultiSlideSizingCalculator.theme';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CalculatorResult = (props: any) => {
  const { themeData } = useTheme(MultiSlideSizingCalculatorTheme());

  const {
    formStates,
    configuration,
    roughOpeningWidth,
    roughOpeningHeightSubfloor,
    roughOpeningHeightRecess,
    roughOpeningPocketWidth,
    unitWidth,
    unitHeight,
    panelWidth,
    panelHeight,
    pocketWidth,
    pocketDepth,
    jambDepth,
    sillDepth,
  } = props.data;

  return (
    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
        <div className="overflow-hidden">
          {/* Calculated Dimensions Table */}
          <table className="min-w-full font-sans text-sm font-light ">
            <thead className={themeData.classes.tableHead}>
              <tr>
                <th scope="col" className={themeData.classes.thLeft}>
                  Calculated Dimensions
                </th>
                <th scope="col" className={themeData.classes.thCenter}>
                  Width
                </th>
                <th scope="col" className={themeData.classes.thRight}>
                  Height
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className={themeData.classes.tableRow}>
                <td className={themeData.classes.tdColumn}>
                  Rough Opening <div>(from top of finished floor)</div>
                </td>
                <td className={themeData.classes.tdColumn}>
                  <div dangerouslySetInnerHTML={{ __html: roughOpeningWidth }} />
                </td>
                <td className={themeData.classes.tdColumn}>
                  <div dangerouslySetInnerHTML={{ __html: roughOpeningHeightSubfloor }} />
                </td>
              </tr>
              {formStates?.sillOption === 'Tile Track' && (
                <tr className={themeData.classes.tableRow}>
                  <td className={themeData.classes.tdColumn}>
                    Rough Opening <div>(including recess in floor with flush sill application)</div>
                  </td>
                  <td className={themeData.classes.tdColumn}>
                    <div dangerouslySetInnerHTML={{ __html: roughOpeningWidth }} />
                  </td>
                  <td className={themeData.classes.tdColumn}>
                    <div dangerouslySetInnerHTML={{ __html: roughOpeningHeightRecess }} />
                  </td>
                </tr>
              )}
              {configuration === 'pocketing' && (
                <tr className={themeData.classes.tableRow}>
                  <td className={themeData.classes.tdColumn}>
                    Rough Opening <div>(not including pocket)</div>
                  </td>
                  <td className={themeData.classes.tdColumn}>
                    <div dangerouslySetInnerHTML={{ __html: roughOpeningPocketWidth }} />
                  </td>
                  <td className={themeData.classes.tdColumn}>-</td>
                </tr>
              )}
              <tr className={themeData.classes.tableRow}>
                <td className={themeData.classes.tdColumn}>Unit Size</td>
                <td className={themeData.classes.tdColumn}>
                  <div dangerouslySetInnerHTML={{ __html: unitWidth }} />
                </td>
                <td className={themeData.classes.tdColumn}>
                  <div dangerouslySetInnerHTML={{ __html: unitHeight }} />
                </td>
              </tr>
              <tr className={themeData.classes.tableRow}>
                <td className={themeData.classes.tdColumn}>Panel Size</td>
                <td className={themeData.classes.tdColumn}>
                  <div dangerouslySetInnerHTML={{ __html: panelWidth }} />
                </td>
                <td className={themeData.classes.tdColumn}>
                  <div dangerouslySetInnerHTML={{ __html: panelHeight }} />
                </td>
              </tr>
              <tr className={classNames(themeData.classes.tableRow, 'h-[55px]')}></tr>
              {configuration === 'pocketing' && (
                <tr className={themeData.classes.tableRow}>
                  <td className={themeData.classes.tdColumn}>Pocket Width</td>
                  <td className={themeData.classes.tdColumn}>
                    <div dangerouslySetInnerHTML={{ __html: pocketWidth }} />
                  </td>
                  <td className={themeData.classes.tdColumn}>{'-'}</td>
                </tr>
              )}
              {configuration === 'pocketing' && (
                <tr className={themeData.classes.tableRow}>
                  <td className={themeData.classes.tdColumn}>Pocket Depth</td>
                  <td className={themeData.classes.tdColumn}>
                    <div dangerouslySetInnerHTML={{ __html: pocketDepth }} />
                  </td>
                  <td className={themeData.classes.tdColumn}>{'-'}</td>
                </tr>
              )}
              <tr className={themeData.classes.tableRow}>
                <td className={themeData.classes.tdColumn}>Jamb Depth</td>
                <td className={themeData.classes.tdColumn}>
                  <div dangerouslySetInnerHTML={{ __html: jambDepth }} />
                </td>
                <td className={themeData.classes.tdColumn}>{'-'}</td>
              </tr>
              {formStates?.sillOption !== 'Tile Track' && (
                <tr className={themeData.classes.tableRow}>
                  <td className={themeData.classes.tdColumn}>Sill Depth</td>
                  <td className={themeData.classes.tdColumn}>
                    <div dangerouslySetInnerHTML={{ __html: sillDepth }} />
                  </td>
                  <td className={themeData.classes.tdColumn}>{'-'}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CalculatorResult;
