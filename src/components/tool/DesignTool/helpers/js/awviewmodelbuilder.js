import { DesignToolStepName } from 'lib/renoworks/designtool';

import {
  AttributeOption,
  AttributeOptionGroup,
  BrandHardwareAttributeViewModel,
  BrandHardwareFinishAttributeViewModel,
  DependentSwatchAttributeViewModel,
  DescriptionAttributeViewModel,
  HardwareAttributeViewModel,
  ProductSetting,
  ProductSettingRemoveValue,
  ProductSettingSetValue,
  RadioAttributeViewModel,
  SelectableAttributeOptionGroup,
  SizingAttributeViewModel,
  SummaryHelpers,
  SwatchAttributeViewModel,
  TabbedSwatchAttributeViewModel,
  TextAttributeViewModel,
  ViewModelBuilderBase,
} from './designtool';
import { RenoworksChildKeys, RenoworksKeys, RenoworksProductSide } from './renoworks';
import { first, firstOrDefault, isNullOrWhitespace, singleOrDefault, toFraction } from './utils';

// Black Or Dark Bronze Special Color Rules
let BlackOrDarkBronzeSpecialColorRulesProducts = [
  'aw_400awning',
  'aw_400casement',
  'aw_bay_400casement',
  'aw_bow_400casement',
  'aw_400gliding',
  'aw_400doublehung_tw',
  'aw_bay_400doublehung_tw',
  'aw_100awning',
  'aw_100casement',
  'aw_100doublehung',
  'aw_100glider',
  'aw_100gliderdoor',
  'aw_100picture',
  'aw_100singlehung',
];

// Hide sizing for Bay & Bow Windows
let BayBowSizingRulesProducts = [
  'aw_bay_400casement',
  'aw_bow_400casement',
  'aw_bay_400doublehung_tw',
  'aw_bay_400doublehung_ww',
];

// All E-Series Products
let ESeriesProducts = new Set([
  'aw_eawning',
  'aw_ecasement',
  'aw_edoublehung',
  'aw_efrenchcasement',
  'aw_egliderdoor',
  'aw_egliding',
  'aw_ehingeddoor',
  'aw_epicture',
  'aw_epushoutawning',
  'aw_epushoutcasement',
]);

// Hide sizing for Entry Doors
let EntryDoorProducts = [
  'aw_entrydoor_colonial4panel',
  'aw_entrydoor_colonial6panel',
  'aw_entrydoor_colonial12light',
  'aw_entrydoor_craftsman1panel',
  'aw_entrydoor_craftsman2panel',
  'aw_entrydoor_craftsman3panel',
  'aw_entrydoor_farmhouse12light',
  'aw_entrydoor_farmhouse34light',
  'aw_entrydoor_farmhouse12panel',
  'aw_entrydoor_farmhouse34panel',
  'aw_entrydoor_fulllight',
  'aw_entrydoor_shaker12light',
];

// Hide Diamond Grilles for certain products
let DiamondGrilleRulesProducts = ['aw_aawning'];

//
let BrandHardwareCollectionProducts = [
  'aw_ahingeddoor',
  'aw_ehingeddoor',
  'aw_200hingeddoor',
  'aw_400frenchwoodhingeddoor',
];

// Hide Diamond pattern grille option for these sizes
let DiamondGrilleRulesSizes = [
  { width: '19.25', height: '15.25' },
  { width: '19.25', height: '19.25' },
  { width: '19.25', height: '21.25' },
  { width: '19.25', height: '23.25' },
  { width: '19.25', height: '27.25' },
  { width: '23.25', height: '15.25' },
  { width: '23.25', height: '19.25' },
  { width: '23.25', height: '21.25' },
  { width: '23.25', height: '23.25' },
  { width: '23.25', height: '27.25' },
  { width: '27.25', height: '15.25' },
  { width: '27.25', height: '19.25' },
  { width: '27.25', height: '21.25' },
  { width: '27.25', height: '23.25' },
  { width: '27.25', height: '27.25' },
  { width: '29.25', height: '15.25' },
  { width: '29.25', height: '19.25' },
  { width: '29.25', height: '21.25' },
  { width: '29.25', height: '23.25' },
  { width: '29.25', height: '27.25' },
];

// Oil Rubbed Bronze and Distressed Bronze colors for disclaimer text rules
const oilRubbedBronzeColors = [
  'Oil Rubbed Bronze',
  'Oil Rubbed Bronze (Living Finish)',
  'Distressed Bronze',
  'Distressed Bronze (Living Finish)',
];

// PVD colors for disclaimer text rules
const pvdColors = [
  'Satin Nickel',
  'Satin Nickel (PVD)',
  'Satin Nickel (PVD Finish)',
  'Bright Brass',
  'Bright Brass (PVD)',
  'Bright Brass (PVD Finish)',
];

// Starred colors for disclaimer text
const starredColors = new Set([...oilRubbedBronzeColors, ...pvdColors]);

// Hide certain wood options
let ESeriesUnfinishedOnlyInteriorWoodOptions = new Set(['Unfinished Pine']);

// Entry Doors color choices that are available unfinished
let EntryDoorUnfinishedInteriors = [
  'Oak',
  'Pine',
  'Maple',
  'Cherry',
  'Mahogany',
  'Walnut',
  'Mixed Grain Douglas Fir',
  'Hickory',
  'Vertical Grain Douglas Fir',
  'Alder',
];

// A-Series color choices that are available unfinished, stained or painted
let ASeriesStainablePaintableInteriors = ['Pine', 'Maple'];

// A-Series color choices that are available unfinished or stained
let ASeriesStainableInteriors = ['Oak'];

// A-Series color choices that are available unfinished only
let ASeriesUnfinishedInteriors = ['Cherry', 'Mahogany', 'Vertical Grain Douglas Fir'];

class BlindsBetweenGlassRules {
  // Blinds between glass products
  static Products = [
    'aw_400frenchwoodgliderdoor',
    'aw_400frenchwoodhingeddoor',
    'aw_200permashieldgliderdoor',
    'aw_agliderdoor',
    'aw_ahingeddoor',
  ];

  // Renoworks Component Names
  static InteriorColorsComponent = 'Interior';
  static ExteriorColorsComponent = 'Exterior Door Color';

  // Allowed interior colors for 400 Glider
  static FourHundredFrenchwoodGlidingInteriorColors = ['White', 'Pine'];

  // Allowed exterior colors for 400 Glider
  static FourHundredFrenchwoodGlidingExteriorColors = [
    'White',
    'Sandtone',
    'Terratone',
    'Forest Green',
  ];

  // Allowed sizes for 400 Glider
  static FourHundredFrenchwoodGlidingProductNumbers = ['FWG6068', 'FWG60611'];

  // Allowed interior colors for 400 Hinged
  static FourHundredFrenchwoodHingedInteriorColors = ['White', 'Pine'];

  // Allowed exterior colors for 400 Hinged
  static FourHundredFrenchwoodHingedExteriorColors = [
    'White',
    'Sandtone',
    'Terratone',
    'Forest Green',
  ];

  // Allowed sizes for 400 Hinged
  static FourHundredFrenchwoodHingedProductNumbers = [
    'FWH2768',
    'FWH27611',
    'FWH3168',
    'FWH31611',
    'FWH5068',
    'FWH50611',
    'FWH6068',
    'FWH60611',
    'FWH9068',
    'FWH90611',
  ];

  // Allowed interior colors for 200 Glider
  static TwoHundredPermashieldGliderInteriorColors = ['White'];

  // Allowed exterior colors for 200 Glider
  static TwoHundredPermashieldGliderExteriorColors = ['White'];

  // Allowed sizes for 200 Glider
  static TwoHundredPermashieldGliderProductNumbers = ['PS5068', 'PS51168', 'PS61611'];

  // Allowed sizes for A-Series Glider Doors
  static ASeriesGliderProductNumbers = [
    'FWGD2968',
    'FWGD3368',
    'FWGD5068',
    'FWGD6068',
    'FWGD91068-4',
    'FWGD111068-4',
    'FWGD33611',
    'FWGD60611',
    'FWGD1110611-4',
  ];

  // Allowed sizes for A-Series Hinged Doors
  static ASeriesHingedProductNumbers = [
    'FWHID2768',
    'FWHID2968',
    'FWHID3168',
    'FWHID5068',
    'FWHID5468',
    'FWHID6068',
    'FWHID71168',
    'FWHID81168',
    'FWHID27611',
    'FWHID31611',
    'FWHID50611',
    'FWHID60611',
    'FWHID811611',
  ];

  get modelBuilder() {
    return this._modelBuilder;
  }

  constructor(modelBuilder) {
    this._modelBuilder = modelBuilder;
  }

  isSupportedConfiguration(productSettingValues) {
    // Get the Interior Color, Exterior Color and Product Number to determine if Blinds Between Glass is allowed
    let interiorColor = productSettingValues.get(this.modelBuilder._FrameColor) ?? '';
    let exteriorColor = productSettingValues.get(this.modelBuilder._FrameColorExterior) ?? '';

    interiorColor = interiorColor.replace(
      BlindsBetweenGlassRules.InteriorColorsComponent + '; color=',
      ''
    );
    exteriorColor = exteriorColor.replace(
      BlindsBetweenGlassRules.ExteriorColorsComponent + '; color=',
      ''
    );

    return this._isSupportedConfiguration(
      this.modelBuilder.product.renoworksKey,
      interiorColor,
      exteriorColor,
      this.modelBuilder._productNumber
    );
  }

  //SQ-NOSCAN-START - will be handled in separate ticket
  _isSupportedConfiguration(renoworksKey, interiorColor, exteriorColor, productNumber) {
    // 400S Frenchwood Gliding Door
    if (renoworksKey == 'aw_400frenchwoodgliderdoor') {
      if (
        BlindsBetweenGlassRules.FourHundredFrenchwoodGlidingInteriorColors.includes(
          interiorColor
        ) &&
        BlindsBetweenGlassRules.FourHundredFrenchwoodGlidingExteriorColors.includes(
          exteriorColor
        ) &&
        BlindsBetweenGlassRules.FourHundredFrenchwoodGlidingProductNumbers.includes(productNumber)
      ) {
        return true;
      }
    }
    // 400S Frenchwood Hinged Door
    else if (renoworksKey == 'aw_400frenchwoodhingeddoor') {
      if (
        BlindsBetweenGlassRules.FourHundredFrenchwoodHingedInteriorColors.includes(interiorColor) &&
        BlindsBetweenGlassRules.FourHundredFrenchwoodHingedExteriorColors.includes(exteriorColor) &&
        BlindsBetweenGlassRules.FourHundredFrenchwoodHingedProductNumbers.includes(productNumber)
      ) {
        return true;
      }
    }
    // 200S Perma-Shield Gliding Door
    else if (renoworksKey == 'aw_200permashieldgliderdoor') {
      if (
        BlindsBetweenGlassRules.TwoHundredPermashieldGliderInteriorColors.includes(interiorColor) &&
        BlindsBetweenGlassRules.TwoHundredPermashieldGliderExteriorColors.includes(exteriorColor) &&
        BlindsBetweenGlassRules.TwoHundredPermashieldGliderProductNumbers.includes(productNumber)
      ) {
        return true;
      }
    }
    // A-Series Gliding
    else if (renoworksKey == 'aw_agliderdoor') {
      if (BlindsBetweenGlassRules.ASeriesGliderProductNumbers.includes(productNumber)) {
        return true;
      }
    }
    // A-Series Hinged Door
    else if (renoworksKey == 'aw_ahingeddoor') {
      if (BlindsBetweenGlassRules.ASeriesHingedProductNumbers.includes(productNumber)) {
        return true;
      }
    }
    // E-Series Gliding and Hinged Door Not needed now EW-4854

    return false;
  }
  //SQ-NOSCAN-END
}

