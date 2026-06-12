// Global
import { useTheme } from 'lib/context/ThemeContext';
import { AttributeRendererProps, HardwareAttributeViewModel } from 'lib/renoworks';
import {} from 'lib/utils/linq/array';
import React from 'react';
import empty from 'src/assets/img/empty.png';

// Components
import {
  HardwareAttributeTheme,
  HardwareAttributeThemeSubType,
} from './PDT_HardwareAttribute.theme';

const HardwareAttribute = ({
  viewModel,
  onUpdateOption,
  onUpdateOptionGroup,
}: AttributeRendererProps<HardwareAttributeViewModel>) => {
  const { themeData } = useTheme(HardwareAttributeTheme());
  const theme = (themeData as HardwareAttributeThemeSubType).classes;

  const finishOptions = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hardware = viewModel.groups.singleOrDefault((_: any) => _.isSelected);
    return hardware === null ? [] : hardware.options;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const optionClicked = (option: any, collection?: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onUpdateOption && onUpdateOption(option, collection);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const optionGroupClicked = (optionGroup: any, collection?: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onUpdateOptionGroup && onUpdateOptionGroup(optionGroup, collection);
  };

  return (
    <div className={theme.attributeOption}>
      <p className={theme.titleMobile}>Hardware</p>
      {viewModel.description && <p className={theme.copy}>{viewModel.description}</p>}
      <div className={theme.container}>
        {viewModel.groups.length > 0 && (
          <div className={theme.containerHardware}>
            <div className={theme.containerFinishWithoutBorder}>
              <p className={theme.title}>Hardware</p>
              <ul className={theme.containerlist}>
                {viewModel.groups.map(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (group: any, index: number) => (
                    <li className={theme.hardwareListItem} key={`${group?.title}-${index}`}>
                      <button
                        className={theme.hardwareListItemButton}
                        onClick={() => optionGroupClicked(group, viewModel.groups)}
                      >
                        <span
                          className={`${theme.hardwareListItemImageWrapper} ${
                            group.isSelected || group.isClicked ? theme.selected : theme.unselected
                          }`}
                        >
                          {group.image && (
                            <div style={{ background: '#' + group.colorRgb, borderRadius: '50%' }}>
                              <img
                                className={theme.hardwareListItemImage}
                                src={group.image}
                                alt={group.title}
                                width={76}
                                height={76}
                              ></img>
                            </div>
                          )}
                        </span>
                        <span className={theme.hardwareListItemButtonText}>{group.title}</span>
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        )}

        {finishOptions().length > 0 && (
          <div className={theme.containerFinish}>
            <p className={theme.title}>Select Finish</p>
            <ul className={theme.containerlist}>
              {finishOptions().map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (option: any, index: number) => (
                  <li className={theme.listItem} key={`${option?.title}-${index}`}>
                    <button
                      className={theme.listItemButton}
                      onClick={() => optionClicked(option, finishOptions())}
                    >
                      {option.image && (
                        <span
                          className={`${theme.listItemImageWrapper} ${
                            option.isSelected || option.isClicked
                              ? theme.selected
                              : theme.unselected
                          }`}
                        >
                          <div style={{ background: '#' + option.colorRgb, borderRadius: '50%' }}>
                            <img
                              className={theme.listItemImage}
                              src={option.image === 'empty' ? empty.src : option.image}
                              alt={option.title}
                              width={76}
                              height={76}
                            ></img>
                          </div>
                        </span>
                      )}
                      <span className={theme.listItemButtonText}>{option.title}</span>
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
        {viewModel.optional.length > 0 && (
          <div className={theme.containerOptional}>
            <p className={theme.title}>Optional Lift Hardware</p>
            <ul className={theme.containerlist}>
              {viewModel.optional.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (option: any, index: number) => (
                  <li className={theme.hardwareListItem} key={`${option?.title}-${index}`}>
                    <button
                      className={theme.hardwareListItemButton}
                      onClick={() => optionClicked(option, viewModel.optional)}
                    >
                      <span
                        className={`${theme.hardwareListItemImageWrapper} ${
                          option.isSelected || option.isClicked ? theme.selected : theme.unselected
                        }`}
                      >
                        {option.image && (
                          <div style={{ background: '#' + option.colorRgb, borderRadius: '50%' }}>
                            <img
                              className={theme.hardwareListItemImage}
                              src={option.image}
                              alt={option.title}
                              width={76}
                              height={76}
                            ></img>
                          </div>
                        )}
                      </span>
                      <span className={theme.hardwareListItemButtonText}>{option.title}</span>
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
      {typeof viewModel.note === 'string' &&
        (viewModel.note as unknown as string).split('\n').map((n: string, i: number) => (
          <p key={String(viewModel.note) + String(i)} className={theme.disclaimer}>
            {n}
          </p>
        ))}
    </div>
  );
};

HardwareAttribute.nameString = 'HardwareAttribute';

export default HardwareAttribute;
