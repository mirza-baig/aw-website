import classNames from 'classnames';
import { Field } from 'formik';
import { FormFieldsTheme } from 'helpers/GenericFormBuilder/FormFields.Theme';
import { useGenericFormBuilderContext } from 'helpers/GenericFormBuilder/GenericFormBuilderContext';
import { useTheme } from 'lib/context/ThemeContext';
import { OptionItem } from 'lib/generic-form-builder/utils/get-option-items';

export type TileButtonItemProps = OptionItem & {
  isMultiSelectEnabled: boolean;
  groupName: string;
  moveForwardOnClick: boolean;
};

const TileButtonItem = ({
  label,
  value,
  isMultiSelectEnabled,
  groupName,
  moveForwardOnClick,
}: TileButtonItemProps) => {
  const { themeData } = useTheme(FormFieldsTheme);
  const { currentPage, navigateToPage } = useGenericFormBuilderContext();

  const handleButtonClick = () => {
    if (!isMultiSelectEnabled && moveForwardOnClick) {
      setTimeout(() => {
        const nextPageIndex = currentPage + 1;
        navigateToPage(nextPageIndex);
      }, 500);
    }
  };

  return (
    <label>
      <Field
        className={classNames(
          'appearence-none h-0 w-0 border-0 outline-none ring-0 focus:ring-0 [&:focus:checked+.button-card-item]:before:ring-2 [&:focus+.button-card-item]:before:ring-2',
          isMultiSelectEnabled
            ? themeData.classes.tileButton.tileButtonCheckboxSelected
            : themeData.classes.tileButton.tileButtonRadioSelected
        )}
        type={isMultiSelectEnabled ? 'checkbox' : 'radio'}
        name={groupName}
        value={value}
        onClick={handleButtonClick}
      />
      <div
        className={classNames(
          themeData.classes.tileButton.tileButtonItem,
          themeData.classes.tileButton.tileButtonItemDesktop,
          isMultiSelectEnabled
            ? themeData.classes.tileButton.tileButtonCheckboxItem
            : themeData.classes.tileButton.tileButtonRadioItem
        )}
      >
        <div
          className={classNames(
            !isMultiSelectEnabled && themeData.classes.tileButton.tileButtonItemContent
          )}
        >
          {!isMultiSelectEnabled && (
            <span className={classNames(themeData.classes.tileButton.tileButtonItemRadio)}></span>
          )}
          <div className={classNames(themeData.classes.tileButton.title)}>{label}</div>
        </div>
      </div>
    </label>
  );
};

export default TileButtonItem;