export class AWViewModelBuilder extends ViewModelBuilderBase {
  constructor(product, moduleData, pageSize = 12) {
    super(product, moduleData);
    if (!product || !moduleData) {
      return;
    }

    this._pageSize = pageSize;

    this._sizingIsEnabled =
      !BayBowSizingRulesProducts.includes(this.product.renoworksKey) &&
      !EntryDoorProducts.includes(this.product.renoworksKey);

    // Child Attributes
    this._ExteriorTrimColor = new ProductSetting({
      side: RenoworksProductSide.Exterior,
      queryStringKey: 'exteriorTrimColor',
      renoworksKey: RenoworksChildKeys.Color,
      summaryName: 'Exterior Trim Color',
      summaryFormatter: SummaryHelpers.ValueFromValueWithColor,
      isChildKey: true,
    });
    this._GrilleLightsHigh = new ProductSetting({
      side: RenoworksProductSide.Both,
      queryStringKey: 'grilleLightsHigh',
      renoworksKey: RenoworksChildKeys.Rows,
      isChildKey: true,
    });
    this._GrilleLightsWide = new ProductSetting({
      side: RenoworksProductSide.Both,
      queryStringKey: 'grilleLightsWide',
      renoworksKey: RenoworksChildKeys.Cols,
      isChildKey: true,
    });
    this._GrilleSpacing = new ProductSetting({
      side: RenoworksProductSide.Both,
      queryStringKey: 'grilleSpacing',
      renoworksKey: RenoworksChildKeys.GrilleSpacing,
      isChildKey: true,
    });
    this._GrilleWidth = new ProductSetting({
      side: RenoworksProductSide.Both,
      queryStringKey: 'grilleWidth',
      renoworksKey: RenoworksChildKeys.GrilleWidth,
      summaryName: 'Grille Width',
      isChildKey: true,
    });

    // Attributes
    this._Configuration = new ProductSetting({
      side: RenoworksProductSide.Both,
      queryStringKey: 'configuration',
      renoworksKey: RenoworksKeys.Configuration,
      summaryName: 'Configuration',
    });
    this._BlindsBetweenGlass = new ProductSetting({
      side: RenoworksProductSide.Both,
      queryStringKey: 'blindsBetweenGlass',
      renoworksKey: RenoworksKeys.BlindsBetweenGlass,
      summaryName: 'Blinds Between Glass',
      summaryFormatter: SummaryHelpers.NameFromValueWithNameAndValue,
    });
    this._BottomRailHeight = new ProductSetting({
      side: RenoworksProductSide.Both,
      queryStringKey: 'bottomRailHeight',
      renoworksKey: RenoworksKeys.BottomRailHeight,
      summaryName: 'Bottom Rail Height',
    });
    this._ExteriorTrim = new ProductSetting({
      side: RenoworksProductSide.Exterior,
      queryStringKey: 'exteriorTrim',
      renoworksKey: RenoworksKeys.ExteriorTrimProfile,
      summaryName: 'Exterior Trim Profile',
      summaryFormatter: SummaryHelpers.ValueFromValueWithColor,
      childKeys: [this._ExteriorTrimColor],
    });
    this._FrameColor = new ProductSetting({
      side: RenoworksProductSide.Interior,
      queryStringKey: 'frameColor',
      renoworksKey: RenoworksKeys.FrameColor,
      summaryName: 'Interior Color',
      summaryFormatter: SummaryHelpers.ValueFromValueWithNameAndValue,
    });
    this._FrameColorExterior = new ProductSetting({
      side: RenoworksProductSide.Exterior,
      queryStringKey: 'frameColorExt',
      renoworksKey: RenoworksKeys.FrameColor,
      summaryName: SummaryHelpers.ExteriorFrameColor,
      summaryFormatter: SummaryHelpers.ValueFromValueWithNameAndValue,
    });
    this._FrameStain = new ProductSetting({
      side: RenoworksProductSide.Interior,
      queryStringKey: 'frameStain',
      renoworksKey: RenoworksKeys.FrameStain,
      summaryName: SummaryHelpers.NameFromValueWithNameAndValue,
      summaryFormatter: SummaryHelpers.ValueFromValueWithNameAndValue,
    });
    this._InteriorStainPaint = new ProductSetting({
      side: RenoworksProductSide.Interior,
      queryStringKey: 'interiorStainPaint',
      renoworksKey: RenoworksKeys.InteriorStainPaint,
      summaryName: SummaryHelpers.NameFromValueWithNameAndValue,
      summaryFormatter: SummaryHelpers.ValueFromValueWithNameAndValue,
    });
    this._GlassOptions = new ProductSetting({
      side: RenoworksProductSide.Both,
      queryStringKey: 'glass',
      renoworksKey: RenoworksKeys.GlassOptions,
      summaryName: 'Glass',
    });
    this._ProfileStyle = new ProductSetting({
      side: RenoworksProductSide.Interior,
      queryStringKey: 'profile',
      renoworksKey: RenoworksKeys.ProfileStyle,
      summaryName: 'Profile Style',
    });
    this._GrilleStyle = new ProductSetting({
      side: RenoworksProductSide.Both,
      queryStringKey: 'grilleStyle',
      renoworksKey: RenoworksKeys.GrilleStyle,
      summaryName: 'Grille Pattern',
      childKeys: [
        this._GrilleWidth,
        this._GrilleSpacing,
        this._GrilleLightsHigh,
        this._GrilleLightsWide,
      ],
    });
    this._GrilleType = new ProductSetting({
      side: RenoworksProductSide.Both,
      queryStringKey: 'grilleType',
      renoworksKey: RenoworksKeys.GrilleType,
      summaryName: 'Grille Type',
    });
    this._HardwareOptions = new ProductSetting({
      side: RenoworksProductSide.Both,
      queryStringKey: 'hardware',
      renoworksKey: RenoworksKeys.HardwareOptions,
      summaryName: 'Hardware',
      summaryFormatter: SummaryHelpers.ValueFromValueWithColor,
    });
    this._Manufacturer = new ProductSetting({
      side: RenoworksProductSide.Both,
      queryStringKey: 'manufacturer',
      renoworksKey: RenoworksKeys.Manufacturer,
      summaryName: 'Hardware Brand Collection',
    });
    this._HandleStyle = new ProductSetting({
      side: RenoworksProductSide.Both,
      queryStringKey: 'handleStyle',
      renoworksKey: RenoworksKeys.HandleStyle,
      summaryName: 'Hardware Handle Style',
    });
    this._PlateStyle = new ProductSetting({
      side: RenoworksProductSide.Both,
      queryStringKey: 'plateStyle',
      renoworksKey: RenoworksKeys.PlateStyle,
      summaryName: 'Hardware Plate Style',
    });
    this._Finish = new ProductSetting({
      side: RenoworksProductSide.Both,
      queryStringKey: 'finish',
      renoworksKey: RenoworksKeys.Finish,
      summaryName: 'Hardware Finish',
    });
    this._HeightInches = new ProductSetting({
      side: RenoworksProductSide.Both,
      queryStringKey: 'hgtIn',
      renoworksKey: RenoworksKeys.HeightInches,
      summaryName: 'Unit Height',
      summaryFormatter: (value) => toFraction(value) + '"',
    });
    this._Operation = new ProductSetting({
      side: RenoworksProductSide.Both,
      queryStringKey: 'operation',
      renoworksKey: RenoworksKeys.Operation,
      summaryName: 'Operation',
    });
    this._OptionalHardware = new ProductSetting({
      side: RenoworksProductSide.Interior,
      queryStringKey: 'hardwareOptions',
      renoworksKey: RenoworksKeys.OptionalHardware,
      summaryName: 'Optional Hardware',
      summaryFormatter: SummaryHelpers.ValueFromValueWithColor,
    });
    this._PanelStyle = new ProductSetting({
      side: RenoworksProductSide.Both,
      queryStringKey: 'panelStyle',
      renoworksKey: RenoworksKeys.PanelStyle,
      summaryName: 'Panel Style',
    });
    this._RailAndStileWidth = new ProductSetting({
      side: RenoworksProductSide.Both,
      queryStringKey: 'railAndStileWidth',
      renoworksKey: RenoworksKeys.RailAndStileWidth,
      summaryName: 'Rail & Stile Width',
    });
    this._SashColorExterior = new ProductSetting({
      side: RenoworksProductSide.Exterior,
      queryStringKey: 'exteriorSash',
      renoworksKey: RenoworksKeys.SashColor,
      summaryName: SummaryHelpers.NameFromValueWithNameAndValue,
      summaryFormatter: SummaryHelpers.ValueFromValueWithNameAndValue,
    });
    this._SideliteStyle = new ProductSetting({
      side: RenoworksProductSide.Both,
      queryStringKey: 'sideliteStyle',
      renoworksKey: RenoworksKeys.SideliteStyle,
      summaryName: 'Sidelite Style ',
      summaryFormatter: SummaryHelpers.NameFromValueWithNameAndValue,
    });
    this._Screen = new ProductSetting({
      side: RenoworksProductSide.Both,
      queryStringKey: 'screen',
      renoworksKey: RenoworksKeys.Screen,
      summaryName: 'Screen',
    });
    this._Shape = new ProductSetting({
      side: RenoworksProductSide.Both,
      queryStringKey: 'shape',
      renoworksKey: RenoworksKeys.Shape,
      summaryName: 'Shapes',
    });
    this._WidthInches = new ProductSetting({
      side: RenoworksProductSide.Both,
      queryStringKey: 'widIn',
      renoworksKey: RenoworksKeys.WidthInches,
      summaryName: 'Unit Width',
      summaryFormatter: (value) => toFraction(value) + '"',
    });

    this.productSettings.add(this._Configuration);
    this.productSettings.add(this._WidthInches);
    this.productSettings.add(this._HeightInches);
    this.productSettings.add(this._PanelStyle);
    this.productSettings.add(this._BottomRailHeight);
    this.productSettings.add(this._RailAndStileWidth);
    this.productSettings.add(this._SideliteStyle);
    this.productSettings.add(this._FrameColor);
    this.productSettings.add(this._FrameStain);
    this.productSettings.add(this._InteriorStainPaint);
    this.productSettings.add(this._Operation);
    this.productSettings.add(this._Shape);
    this.productSettings.add(this._GlassOptions);
    this.productSettings.add(this._ProfileStyle);
    this.productSettings.add(this._Screen);
    this.productSettings.add(this._HardwareOptions);
    this.productSettings.add(this._OptionalHardware);
    this.productSettings.add(this._Manufacturer);
    this.productSettings.add(this._HandleStyle);
    this.productSettings.add(this._PlateStyle);
    this.productSettings.add(this._Finish);
    this.productSettings.add(this._BlindsBetweenGlass);
    this.productSettings.add(this._GrilleType);
    this.productSettings.add(this._GrilleStyle);
    this.productSettings.add(this._GrilleWidth);
    this.productSettings.add(this._GrilleSpacing);
    this.productSettings.add(this._GrilleLightsWide);
    this.productSettings.add(this._GrilleLightsHigh);
    this.productSettings.add(this._FrameColorExterior);
    this.productSettings.add(this._SashColorExterior);
    this.productSettings.add(this._ExteriorTrim);
    this.productSettings.add(this._ExteriorTrimColor);

    if (!this._sizingIsEnabled && !EntryDoorProducts.includes(this.product.renoworksKey)) {
      // Replace Grille Style with a setting containing no child settings
      this._GrilleStyle = new ProductSetting({
        side: RenoworksProductSide.Both,
        queryStringKey: 'grilleStyle',
        renoworksKey: RenoworksKeys.GrilleStyle,
        summaryName: 'Grille Pattern',
      });

      // Remove size related settings
      this.productSettings.delete(this._GlassOptions);
      this.productSettings.delete(this._GrilleType);
      this.productSettings.delete(this._GrilleWidth);
      this.productSettings.delete(this._GrilleLightsHigh);
      this.productSettings.delete(this._GrilleLightsWide);
      this.productSettings.delete(this._GrilleSpacing);
      this.productSettings.delete(this._HeightInches);
      this.productSettings.delete(this._Operation);
      this.productSettings.delete(this._WidthInches);
    }

    // Remove this configuration - previously controlled by feature toggle
    if (!EntryDoorProducts.includes(this.product.renoworksKey)) {
      this.productSettings.delete(this._Configuration);
    }

    this._blindsBetweenGlassRules = new BlindsBetweenGlassRules(this);
  }

  get pageSize() {
    return this._pageSize;
  }

  get supportedSides() {
    return RenoworksProductSide.Both;
  }

  //SQ-NOSCAN-START - will be handled in separate ticket
  beforeRenoworksCall(productSettingValues) {
    if (this._sizingIsEnabled) {
      this._currentProductConfiguration = null;

      if (EntryDoorProducts.includes(this.product.renoworksKey)) {
        if (productSettingValues.has(this._Configuration)) {
          this._currentProductConfiguration = singleOrDefault(
            this.product.configuration,
            (configuration) =>
              configuration.renoworksName === productSettingValues.get(this._Configuration)
          );
          if (this._currentProductConfiguration === null) {
            throw new Error(
              'Unable to find a Product Configuration in Sitecore for the currently selected Configuration "' +
                productSettingValues.get(this._Configuration) +
                '". This value is required for Sizing logic.'
            );
          }
        } else {
          this._currentProductConfiguration = firstOrDefault(this.product.configuration);
          if (this._currentProductConfiguration === null) {
            throw new Error(
              'Unable to find a Product Configuration in Sitecore. This value is required for Sizing logic.'
            );
          }
        }
      } else {
        this._currentProductConfiguration = firstOrDefault(this.product.configuration);
      }

      if (this._currentProductConfiguration) {
        let currentDimensionMapping;

        let dimensionMappings = this._currentProductConfiguration.dimensionMappings;
        if (
          productSettingValues.has(this._WidthInches) &&
          productSettingValues.has(this._HeightInches)
        ) {
          currentDimensionMapping =
            singleOrDefault(
              dimensionMappings,
              (_) =>
                _.width === productSettingValues.get(this._WidthInches) &&
                _.height === productSettingValues.get(this._HeightInches)
            ) ||
            firstOrDefault(
              dimensionMappings,
              (_) => _.width === productSettingValues.get(this._WidthInches)
            ) ||
            first(dimensionMappings);
        } else if (productSettingValues.has(this._WidthInches)) {
          currentDimensionMapping =
            firstOrDefault(
              dimensionMappings,
              (_) => _.width === productSettingValues.get(this._WidthInches)
            ) || first(dimensionMappings);
        } else {
          currentDimensionMapping = first(dimensionMappings);
        }

        productSettingValues.set(this._WidthInches, currentDimensionMapping.width);
        productSettingValues.set(this._HeightInches, currentDimensionMapping.height);
        productSettingValues.set(this._GrilleLightsWide, currentDimensionMapping.grilleLightsWide);

        // For Modified Colonial grille we need to divide the rows in half and round down
        if (productSettingValues.get(this._GrilleStyle) === 'Modified Colonial') {
          productSettingValues.set(
            this._GrilleLightsHigh,
            Math.floor(currentDimensionMapping.grilleLightsHigh / 2)
          );
        } else {
          productSettingValues.set(
            this._GrilleLightsHigh,
            currentDimensionMapping.grilleLightsHigh
          );
        }

        // For Specified Equal Light grille need to set to 2 rows and 1 columns
        if (productSettingValues.get(this._GrilleStyle) === 'Specified Equal Light') {
          productSettingValues.set(this._GrilleLightsHigh, '2');
          productSettingValues.set(this._GrilleLightsWide, '1');
        }

        productSettingValues.set(this._GrilleSpacing, 'Custom...');

        this._productNumber = currentDimensionMapping.productNumber;

        // If Diamond Grille was previously selected check the rules for products and sizes and remove the selection if necessary
        if (
          productSettingValues.get(this._GrilleStyle) === 'Diamond' &&
          DiamondGrilleRulesProducts.includes(this.product.renoworksKey) &&
          DiamondGrilleRulesSizes.some(
            (obj) =>
              obj.width === productSettingValues.get(this._WidthInches) &&
              obj.height === productSettingValues.get(this._HeightInches)
          )
        ) {
          productSettingValues.set(this._GrilleStyle, 'None');
        }

        // Additional FIX: aw_400frenchwoodgliderdoor - Reset interior color if invalid for 95 size
        if (this.product.renoworksKey?.toLowerCase() === 'aw_400frenchwoodgliderdoor') {
          const currentInterior = productSettingValues.get(this._FrameColor);

          if (currentInterior) {
            const [, colorPart] = currentInterior.split('; ');
            const currentColor = colorPart?.split('=')[1];

            const selectedWidth = productSettingValues.get(this._WidthInches);
            const selectedHeight = productSettingValues.get(this._HeightInches);

            const is95Width = selectedWidth === '95.25';
            const is95Height = selectedHeight === '95.5';

            const shouldHideBlack = is95Width || is95Height;

            // If Black becomes invalid → reset to default (White)
            if (shouldHideBlack && currentColor === 'Black') {
              productSettingValues.set(this._FrameColor, 'Interior; color=White');
            }
          }
        }
      }
    }

    // Blinds Between Glass and Grilles are mutually exclusive, but we shouldn't need to do anything here (if both are selected, who would win, just remove them both?).
    // Selecting a Grille option will clear the Blinds Between Glass setting. If a Grille is currently selected, WE filter the Blinds Between Glass options so that "None" is the only option.
    // Selecting a Blinds Between Glass option will clear the Grille setting. If a Blinds Between Glass is currently selected, Renoworks will filter the Grille options so that "None" is the only option.
    if (!this._blindsBetweenGlassRules.isSupportedConfiguration(productSettingValues)) {
      productSettingValues.delete(this._BlindsBetweenGlass);
    }
  }
  //SQ-NOSCAN-END

  buildSelectedOptionsForProductSettingValues(productSettingValues) {
    let result = super.buildSelectedOptionsForProductSettingValues(productSettingValues);

    if (!isNullOrWhitespace(this._productNumber)) {
      let title = 'Product ID#';
      let value = this._productNumber;
      result.unshift({ title, value });
    }

    return result;
  }

  //SQ-NOSCAN-START - will be handled in separate ticket
  buildAttributesForRenoworksResult(renoworksResult) {
    let imageHelpers = {
      emptySwatchUrl: 'empty',
      interiorImageRootPath: renoworksResult.interiorResult.product.imageRootPath.replace(
        'http:',
        'https:'
      ),
      exteriorImageRootPath: renoworksResult.exteriorResult.product.imageRootPath.replace(
        'http:',
        'https:'
      ),
    };

    // Configuration
    let configurationAttributes = [];
    this._buildConfigurationAttribute(renoworksResult, imageHelpers, configurationAttributes);
    if (configurationAttributes.length > 0) {
      this.addProgressBarStep('Configuration', configurationAttributes);
    }

    // Sidelite Style
    let sideliteStyleAttributes = [];
    this._buildSideliteStyleAttribute(renoworksResult, imageHelpers, sideliteStyleAttributes);
    if (sideliteStyleAttributes.length > 0) {
      this.addProgressBarStep('Sidelites', sideliteStyleAttributes);
    }

    // Sizing
    let sizingAttributes = [];
    this._buildSizingAttribute(renoworksResult, sizingAttributes);
    if (sizingAttributes.length > 0) {
      this.addProgressBarStep('Sizing', sizingAttributes);
    }

    // Panel
    let panelAttributes = [];
    this._buildPanelStyleAttribute(renoworksResult, imageHelpers, panelAttributes);
    this._buildBottomRailHeightAttribute(renoworksResult, imageHelpers, panelAttributes);
    this._buildRailAndStileWidthAttribute(renoworksResult, imageHelpers, panelAttributes);
    if (panelAttributes.length > 0) {
      this.addProgressBarStep('Panels', panelAttributes);
    }

    // Profile Style
    let profileStyleAttributes = [];
    this._buildProfileStyleAttribute(renoworksResult, imageHelpers, profileStyleAttributes);
    if (profileStyleAttributes.length > 0) {
      this.addProgressBarStep('Profile', profileStyleAttributes);
    }

    // Interior
    let interiorAttributes = [];
    this._buildInteriorFrameColorAttribute(renoworksResult, imageHelpers, interiorAttributes);
    this._buildFrameStainAttribute(renoworksResult, imageHelpers, interiorAttributes);
    this._buildInteriorStainPaintAttribute(renoworksResult, imageHelpers, interiorAttributes);
    if (interiorAttributes.length > 0) {
      this.addProgressBarStep('Interior', interiorAttributes);
    }

    // Exterior
    let exteriorAttributes = [];
    this._buildExteriorFrameColorAttribute(renoworksResult, imageHelpers, exteriorAttributes);
    if (exteriorAttributes.length > 0) {
      this.addProgressBarStep('Exterior', exteriorAttributes);
    }

    // Glass
    let glassAttributes = [];
    this._buildGlassAttribute(renoworksResult, imageHelpers, glassAttributes);
    if (glassAttributes.length > 0) {
      this.addProgressBarStep('Glass', glassAttributes);
    }

    // Grilles
    let grilleAttributes = [];
    this._buildGrilleTypeAttribute(renoworksResult, imageHelpers, grilleAttributes);
    this._buildGrillePatternAttribute(renoworksResult, imageHelpers, grilleAttributes);
    this._buildGrilleWidthAttribute(renoworksResult, imageHelpers, grilleAttributes);
    if (grilleAttributes.length > 0) {
      this.addProgressBarStep('Grilles', grilleAttributes);
    }

    // Hardware Options
    let manufacturerTab = singleOrDefault(
      renoworksResult.interiorResult.product.tab,
      (_) => _.name === RenoworksKeys.Manufacturer.name
    );
    // Determine which hardware product settings we're using
    if (
      manufacturerTab != null &&
      BrandHardwareCollectionProducts.includes(this.product.renoworksKey)
    ) {
      // Remove Hardware settings since we will be using brand hardware
      this.productSettings.delete(this._HardwareOptions);

      // Brand Hardware Attributes
      let brandHardwareAttributes = [];
      this._buildBrandHardwareMfgAttribute(renoworksResult, imageHelpers, brandHardwareAttributes);
      this._buildBrandHardwareHandleStyleAttribute(
        renoworksResult,
        imageHelpers,
        brandHardwareAttributes
      );
      this._buildBrandHardwarePlateStyleAttribute(
        renoworksResult,
        imageHelpers,
        brandHardwareAttributes
      );
      this._buildBrandHardwareFinishAttribute(
        renoworksResult,
        imageHelpers,
        brandHardwareAttributes
      );
      if (brandHardwareAttributes.length > 0) {
        this.addBrandProgressBarStep('Hardware', brandHardwareAttributes);
      }
    } else {
      // Remove Brand Hardware settings since we will be using hardware attributes
      this.productSettings.delete(this._Manufacturer);
      this.productSettings.delete(this._HandleStyle);
      this.productSettings.delete(this._PlateStyle);
      this.productSettings.delete(this._Finish);

      // Hardware Attributes
      let hardwareAttributes = [];
      this._buildHardwareAttribute(renoworksResult, imageHelpers, hardwareAttributes);
      if (hardwareAttributes.length > 0) {
        this.addProgressBarStep('Hardware', hardwareAttributes);
      }
    }

    // Blinds
    let blindAttributes = [];
    this._buildBlindsBetweenGlassAttribute(renoworksResult, imageHelpers, blindAttributes);
    if (blindAttributes.length > 0) {
      this.addProgressBarStep('Blinds', blindAttributes);
    }

    // Trim
    let exteriorTrimAttributes = [];
    this._buildExteriorTrimProfileAttribute(renoworksResult, imageHelpers, exteriorTrimAttributes);
    this._buildExteriorTrimColorAttribute(renoworksResult, imageHelpers, exteriorTrimAttributes);
    if (exteriorTrimAttributes.length > 0) {
      this.addProgressBarStep('Trim', exteriorTrimAttributes);
    }

    // Operation
    let operationAttributes = [];
    this._buildOperationAttribute(renoworksResult, imageHelpers, operationAttributes);
    if (operationAttributes.length > 0) {
      this.addProgressBarStep('Operation', operationAttributes);
    }

    // Shapes
    let shapeAttributes = [];
    this._buildShapeAttribute(renoworksResult, imageHelpers, shapeAttributes);
    if (shapeAttributes.length > 0) {
      this.addProgressBarStep('Shapes', shapeAttributes);
    }
  }
  //SQ-NOSCAN-END

  _buildConfigurationAttribute(renoworksResult, imageHelpers, attributes) {
    if (EntryDoorProducts.includes(this.product.renoworksKey)) {
      let tab = singleOrDefault(
        renoworksResult.interiorResult.product.tab,
        (_) => _.name === RenoworksKeys.Configuration.name
      );
      if (tab != null) {
        let vm = new SwatchAttributeViewModel(RenoworksKeys.Configuration.name);

        for (let component of tab.component) {
          vm.options.push(
            new AttributeOption({
              title: component.name,
              isSelected: component.selected,
              productSettingChanges: [
                new ProductSettingSetValue(this._Configuration, component.name),
              ],
              image: imageHelpers.interiorImageRootPath + component.sampleImage,
              gtmItemHeader: tab.name,
              gtmItemDetail: component.name,
              side: RenoworksProductSide.Interior,
            })
          );
        }

        attributes.push(vm);
      }
    }
  }

  _buildSideliteStyleAttribute(renoworksResult, imageHelpers, attributes) {
    let tab = singleOrDefault(
      renoworksResult.exteriorResult.product.tab,
      (_) => _.name === RenoworksKeys.SideliteStyle.name
    );
    if (tab != null) {
      let vm = new SwatchAttributeViewModel(RenoworksKeys.SideliteStyle.name);

      // Don't add if config does not have sidelites
      let configSelection = renoworksResult.productSettingValues.get(this._Configuration);
      if (!configSelection.includes('With Sidelites')) {
        return;
      }

      for (let component of tab.component) {
        vm.options.push(
          new AttributeOption({
            title: component.name,
            isSelected: component.selected,
            productSettingChanges: [
              new ProductSettingSetValue(this._SideliteStyle, component.name),
            ],
            image: imageHelpers.exteriorImageRootPath + component.sampleImage,
            gtmItemHeader: tab.name,
            gtmItemDetail: component.name,
          })
        );
      }

      if (vm.options.length > this.pageSize) {
        vm.pageSize = this.pageSize;
      }

      vm.description = 'Sidelite Style';

      attributes.push(vm);
    }
  }

  _buildSizingAttribute(renoworksResult, attributes) {
    if (!this._sizingIsEnabled) {
      return;
    }

    if (this._currentProductConfiguration === null) {
      attributes.push(new DescriptionAttributeViewModel('Sizing', this.product.text.sizing));

      if (this.product.tertiaryLinks.sizeChartsLink !== null) {
        attributes.tertiaryLinks.push(this.product.tertiaryLinks.sizeChartsLink);
      }

      if (this.product.tertiaryLinks.customSizesLink !== null) {
        attributes.tertiaryLinks.push(this.product.tertiaryLinks.customSizesLink);
      }
    } else {
      let vm = new SizingAttributeViewModel(
        this.product.text.sizing,
        this.product.text.customSizing,
        DesignToolStepName.Sizing
      );

      let unique = new Set();
      let selectedHeight = renoworksResult.productSettingValues.get(this._HeightInches);
      let selectedWidth = renoworksResult.productSettingValues.get(this._WidthInches);
      let uniqueWidths = new Set();

      this._currentProductConfiguration.dimensionMappings.forEach((item) => {
        if (!uniqueWidths.has(item.fractionalWidth)) {
          vm.widths.push(
            new AttributeOption({
              title: item.fractionalWidth + '"',
              isSelected: item.width === selectedWidth,
              productSettingChanges: [new ProductSettingSetValue(this._WidthInches, item.width)],
              gtmItemHeader: 'sizing',
              gtmItemDetail: 'selected',
            })
          );
          uniqueWidths.add(item.fractionalWidth);
        }
      });

      this._currentProductConfiguration.dimensionMappings.forEach((item) => {
        if (item.width === selectedWidth && !unique.has(item)) {
          vm.heights.push(
            new AttributeOption({
              title: item.fractionalHeight + '"',
              isSelected: item.height === selectedHeight,
              productSettingChanges: [new ProductSettingSetValue(this._HeightInches, item.height)],
              gtmItemHeader: 'sizing',
              gtmItemDetail: 'selected',
            })
          );
          unique.add(item);
        }
      });

      if (this.product.tertiaryLinks.sizeChartsLink !== null) {
        vm.tertiaryLinks.push(this.product.tertiaryLinks.sizeChartsLink);
      }

      if (this.product.tertiaryLinks.customSizesLink !== null) {
        vm.tertiaryLinks.push(this.product.tertiaryLinks.customSizesLink);
      }

      attributes.push(vm);
    }
  }

  _buildPanelStyleAttribute(renoworksResult, imageHelpers, attributes) {
    let tab = singleOrDefault(
      renoworksResult.exteriorResult.product.tab,
      (_) => _.name === RenoworksKeys.PanelStyle.name
    );
    if (tab != null) {
      let vm = new SwatchAttributeViewModel(RenoworksKeys.PanelStyle.name);

      for (let component of tab.component) {
        vm.options.push(
          new AttributeOption({
            title: component.name,
            isSelected: component.selected,
            productSettingChanges: [new ProductSettingSetValue(this._PanelStyle, component.name)],
            image: imageHelpers.exteriorImageRootPath + component.sampleImage,
            gtmItemHeader: tab.name,
            gtmItemDetail: component.name,
          })
        );
      }

      if (vm.options.length > this.pageSize) {
        vm.pageSize = this.pageSize;
      }

      vm.description = 'Panel Style';

      attributes.push(vm);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _buildBottomRailHeightAttribute(renoworksResult, imageHelpers, attributes) {
    // Only shown when you choose "Traditional" panel style
    let tab = singleOrDefault(
      renoworksResult.exteriorResult.product.tab,
      (_) => _.name === RenoworksKeys.BottomRailHeight.name
    );
    if (tab != null) {
      // Renoworks is sending us data, so check the panel style to see if we should actually add it
      let panelStyle = renoworksResult.productSettingValues.get(this._PanelStyle);

      if (panelStyle !== 'Traditional') {
        return;
      }

      let vm = new TextAttributeViewModel();

      for (let component of tab.component) {
        vm.options.push(
          new AttributeOption({
            title: component.name,
            isSelected: component.selected,
            productSettingChanges: [
              new ProductSettingSetValue(this._BottomRailHeight, component.name),
            ],
            gtmItemHeader: 'Bottom Rail Height',
            gtmItemDetail: component.name,
          })
        );
      }

      if (vm.options.length > this.pageSize) {
        vm.pageSize = this.pageSize;
      }

      vm.description = 'Bottom Rail Height';

      attributes.push(vm);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _buildRailAndStileWidthAttribute(renoworksResult, imageHelpers, attributes) {
    // Only shown when you choose "Contemporary" panel style
    let tab = singleOrDefault(
      renoworksResult.exteriorResult.product.tab,
      (_) => _.name === RenoworksKeys.RailAndStileWidth.name
    );
    if (tab != null) {
      // Renoworks is sending us data, so check the panel style to see if we should actually add it
      let panelStyle = renoworksResult.productSettingValues.get(this._PanelStyle);

      if (panelStyle !== 'Contemporary') {
        return;
      }

      let vm = new TextAttributeViewModel();

      for (let component of tab.component) {
        vm.options.push(
          new AttributeOption({
            title: component.name,
            isSelected: component.selected,
            productSettingChanges: [
              new ProductSettingSetValue(this._RailAndStileWidth, component.name),
            ],
            gtmItemHeader: 'Rail & Stile Width',
            gtmItemDetail: component.name,
          })
        );
      }

      if (vm.options.length > this.pageSize) {
        vm.pageSize = this.pageSize;
      }

      vm.description = 'Rail & Stile Width';

      attributes.push(vm);
    }
  }

  //SQ-NOSCAN-START - will be handled in separate ticket
  _buildInteriorFrameColorAttribute(renoworksResult, imageHelpers, attributes) {
    let tab = singleOrDefault(
      renoworksResult.interiorResult.product.tab,
      (_) => _.name === RenoworksKeys.FrameColor.name
    );

    let selectedWidth = renoworksResult.productSettingValues.get(this._WidthInches);
    let selectedHeight = renoworksResult.productSettingValues.get(this._HeightInches);
    const is95Width = selectedWidth === '95.25';
    const is95Height = selectedHeight === '95.5';

    const shouldHideBlack =
      this.product.renoworksKey?.toLowerCase() === 'aw_400frenchwoodgliderdoor' &&
      (is95Width || is95Height);

    if (tab != null) {
      let showMahoganyNote = false;

      let vm = new TabbedSwatchAttributeViewModel();

      // If A-Series, then set section description
      if (this.product.renoworksKey.startsWith('aw_a')) {
        vm.description =
          'A-Series products offer real wood interiors, with unfinished, stained and painted interior options. Stained interiors are available on pine, oak and maple. Painted interiors are available on pine and maple.';
      }
      if (EntryDoorProducts.includes(this.product.renoworksKey)) {
        vm.description =
          'Entry Door products offer real wood interiors, with unfinished and painted interior options. Painted interiors are available on pine.  Black and dark bronze also available on maple.  Anodized silver available on maple.';
      }

      for (let component of tab.component) {
        let group;
        // If A-Series or Entry Doors, then hardcode color groups
        if (
          component.name === 'Interior' &&
          (this.product.renoworksKey.startsWith('aw_a') ||
            EntryDoorProducts.includes(this.product.renoworksKey))
        ) {
          // Entry Doors color groups
          if (EntryDoorProducts.includes(this.product.renoworksKey)) {
            // Entry Doors- Available unfinished
            // Entry Doors - Painted interiors
            group = new AttributeOptionGroup('Painted');

            for (let color of component.color) {
              if (EntryDoorUnfinishedInteriors.includes(color.name)) {
                continue;
              }

              group.options.push(
                new AttributeOption({
                  title: color.name === 'Mahogany' ? 'Mahogany*' : color.name,
                  isSelected: color.selected,
                  productSettingChanges: [
                    new ProductSettingSetValue(
                      this._FrameColor,
                      component.name + '; color=' + color.name
                    ),
                  ],
                  image: isNullOrWhitespace(color.swatch)
                    ? imageHelpers.emptySwatchUrl
                    : imageHelpers.interiorImageRootPath + color.swatch,
                  gtmItemHeader: component.name,
                  gtmItemDetail: color.name,
                  colorRgb: color.rgb,
                  imageSide: RenoworksProductSide.Interior,
                })
              );

              showMahoganyNote = showMahoganyNote || color.name === 'Mahogany';
            }

            if (group.options.length > this.pageSize) {
              group.pageSize = this.pageSize;
            }

            vm.groups.push(group);

            group = new AttributeOptionGroup('Unfinished');

            for (let color of component.color) {
              if (!EntryDoorUnfinishedInteriors.includes(color.name)) {
                continue;
              }

              group.options.push(
                new AttributeOption({
                  title: color.name === 'Mahogany' ? 'Mahogany*' : color.name,
                  isSelected: color.selected,
                  productSettingChanges: [
                    new ProductSettingRemoveValue(this._FrameStain),
                    new ProductSettingSetValue(
                      this._FrameColor,
                      component.name + '; color=' + color.name
                    ),
                  ],
                  image: isNullOrWhitespace(color.swatch)
                    ? imageHelpers.emptySwatchUrl
                    : imageHelpers.interiorImageRootPath + color.swatch,
                  gtmItemHeader: component.name,
                  gtmItemDetail: color.name,
                  colorRgb: color.rgb,
                  imageSide: RenoworksProductSide.Interior,
                })
              );

              showMahoganyNote = showMahoganyNote || color.name === 'Mahogany';
            }

            if (group.options.length > this.pageSize) {
              group.pageSize = this.pageSize;
            }

            vm.groups.push(group);
          }

          // A-Series color groups
          if (this.product.renoworksKey.startsWith('aw_a')) {
            // A-Series - Available unfinished, stained or painted
            group = new AttributeOptionGroup('Unfinished, stained or painted');

            for (let color of component.color) {
              if (!ASeriesStainablePaintableInteriors.includes(color.name)) {
                continue;
              }

              group.options.push(
                new AttributeOption({
                  title: color.name === 'Mahogany' ? 'Mahogany*' : color.name,
                  isSelected: color.selected,
                  productSettingChanges: [
                    new ProductSettingSetValue(
                      this._FrameColor,
                      component.name + '; color=' + color.name
                    ),
                  ],
                  image: isNullOrWhitespace(color.swatch)
                    ? imageHelpers.emptySwatchUrl
                    : imageHelpers.interiorImageRootPath + color.swatch,
                  gtmItemHeader: component.name,
                  gtmItemDetail: color.name,
                  colorRgb: color.rgb,
                  imageSide: RenoworksProductSide.Interior,
                })
              );

              showMahoganyNote = showMahoganyNote || color.name === 'Mahogany';
            }

            if (group.options.length > this.pageSize) {
              group.pageSize = this.pageSize;
            }

            vm.groups.push(group);

            // A-Series - Available unfinished or stained
            group = new AttributeOptionGroup('Unfinished or stained');

            for (let color of component.color) {
              if (!ASeriesStainableInteriors.includes(color.name)) {
                continue;
              }

              group.options.push(
                new AttributeOption({
                  title: color.name === 'Mahogany' ? 'Mahogany*' : color.name,
                  isSelected: color.selected,
                  productSettingChanges: [
                    new ProductSettingRemoveValue(this._FrameStain),
                    new ProductSettingSetValue(
                      this._FrameColor,
                      component.name + '; color=' + color.name
                    ),
                  ],
                  image: isNullOrWhitespace(color.swatch)
                    ? imageHelpers.emptySwatchUrl
                    : imageHelpers.interiorImageRootPath + color.swatch,
                  gtmItemHeader: component.name,
                  gtmItemDetail: color.name,
                  colorRgb: color.rgb,
                  imageSide: RenoworksProductSide.Interior,
                })
              );

              showMahoganyNote = showMahoganyNote || color.name === 'Mahogany';
            }

            if (group.options.length > this.pageSize) {
              group.pageSize = this.pageSize;
            }

            vm.groups.push(group);

            // A-Series - Available unfinished only
            group = new AttributeOptionGroup('Unfinished only');

            for (let color of component.color) {
              if (!ASeriesUnfinishedInteriors.includes(color.name)) {
                continue;
              }

              group.options.push(
                new AttributeOption({
                  title: color.name === 'Mahogany' ? 'Mahogany*' : color.name,
                  isSelected: color.selected,
                  productSettingChanges: [
                    new ProductSettingRemoveValue(this._FrameStain),
                    new ProductSettingSetValue(
                      this._FrameColor,
                      component.name + '; color=' + color.name
                    ),
                  ],
                  image: isNullOrWhitespace(color.swatch)
                    ? imageHelpers.emptySwatchUrl
                    : imageHelpers.interiorImageRootPath + color.swatch,
                  gtmItemHeader: component.name,
                  gtmItemDetail: color.name,
                  colorRgb: color.rgb,
                  imageSide: RenoworksProductSide.Interior,
                })
              );

              showMahoganyNote = showMahoganyNote || color.name === 'Mahogany';
            }

            if (group.options.length > this.pageSize) {
              group.pageSize = this.pageSize;
            }

            vm.groups.push(group);
          }
        } else {
          group = new AttributeOptionGroup(component.name);

          // Black Or Dark Bronze Special Color Rules
          // Only allow Black or Dark Bronze as an interior color if it is selected as an exterior color
          if (BlackOrDarkBronzeSpecialColorRulesProducts.includes(this.product.renoworksKey)) {
            group.note =
              'Black and dark bronze interior only available with matching exterior color.';
          }

          // 400 Series Gliding Door
          // Only allow White as an interior if it is selected as an exterior color
          if (this.product.renoworksKey == 'aw_400frenchwoodgliderdoor') {
            group.note = 'White interior only available with matching exterior color.';
          }

          for (let color of component.color) {
            if (shouldHideBlack && color.name === 'Black') {
              continue;
            }

            let parameters = [
              new ProductSettingSetValue(
                this._FrameColor,
                component.name + '; color=' + color.name
              ),
            ];

            // 200 Series Perma-Shield® Patio Door: Interior Color = Exterior Color
            // Changing the Interior Color should also change the Exterior color
            if (this.product.renoworksKey === 'aw_200permashieldgliderdoor') {
              parameters.push(
                new ProductSettingSetValue(
                  this._FrameColorExterior,
                  'Exterior Door Color; color=' + color.name
                )
              );
            }
            // Black, Dark Bronze and Sandtone Special Color Rules
            // For all 100 Glider Door products
            else if (this.product.renoworksKey === 'aw_100gliderdoor') {
              group.note =
                'Black, dark bronze and sandtone interior only available with matching exterior color.';
              parameters.push(
                new ProductSettingSetValue(
                  this._FrameColorExterior,
                  'Exterior Door Color; color=' + color.name
                )
              );
            }
            // Black, Dark Bronze and Sandtone Special Color Rules
            // For all 100 series windows
            else if (this.product.renoworksKey.startsWith('aw_100')) {
              group.note =
                'Black, dark bronze and sandtone interior only available with matching exterior color.';
              parameters.push(
                new ProductSettingSetValue(
                  this._FrameColorExterior,
                  'Exterior Window Color; color=' + color.name
                )
              );
            }
            // Black Or Dark Bronze Special Color Rules
            // Black or Dark Bronze interior are only available with matching exterior color
            else if (
              BlackOrDarkBronzeSpecialColorRulesProducts.includes(this.product.renoworksKey)
            ) {
              if (color.name === 'Black' || color.name === 'Dark Bronze') {
                parameters.push(
                  new ProductSettingSetValue(
                    this._FrameColorExterior,
                    'Exterior Window Color; color=' + color.name
                  )
                );
              }
            }
            // 400 Series Gliding Door
            // White interior is only available with matching exterior color
            else if (this.product.renoworksKey === 'aw_400frenchwoodgliderdoor') {
              if (color.name === 'White') {
                parameters.push(
                  new ProductSettingSetValue(
                    this._FrameColorExterior,
                    'Exterior Door Color; color=' + color.name
                  )
                );
              }
            }

            group.options.push(
              new AttributeOption({
                title: color.name === 'Mahogany' ? 'Mahogany*' : color.name,
                isSelected: color.selected,
                productSettingChanges: parameters,
                image: isNullOrWhitespace(color.swatch)
                  ? imageHelpers.emptySwatchUrl
                  : imageHelpers.interiorImageRootPath + color.swatch,
                gtmItemHeader: component.name,
                gtmItemDetail: color.name,
                colorRgb: color.rgb,
                imageSide: RenoworksProductSide.Interior,
              })
            );

            showMahoganyNote = showMahoganyNote || color.name === 'Mahogany';
          }

          if (group.options.length > this.pageSize) {
            group.pageSize = this.pageSize;
          }

          vm.groups.push(group);
        }
      }

      if (showMahoganyNote) {
        vm.note =
          '* Actual wood is sapele, a non-endangered species of mahogany, grown in Africa, with color and characteristics similar to American mahoganies.';
      }

      if (vm.groups.length > 0) {
        attributes.push(vm);
      }
    }
  }
  //SQ-NOSCAN-END

  //SQ-NOSCAN-START - will be handled in separate ticket
  _buildFrameStainAttribute(renoworksResult, imageHelpers, attributes) {
    let tab = singleOrDefault(
      renoworksResult.interiorResult.product.tab,
      (_) => _.name === RenoworksKeys.FrameStain.name
    );

    let selectedInteriorColor = renoworksResult.productSettingValues.get(this._FrameColor);
    const [_interior, colorPart] = selectedInteriorColor.split('; ');
    const colorSetting = colorPart.split('=')[1];

    // E-Series Pine is only available unfinished, hiding this tab selection
    if (
      ESeriesProducts.has(this.product.renoworksKey) &&
      ESeriesUnfinishedOnlyInteriorWoodOptions.has(colorSetting)
    ) {
      return;
    }

    if (tab != null) {
      let vm = new TabbedSwatchAttributeViewModel();

      for (let component of tab.component) {
        let groupName = component.name === 'Interior Stain' ? 'Interior Finish' : component.name;
        let group = new AttributeOptionGroup(groupName);

        for (let color of component.color) {
          group.options.push(
            new AttributeOption({
              title: color.name === 'Mahogany' ? 'Mahogany*' : color.name,
              isSelected: color.selected,
              productSettingChanges: [
                new ProductSettingSetValue(
                  this._FrameStain,
                  component.name + '; color=' + color.name
                ),
              ],
              image: isNullOrWhitespace(color.swatch)
                ? imageHelpers.emptySwatchUrl
                : imageHelpers.interiorImageRootPath + color.swatch,
              gtmItemHeader: component.name,
              gtmItemDetail: color.name,
              colorRgb: color.rgb,
              imageSide: RenoworksProductSide.Interior,
            })
          );
        }

        if (group.options.length > this.pageSize) {
          group.pageSize = this.pageSize;
        }

        vm.groups.push(group);
      }

      if (vm.groups.length > 0) {
        attributes.push(vm);
      }
    }
  }
  //SQ-NOSCAN-END

  //SQ-NOSCAN-START - will be handled in separate ticket
  _buildInteriorStainPaintAttribute(renoworksResult, imageHelpers, attributes) {
    let tab = singleOrDefault(
      renoworksResult.interiorResult.product.tab,
      (_) => _.name === RenoworksKeys.InteriorStainPaint.name
    );
    if (tab != null) {
      let vm = new TabbedSwatchAttributeViewModel();

      for (let component of tab.component) {
        let groupName = component.name === 'Interior Stain' ? 'Interior Finish' : component.name;
        let group = new AttributeOptionGroup(groupName);

        for (let color of component.color) {
          group.options.push(
            new AttributeOption({
              title: color.name === 'Mahogany' ? 'Mahogany*' : color.name,
              isSelected: color.selected,
              productSettingChanges: [
                new ProductSettingSetValue(
                  this._InteriorStainPaint,
                  component.name + '; color=' + color.name
                ),
              ],
              image: isNullOrWhitespace(color.swatch)
                ? imageHelpers.emptySwatchUrl
                : imageHelpers.interiorImageRootPath + color.swatch,
              gtmItemHeader: component.name,
              gtmItemDetail: color.name,
              colorRgb: color.rgb,
              imageSide: RenoworksProductSide.Interior,
            })
          );
        }

        if (group.options.length > this.pageSize) {
          group.pageSize = this.pageSize;
        }

        vm.groups.push(group);
      }

      if (vm.groups.length > 0) {
        attributes.push(vm);
      }
    }
  }
  //SQ-NOSCAN-END

  //SQ-NOSCAN-START - will be handled in separate ticket
  _buildHardwareAttribute(renoworksResult, imageHelpers, attributes) {
    let vm = new HardwareAttributeViewModel(RenoworksKeys.HardwareOptions.name);

    // Optional Hardware color must match the hardware color, so we will grab it while processing the hardware
    let hardwareColor = 'White';

    let showOilRubbedBronzeNote = false;
    let showPvdNote = false;

    let tab = singleOrDefault(
      renoworksResult.interiorResult.product.tab,
      (_) => _.name === RenoworksKeys.HardwareOptions.name
    );
    if (tab != null) {
      for (let component of tab.component) {
        let group = new SelectableAttributeOptionGroup({
          title: component.name,
          isSelected: component.selected,
          productSettingChanges: [
            new ProductSettingSetValue(this._HardwareOptions, component.name),
          ],
          image: imageHelpers.interiorImageRootPath + component.sampleImage,
          gtmItemHeader: 'Hardware',
          gtmItemDetail: component.name,
          imageSide: RenoworksProductSide.Interior,
        });

        if (component.color) {
          let optionalHardwareTab = singleOrDefault(
            renoworksResult.interiorResult.product.tab,
            (_) => _.name === RenoworksKeys.OptionalHardware.name
          );
          let optionalHardware =
            optionalHardwareTab === null
              ? null
              : singleOrDefault(optionalHardwareTab.component, (_) => _.selected);

          for (let color of component.color) {
            if (color.selected) {
              hardwareColor = color.name;
            }

            let parameters = [
              new ProductSettingSetValue(
                this._HardwareOptions,
                component.name + '; color=' + color.name
              ),
            ];

            if (optionalHardware !== null) {
              parameters.push(
                new ProductSettingSetValue(
                  this._OptionalHardware,
                  optionalHardware.name + '; color=' + color.name
                )
              );
            }

            const displayName = starredColors.has(color.name) ? `${color.name}*` : color.name;
            group.options.push(
              new AttributeOption({
                title: displayName,
                isSelected: color.selected,
                productSettingChanges: parameters,
                image: isNullOrWhitespace(color.swatch)
                  ? imageHelpers.emptySwatchUrl
                  : imageHelpers.interiorImageRootPath + color.swatch,
                gtmItemHeader: 'Hardware',
                gtmItemDetail: component.name + ', ' + color.name,
                colorRgb: color.rgb,
                imageSide: RenoworksProductSide.Interior,
              })
            );

            showOilRubbedBronzeNote =
              showOilRubbedBronzeNote ||
              (component.selected && oilRubbedBronzeColors.includes(color.name));
            showPvdNote = showPvdNote || (component.selected && pvdColors.includes(color.name));
          }
        }

        vm.groups.push(group);
      }
    }

    tab = singleOrDefault(
      renoworksResult.interiorResult.product.tab,
      (_) => _.name === RenoworksKeys.OptionalHardware.name
    );
    if (tab != null && renoworksResult.interiorResult.product.name != '200 Series Gliding Window') {
      // TODO: Optional Lift Hardware vs Optional Hardware
      for (let component of tab.component) {
        vm.optional.push(
          new AttributeOption({
            title: component.name,
            isSelected: component.selected,
            productSettingChanges: [
              new ProductSettingSetValue(
                this._OptionalHardware,
                component.name + '; color=' + hardwareColor
              ),
            ],
            image: imageHelpers.interiorImageRootPath + component.sampleImage,
            gtmItemHeader: 'Hardware Options',
            gtmItemDetail: component.name,
            imageSide: RenoworksProductSide.Interior,
          })
        );

        showPvdNote = showPvdNote || pvdColors.includes(component.name);
      }
    }

    let notes = [];
    if (this.product.renoworksKey === 'aw_100doublehung') {
      notes.push('Standard lock and keeper finishes match your interior finish selection.');
    }
    if (showOilRubbedBronzeNote) {
      notes.push(
        '* Distressed Bronze and Oil Rubbed Bronze finishes are “living finishes” that will change with time and use.'
      );
    }
    if (showPvdNote) {
      notes.push(
        '* Bright Brass and Satin Nickel finishes have a Physical Vapor Deposition (PVD) finish for improved durability and feature a 10-year limited warranty.'
      );
    }

    if (notes.length > 0) {
      vm.note = notes.join('\n');
    }

    if (vm.groups.length > 0 || vm.optional.length > 0) {
      attributes.push(vm);
    }
  }
  //SQ-NOSCAN-END
  _buildBrandHardwareMfgAttribute(renoworksResult, imageHelpers, attributes) {
    let tab = singleOrDefault(
      renoworksResult.interiorResult.product.tab,
      (_) => _.name === RenoworksKeys.Manufacturer.name
    );

    if (tab != null) {
      let vm = new BrandHardwareAttributeViewModel();

      for (let component of tab.component) {
        vm.options.push(
          new AttributeOption({
            title: component.name,
            isSelected: component.selected,
            productSettingChanges: [new ProductSettingSetValue(this._Manufacturer, component.name)],
            image: imageHelpers.interiorImageRootPath + component.sampleImage,
            gtmItemHeader: tab.name,
            gtmItemDetail: component.name,
          })
        );
      }

      vm.description = 'Brand Collections';
      attributes.push(vm);
    }
  }

  _buildBrandHardwareHandleStyleAttribute(renoworksResult, imageHelpers, attributes) {
    let tab = singleOrDefault(
      renoworksResult.interiorResult.product.tab,
      (_) => _.name === RenoworksKeys.HandleStyle.name
    );

    if (tab != null) {
      let vm = new BrandHardwareAttributeViewModel();

      for (let component of tab.component) {
        vm.options.push(
          new AttributeOption({
            title: component.name,
            isSelected: component.selected,
            productSettingChanges: [new ProductSettingSetValue(this._HandleStyle, component.name)],
            image: imageHelpers.interiorImageRootPath + component.sampleImage,
            gtmItemHeader: tab.name,
            gtmItemDetail: component.name,
          })
        );
      }

      vm.description = 'Handle Styles';
      attributes.push(vm);
    }
  }

  _buildBrandHardwarePlateStyleAttribute(renoworksResult, imageHelpers, attributes) {
    let tab = singleOrDefault(
      renoworksResult.interiorResult.product.tab,
      (_) => _.name === RenoworksKeys.PlateStyle.name
    );

    if (tab != null && tab.component[0].name !== 'N/A') {
      let vm = new BrandHardwareAttributeViewModel();

      for (let component of tab.component) {
        vm.options.push(
          new AttributeOption({
            title: component.name,
            isSelected: component.selected,
            productSettingChanges: [new ProductSettingSetValue(this._PlateStyle, component.name)],
            image: imageHelpers.interiorImageRootPath + component.sampleImage,
            gtmItemHeader: tab.name,
            gtmItemDetail: component.name,
          })
        );
      }

      vm.description = 'Plate Styles';
      attributes.push(vm);
    }
  }

  _buildBrandHardwareFinishAttribute(renoworksResult, imageHelpers, attributes) {
    let tab = singleOrDefault(
      renoworksResult.interiorResult.product.tab,
      (_) => _.name === RenoworksKeys.Finish.name
    );

    if (tab != null) {
      let vm = new BrandHardwareFinishAttributeViewModel();

      for (let component of tab.component) {
        vm.options.push(
          new AttributeOption({
            title: component.name,
            isSelected: component.selected,
            productSettingChanges: [new ProductSettingSetValue(this._Finish, component.name)],
            image: imageHelpers.interiorImageRootPath + component.sampleImage,
            gtmItemHeader: tab.name,
            gtmItemDetail: component.name,
          })
        );
      }

      vm.description = 'Finishes';

      let showPvdNote = false;
      for (let option of vm.options) {
        showPvdNote = showPvdNote || ['Satin Nickel', 'Satin Nickel (PVD)'].includes(option.title);
      }

      let notes = [];
      if (showPvdNote) {
        notes.push(
          '* Bright Brass and Satin Nickel finishes have a Physical Vapor Deposition (PVD) finish for improved durability and feature a 10-year limited warranty.'
        );
      }

      if (notes.length > 0) {
        vm.note = notes.join('\n');
      }

      attributes.push(vm);
    }
  }

  _buildBlindsBetweenGlassAttribute(renoworksResult, imageHelpers, attributes) {
    let tab = singleOrDefault(
      renoworksResult.interiorResult.product.tab,
      (_) => _.name === RenoworksKeys.BlindsBetweenGlass.name
    );
    let eSeriesNoLongerSupported =
      this.product.renoworksKey === 'aw_egliderdoor' ||
      this.product.renoworksKey === 'aw_ehingeddoor';
    if (tab != null && !eSeriesNoLongerSupported) {
      let vm = new SwatchAttributeViewModel(RenoworksKeys.BlindsBetweenGlass.name);

      // Blinds between glass isn't alowed if a grille is selected
      let grillePattern = renoworksResult.productSettingValues.get(this._GrilleStyle) || 'None';

      let allowBlindsBetweenGlassOptions =
        grillePattern === 'None' &&
        this._blindsBetweenGlassRules.isSupportedConfiguration(
          renoworksResult.productSettingValues
        );

      for (let component of tab.component) {
        if (allowBlindsBetweenGlassOptions || component.name === 'None') {
          vm.options.push(
            new AttributeOption({
              title: component.name,
              isSelected: component.selected,
              productSettingChanges: [
                new ProductSettingSetValue(this._BlindsBetweenGlass, component.name),
                new ProductSettingRemoveValue(this._GrilleStyle),
              ],
              image: imageHelpers.interiorImageRootPath + component.sampleImage,
              gtmItemHeader: 'Blinds',
              gtmItemDetail: component.name,
            })
          );
        }
      }

      vm.description = 'Blinds-Between-the-Glass';

      if (
        this._blindsBetweenGlassRules.isSupportedConfiguration(renoworksResult.productSettingValues)
      ) {
        if (grillePattern !== 'None') {
          vm.note = 'Blinds are not available with doors that are designed with a grilles option.';
        }
      } else {
        vm.note = 'Blinds are not available for this configuration.';
      }

      attributes.push(vm);
    }
  }

  _buildGrilleTypeAttribute(renoworksResult, imageHelpers, attributes) {
    let tab = singleOrDefault(
      renoworksResult.interiorResult.product.tab,
      (_) => _.name === RenoworksKeys.GrilleType.name
    );
    if (tab != null) {
      let vm = new SwatchAttributeViewModel(RenoworksKeys.GrilleType.name);

      for (let component of tab.component) {
        vm.options.push(
          new AttributeOption({
            title: component.name,
            isSelected: component.selected,
            productSettingChanges: [new ProductSettingSetValue(this._GrilleType, component.name)],
            image: imageHelpers.interiorImageRootPath + component.sampleImage,
            gtmItemHeader: 'Grilles',
            gtmItemDetail: component.name,
          })
        );
      }

      if (vm.options.length > this.pageSize) {
        vm.pageSize = this.pageSize;
      }

      attributes.push(vm);
    }
  }

  //SQ-NOSCAN-START - will be handled in separate ticket
  _buildGrillePatternAttribute(renoworksResult, imageHelpers, attributes) {
    let tab = singleOrDefault(
      renoworksResult.interiorResult.product.tab,
      (_) => _.name === RenoworksKeys.GrilleStyle.name
    );
    if (tab != null) {
      let vm = new SwatchAttributeViewModel(RenoworksKeys.GrilleStyle.name);

      let selectedHeight = renoworksResult.productSettingValues.get(this._HeightInches);
      let selectedWidth = renoworksResult.productSettingValues.get(this._WidthInches);

      for (let component of tab.component) {
        // If the "Remove Tall Fraction Grille Option" toggle is enabled, we want to omit Tall Fractional from the grille options for all products
        if (component.name === 'Tall Fractional') {
          continue;
        }

        // If "Custom", set a note to be displayed and do not add as an option
        if (component.name === 'Custom') {
          vm.note =
            'You can also design your own custom grille style. You sketch it, our craftsmen will create it.';
          continue;
        }

        // Hide Diamond Grille option for certain products
        if (
          component.name === 'Diamond' &&
          DiamondGrilleRulesProducts.includes(this.product.renoworksKey) &&
          DiamondGrilleRulesSizes.some(
            (obj) => obj.width === selectedWidth && obj.height === selectedHeight
          )
        ) {
          continue;
        }

        vm.options.push(
          new AttributeOption({
            title: component.name,
            isSelected: component.selected,
            productSettingChanges: [
              new ProductSettingSetValue(this._GrilleStyle, component.name),
              new ProductSettingRemoveValue(this._BlindsBetweenGlass),
            ],
            image: imageHelpers.interiorImageRootPath + component.sampleImage,
            gtmItemHeader: 'Grilles',
            gtmItemDetail: component.name,
          })
        );
      }

      if (vm.options.length > this.pageSize) {
        vm.pageSize = this.pageSize;
      }

      let blindsBetweenGlass =
        renoworksResult.productSettingValues.get(this._BlindsBetweenGlass) || 'None';
      if (blindsBetweenGlass !== 'None') {
        if (vm.note) {
          vm.note +=
            ' Grilles are not available with doors that are designed with a blinds-between-the-glass option.';
        } else {
          vm.note =
            'Grilles are not available with doors that are designed with a blinds-between-the-glass option.';
        }
      }

      if (!vm.description) {
        vm.description = 'Grilles';
      }

      attributes.push(vm);
    }
  }
  //SQ-NOSCAN-END

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _buildGrilleWidthAttribute(renoworksResult, imageHelpers, attributes) {
    let grilleStyle = singleOrDefault(
      renoworksResult.interiorResult.product.tab,
      (_) => _.name === RenoworksKeys.GrilleStyle.name
    );
    if (grilleStyle === null) {
      return;
    }

    // Don't display grille widths for Bay and Bow
    if (BayBowSizingRulesProducts.includes(this.product.renoworksKey)) {
      return;
    }

    let selectedGrilleStyle = singleOrDefault(grilleStyle.component, (_) => _.selected);
    if (selectedGrilleStyle === null) {
      return;
    }

    if (selectedGrilleStyle.grilleWidth && selectedGrilleStyle.grilleWidth.length > 0) {
      let vm = new TextAttributeViewModel();

      for (let width of selectedGrilleStyle.grilleWidth) {
        vm.options.push(
          new AttributeOption({
            title: width.name,
            isSelected: width.selected,
            productSettingChanges: [new ProductSettingSetValue(this._GrilleWidth, width.name)],
            gtmItemHeader: 'Grilles',
            gtmItemDetail: width.name,
          })
        );
      }

      vm.description = 'Grille Width';

      attributes.push(vm);
    }
  }

  //SQ-NOSCAN-START - will be handled in separate ticket
  _buildExteriorFrameColorAttribute(renoworksResult, imageHelpers, attributes) {
    let tab = singleOrDefault(
      renoworksResult.exteriorResult.product.tab,
      (_) => _.name === RenoworksKeys.FrameColor.name
    );
    let sashColorTab = singleOrDefault(
      renoworksResult.exteriorResult.product.tab,
      (_) => _.name === RenoworksKeys.SashColor.name
    );
    if (tab != null || sashColorTab != null) {
      // 200 Series Perma-Shield® Patio Door: Interior Color = Exterior Color
      if (this.product.renoworksKey === 'aw_200permashieldgliderdoor') {
        attributes.push(
          new DescriptionAttributeViewModel(
            '<p>Exterior finish is determined by your interior color choice.</p>'
          )
        );
      } else {
        let vm = new TabbedSwatchAttributeViewModel();
        if (tab != null) {
          for (let component of tab.component) {
            let group = new AttributeOptionGroup(component.name);
            let interiorColor;

            let colors = component.color;
            if (this.product.renoworksKey.startsWith('aw_100')) {
              // if 100 series special colors rules
              // Only allow Black, Dark Bronze and Sandtone as an interior color if it is selected as an exterior color

              group.note =
                'Black, dark bronze and sandtone interior only available with matching exterior color.';

              interiorColor = renoworksResult.productSettingValues.get(this._FrameColor);
              if (interiorColor === undefined) {
                throw new Error(
                  'Unable to find a selected "' +
                    RenoworksKeys.FrameColor.name +
                    '" in the Interior data returned by Renoworks. This value is required for 100 Series business logic.'
                );
              }

              if (interiorColor === 'Interior; color=Black') {
                colors = component.color.filter((_) => _.name == 'Black');
              } else if (interiorColor === 'Interior; color=Dark Bronze') {
                colors = component.color.filter((_) => _.name == 'Dark Bronze');
              } else if (interiorColor === 'Interior; color=Sandtone') {
                colors = component.color.filter((_) => _.name == 'Sandtone');
              }
            } else if (
              BlackOrDarkBronzeSpecialColorRulesProducts.includes(this.product.renoworksKey)
            ) {
              // Black Or Dark Bronze Special Color Rules
              // Only allow Black or Dark Bronze as an interior color if it is selected as an exterior color

              group.note =
                'Black and dark bronze interior only available with matching exterior color.';

              interiorColor = renoworksResult.productSettingValues.get(this._FrameColor);
              if (interiorColor === undefined) {
                throw new Error(
                  'Unable to find a selected "' +
                    RenoworksKeys.FrameColor.name +
                    '" in the Interior data returned by Renoworks. This value is required for Black Or Dark Bronze business logic.'
                );
              }

              if (interiorColor === 'Interior; color=Black') {
                colors = component.color.filter((_) => _.name == 'Black');
              } else if (interiorColor === 'Interior; color=Dark Bronze') {
                colors = component.color.filter((_) => _.name == 'Dark Bronze');
              }
            }

            // 400 Series Gliding Door
            // Only allow White as an interior color if it is selected as an exterior color
            if (this.product.renoworksKey === 'aw_400frenchwoodgliderdoor') {
              group.note = 'White interior only available with matching exterior color.';

              interiorColor = renoworksResult.productSettingValues.get(this._FrameColor);
              if (interiorColor === undefined) {
                throw new Error(
                  'Unable to find a selected "' +
                    RenoworksKeys.FrameColor.name +
                    '" in the Interior data returned by Renoworks. This value is required for 400 Series Gliding Door business logic.'
                );
              }

              if (interiorColor === 'Interior; color=White') {
                colors = component.color.filter((_) => _.name == 'White');
              }
            }

            for (let color of colors) {
              group.options.push(
                new AttributeOption({
                  title: color.name,
                  isSelected: color.selected,
                  productSettingChanges: [
                    new ProductSettingSetValue(
                      this._FrameColorExterior,
                      component.name + '; color=' + color.name
                    ),
                  ],
                  image: isNullOrWhitespace(color.swatch)
                    ? imageHelpers.emptySwatchUrl
                    : imageHelpers.exteriorImageRootPath + color.swatch,
                  gtmItemHeader: component.name,
                  gtmItemDetail: color.name,
                  colorRgb: color.rgb,
                  imageSide: RenoworksProductSide.Exterior,
                })
              );
            }

            if (group.options.length > this.pageSize) {
              group.pageSize = this.pageSize;
            }

            vm.groups.push(group);
          }
        }
        if (
          sashColorTab != null &&
          renoworksResult.exteriorResult.product.name.includes('E-Series')
        ) {
          for (let component of sashColorTab.component) {
            let group = new AttributeOptionGroup(component.name);
            for (let color of component.color) {
              group.options.push(
                new AttributeOption({
                  title: color.name,
                  isSelected: color.selected,
                  productSettingChanges: [
                    new ProductSettingSetValue(
                      this._SashColorExterior,
                      component.name + '; color=' + color.name
                    ),
                  ],
                  image: isNullOrWhitespace(color.swatch)
                    ? imageHelpers.emptySwatchUrl
                    : imageHelpers.exteriorImageRootPath + color.swatch,
                  gtmItemHeader: component.name,
                  gtmItemDetail: color.name,
                  colorRgb: color.rgb,
                  imageSide: RenoworksProductSide.Exterior,
                })
              );
            }

            if (group.options.length > this.pageSize) {
              group.pageSize = this.pageSize;
            }

            vm.groups.push(group);
          }
        }

        if (vm.groups.length > 0) {
          attributes.push(vm);
        }
      }
    }
  }
  //SQ-NOSCAN-END

  _buildExteriorTrimProfileAttribute(renoworksResult, imageHelpers, attributes) {
    let tab = singleOrDefault(
      renoworksResult.exteriorResult.product.tab,
      (_) => _.name === RenoworksKeys.ExteriorTrimProfile.name
    );
    if (tab != null) {
      let vm = new SwatchAttributeViewModel(RenoworksKeys.ExteriorTrimProfile.name);

      for (let component of tab.component) {
        vm.options.push(
          new AttributeOption({
            title: component.name,
            isSelected: component.selected,
            productSettingChanges: [new ProductSettingSetValue(this._ExteriorTrim, component.name)],
            image: imageHelpers.exteriorImageRootPath + component.sampleImage,
            gtmItemHeader: 'Exterior',
            gtmItemDetail: component.name,
            imageSide: RenoworksProductSide.Exterior,
          })
        );
      }

      if (vm.options.length > this.pageSize) {
        vm.pageSize = this.pageSize;
      }

      vm.description = 'Exterior Trim Profile';

      attributes.push(vm);
    }
  }
  _buildProfileStyleAttribute(renoworksResult, imageHelpers, attributes) {
    let tab = singleOrDefault(
      renoworksResult.interiorResult.product.tab,
      (_) => _.name === RenoworksKeys.ProfileStyle.name
    );

    if (tab != null) {
      let vm = new SwatchAttributeViewModel(RenoworksKeys.ProfileStyle.name);

      for (let component of tab.component) {
        vm.options.push(
          new AttributeOption({
            title: component.name,
            isSelected: component.selected,
            productSettingChanges: [new ProductSettingSetValue(this._ProfileStyle, component.name)],
            image: imageHelpers.interiorImageRootPath + component.sampleImage,
            gtmItemHeader: 'Profile Style',
            gtmItemDetail: component.name,
            imageSide: RenoworksProductSide.Interior,
          })
        );
      }

      vm.description = 'Profile Style';

      attributes.push(vm);
    }
  }
  _buildExteriorTrimColorAttribute(renoworksResult, imageHelpers, attributes) {
    let exteriorTrimProfile = singleOrDefault(
      renoworksResult.exteriorResult.product.tab,
      (_) => _.name === RenoworksKeys.ExteriorTrimProfile.name
    );
    if (exteriorTrimProfile === null) {
      return;
    }

    let selectedExteriorTrimProfile = singleOrDefault(
      exteriorTrimProfile.component,
      (_) => _.selected
    );
    if (selectedExteriorTrimProfile === null) {
      return;
    }

    if (
      selectedExteriorTrimProfile.color &&
      selectedExteriorTrimProfile.color.length > 0 &&
      selectedExteriorTrimProfile.name != 'None'
    ) {
      let selectedControlOption = new AttributeOption({
        title: selectedExteriorTrimProfile.name,
        isSelected: true,
        image: imageHelpers.exteriorImageRootPath + selectedExteriorTrimProfile.sampleImage,
      });

      let vm = new DependentSwatchAttributeViewModel(selectedControlOption);
      if (selectedExteriorTrimProfile.color.length > 10) {
        vm.pageSize = 10;
      }

      for (let color of selectedExteriorTrimProfile.color) {
        vm.options.push(
          new AttributeOption({
            title: color.name,
            isSelected: color.selected,
            productSettingChanges: [
              new ProductSettingSetValue(
                this._ExteriorTrimColor,
                selectedExteriorTrimProfile.name + '; color=' + color.name
              ),
            ],
            image: isNullOrWhitespace(color.swatch)
              ? imageHelpers.emptySwatchUrl
              : imageHelpers.exteriorImageRootPath + color.swatch,
            gtmItemHeader: selectedExteriorTrimProfile.name,
            gtmItemDetail: color.name,
            colorRgb: color.rgb,
            imageSide: RenoworksProductSide.Exterior,
          })
        );
      }

      vm.description = 'Exterior Trim Color';

      attributes.push(vm);
    }
  }

  _buildGlassAttribute(renoworksResult, imageHelpers, attributes) {
    // TODO: Create Radio button display
    let tab = singleOrDefault(
      renoworksResult.interiorResult.product.tab,
      (_) => _.name === RenoworksKeys.GlassOptions.name
    );
    if (tab != null) {
      let vm = new RadioAttributeViewModel(RenoworksKeys.GlassOptions.name);

      for (let component of tab.component) {
        vm.options.push(
          new AttributeOption({
            title: component.name,
            isSelected: component.selected,
            productSettingChanges: [new ProductSettingSetValue(this._GlassOptions, component.name)],
            image: imageHelpers.interiorImageRootPath + component.swatch,
            gtmItemHeader: 'Glass',
            gtmItemDetail: component.name,
            desc: component.desc,
          })
        );
      }

      let blindsBetweenGlass =
        renoworksResult.productSettingValues.get(this._BlindsBetweenGlass) || 'None; color=White';
      if (blindsBetweenGlass !== 'None; color=White') {
        vm.note =
          'The only glass option available on products with blinds-between-the-glass is Low-E4&#174; Glass.';
      }

      attributes.push(vm);
    }
  }

  _buildOperationAttribute(renoworksResult, imageHelpers, attributes) {
    let tab = singleOrDefault(
      renoworksResult.interiorResult.product.tab,
      (_) => _.name === RenoworksKeys.Operation.name
    );
    if (tab != null) {
      let vm = new SwatchAttributeViewModel(RenoworksKeys.Operation.name);

      for (let component of tab.component) {
        vm.options.push(
          new AttributeOption({
            title: component.name,
            isSelected: component.selected,
            productSettingChanges: [new ProductSettingSetValue(this._Operation, component.name)],
            image: imageHelpers.interiorImageRootPath + component.swatch,
            gtmItemHeader: tab.name,
            gtmItemDetail: component.name,
          })
        );
      }

      if (vm.options.length > this.pageSize) {
        vm.pageSize = this.pageSize;
      }

      attributes.push(vm);
    }
  }

  _buildShapeAttribute(renoworksResult, imageHelpers, attributes) {
    let tab = singleOrDefault(
      renoworksResult.interiorResult.product.tab,
      (_) => _.name === RenoworksKeys.Shape.name
    );
    if (tab != null) {
      let vm = new SwatchAttributeViewModel(RenoworksKeys.Shape.name);

      for (let component of tab.component) {
        vm.options.push(
          new AttributeOption({
            title: component.name,
            isSelected: component.selected,
            productSettingChanges: [new ProductSettingSetValue(this._Shape, component.name)],
            image: imageHelpers.interiorImageRootPath + component.swatch,
            gtmItemHeader: tab.name,
            gtmItemDetail: component.name,
          })
        );
      }

      if (vm.options.length > this.pageSize) {
        vm.pageSize = this.pageSize;
      }

      attributes.push(vm);
    }
  }
}
