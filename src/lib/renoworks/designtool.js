import { decodeHtml } from 'lib/utils/string-utils/decode-html';
import { encodeUrl } from 'lib/utils/url-utils/encode-url';

import {
  RenoworksClient,
  RenoworksKeyLocation,
  RenoworksKeyUsage,
  RenoworksProductSide,
} from './renoworks';

class RenoworksResult {
  constructor(
    interiorResult,
    interiorImageUrl,
    exteriorResult,
    exteriorImageUrl,
    productSettingValues
  ) {
    this._interiorResult = interiorResult;
    this._interiorImageUrl = interiorImageUrl;
    this._exteriorResult = exteriorResult;
    this._exteriorImageUrl = exteriorImageUrl;
    this._productSettingValues = productSettingValues;
  }

  get interiorResult() {
    return this._interiorResult;
  }

  get interiorImageUrl() {
    return this._interiorImageUrl;
  }

  get exteriorResult() {
    return this._exteriorResult;
  }

  get exteriorImageUrl() {
    return this._exteriorImageUrl;
  }

  get productSettingValues() {
    return this._productSettingValues;
  }
}

export class SummaryHelpers {
  static ValueFromValue = (_) => _;
  static ValueFromValueWithColor = (_) => _.replace('; color=', ', ');
  static NameFromValueWithNameAndValue = (_) => _.split('; color=')[0];
  static ExteriorFrameColor = (_) => _.split('; color=')[0].replace(' Window', '');
  static ValueFromValueWithNameAndValue = (_) =>
    _.indexOf('; color=') > -1 ? _.split('; color=')[1] : _;
}

export class ProductSettingSetValue {
  constructor(key, value) {
    this._key = key;
    this._value = value;
  }

  apply(productSettingValues) {
    productSettingValues.set(this._key, this._value);
  }
}

export class ProductSettingRemoveValue {
  constructor(key) {
    this._key = key;
  }

  apply(productSettingValues) {
    productSettingValues.delete(this._key);
  }
}

export class ProductSettingValues {
  constructor(queryString, productSettings) {
    this._map = new Map();
    this._loadFromQueryString(queryString, productSettings);
    this._removeChildrenOfNone(productSettings);
  }

  get(key) {
    return this._map.get(key);
  }

  set(key, value) {
    return this._map.set(key, value);
  }

  has(key) {
    return this._map.has(key);
  }

  delete(key) {
    return this._map.delete(key);
  }

  keys() {
    return this._map.keys();
  }

  // eslint-disable-next-line
  toQueryString(side) {
    let result = {};
    for (let key of this.keys()) {
      result[key.queryStringKey] = this.get(key);
    }
    return result;
  }

  toURLQueryString() {
    let result = '';
    for (let key of this.keys()) {
      if (result != '') {
        result += '&';
      }
      let keyValue = encodeURIComponent(this.get(key)) ?? -1;

      result += `${key.queryStringKey}=${keyValue}`;
    }
    return result?.trimStart('&');
  }

  toRenoworks(side, usage) {
    let queryString = [];
    let settings = [];

    for (let key of this.keys()) {
      if (
        !(key.renoworksKey.usage === usage || key.renoworksKey.usage === RenoworksKeyUsage.Both)
      ) {
        continue;
      }

      if (key.renoworksKey.location === RenoworksKeyLocation.Settings) {
        if (key.isChildKey || (key.side !== RenoworksProductSide.Both && key.side !== side)) {
          continue;
        }

        if (key.childKeys != null) {
          let childValues = [];
          for (let childKey of key.childKeys) {
            if (this.has(childKey)) {
              childValues.push(childKey.renoworksKey.name + '=' + this.get(childKey));
            }
          }

          if (childValues.length === 0) {
            settings.push(encodeUrl(key.renoworksKey.name + '=' + this.get(key)));
          } else {
            let childString = childValues.join('; ');
            settings.push(
              encodeUrl(key.renoworksKey.name + '=' + this.get(key) + '; ' + childString)
            );
          }
        } else {
          settings.push(encodeUrl(key.renoworksKey.name + '=' + this.get(key)));
        }
      }

      if (key.renoworksKey.location === RenoworksKeyLocation.QueryString) {
        if (key.isChildKey) {
          throw new Error('Child keys are not currently supported in the query string.');
        }

        if (key.childKeys != null) {
          throw new Error('Child keys are not currently supported in the query string.');
        } else {
          queryString.push(key.renoworksKey.name + '=' + encodeUrl(this.get(key)));
        }
      }
    }

    return { settings: settings.join('|'), queryString: queryString.join('&') };
  }

  clone() {
    let clone = new ProductSettingValues({}, []);
    for (let key of this.keys()) {
      clone.set(key, this.get(key));
    }
    return clone;
  }

  _loadFromQueryString(queryString, productSettings) {
    for (let productSetting of productSettings) {
      let queryStringKey = productSetting.queryStringKey;

      if (queryString[queryStringKey]) {
        this.set(productSetting, queryString[queryStringKey]);
      }
    }
  }

  _removeChildrenOfNone(productSettings) {
    // If a "parent" setting is "None", then remove any child settings
    for (let productSetting of productSettings) {
      if (productSetting.childKeys !== null && this.get(productSetting) === 'None') {
        for (let child of productSetting.childKeys) {
          this.delete(child);
        }
      }
    }
  }
}

export class ProductSetting {
  constructor({
    side,
    queryStringKey,
    renoworksKey,
    summaryName = null,
    summaryFormatter = SummaryHelpers.ValueFromValue,
    isChildKey = false,
    childKeys = null,
  } = {}) {
    this._side = side;
    this._queryStringKey = queryStringKey;
    this._renoworksKey = renoworksKey;
    this._isChildKey = isChildKey;
    this._childKeys = childKeys;
    this._summaryFormatter = summaryFormatter;

    this._includeInSummary = summaryName !== null;

    if (typeof summaryName === 'string') {
      this._summaryName = () => summaryName;
    } else {
      this._summaryName = summaryName;
    }
  }

  get queryStringKey() {
    return this._queryStringKey;
  }

  get renoworksKey() {
    return this._renoworksKey;
  }

  get side() {
    return this._side;
  }

  get summaryName() {
    return this._summaryName;
  }

  get summaryFormatter() {
    return this._summaryFormatter;
  }

  get childKeys() {
    return this._childKeys;
  }

  get isChildKey() {
    return this._isChildKey;
  }

  set isChildKey(value) {
    this._isChildKey = value;
  }

  get includeInSummary() {
    return this._includeInSummary;
  }

  set includeInSummary(value) {
    this._includeInSummary = value;
  }
}

class BrandProgressBarItem {
  constructor(title, startIndex) {
    this._title = title;
    this._startIndex = startIndex;
  }

  get title() {
    return this._title;
  }

  get startIndex() {
    return this._startIndex;
  }
}

class ProgressBarItem {
  constructor(title, startIndex) {
    this._title = title;
    this._startIndex = startIndex;
  }

  get title() {
    return this._title;
  }

  get startIndex() {
    return this._startIndex;
  }
}

export class ViewModel {
  constructor() {
    this._attributes = [];
    this._progressBar = [];
    this._brandProgressBar = [];
  }

  get attributes() {
    return this._attributes;
  }

  get exteriorImage() {
    return this._exteriorImage;
  }

  set exteriorImage(value) {
    this._exteriorImage = value;
  }

  get interiorImage() {
    return this._interiorImage;
  }

  set interiorImage(value) {
    this._interiorImage = value;
  }

  get brandProgressBar() {
    return this._brandProgressBar;
  }

  get progressBar() {
    return this._progressBar;
  }

  get renoworksResult() {
    return this._renoworksResult;
  }

  set renoworksResult(value) {
    this._renoworksResult = value;
  }

  get selectedOptions() {
    return this._selectedOptions;
  }

  set selectedOptions(value) {
    this._selectedOptions = value;
  }
}

export class ViewModelBuilderBase {
  constructor(product, apiConfig) {
    if (!product || !apiConfig) {
      return;
    }

    this._product = product;

    this._renoworksClient = new RenoworksClient(
      product.renoworksKey,
      apiConfig.host,
      apiConfig.prefix
    );
    this._productSettings = new Set();

    this._viewModel = new ViewModel();
  }

  get viewModel() {
    return this._viewModel;
  }

  get product() {
    return this._product;
  }

  get renoworksClient() {
    return this._renoworksClient;
  }

  get productSettings() {
    return this._productSettings;
  }

  get supportedSides() {
    throw new Error('Override the supportedSides property.');
  }

  get moduleData() {
    return this._moduleData;
  }

  // get relatedProduct() {
  //   return this._relatedProduct;
  // }

  addBrandProgressBarStep(title, attributes) {
    let startIndex = this._viewModel.attributes.length;

    if (Array.isArray(attributes)) {
      for (let i = 0; i < attributes.length; i++) {
        this._viewModel.attributes.push(attributes[i]);
        this._viewModel.brandProgressBar.push(
          new BrandProgressBarItem(attributes[i].description, startIndex + i)
        );
      }
    } else {
      this._viewModel.attributes.push(attributes);
    }

    this._viewModel.progressBar.push(new ProgressBarItem(title, startIndex));
  }

  addProgressBarStep(title, attributes) {
    let startIndex = this._viewModel.attributes.length;

    if (Array.isArray(attributes)) {
      for (let i = 0; i < attributes.length; i++) {
        this._viewModel.attributes.push(attributes[i]);
      }
    } else {
      this._viewModel.attributes.push(attributes);
    }

    this._viewModel.progressBar.push(new ProgressBarItem(title, startIndex));
  }

  // eslint-disable-next-line
  beforeRenoworksCall(productSettingValues) {

  }

  async buildViewModelForQueryString(queryString) {
    this._viewModel = new ViewModel();

    let productSettingValues = new ProductSettingValues(queryString, this.productSettings);

    this.beforeRenoworksCall(productSettingValues);

    let renoworksResult = await this._getProductOptionsForValues(productSettingValues);

    this._viewModel.renoworksResult = renoworksResult;

    if (
      this.supportedSides === RenoworksProductSide.Both ||
      this.supportedSides === RenoworksProductSide.Interior
    ) {
      this._viewModel.interiorImage = {
        src: renoworksResult.interiorImageUrl,
        alt: renoworksResult.interiorResult.product.name,
      };
    }
    if (
      this.supportedSides === RenoworksProductSide.Both ||
      this.supportedSides === RenoworksProductSide.Exterior
    ) {
      this._viewModel.exteriorImage = {
        src: renoworksResult.exteriorImageUrl,
        alt: renoworksResult.exteriorResult.product.name,
      };
    }

    this.buildAttributesForRenoworksResult(renoworksResult);

    // This should be just in the summary, but is needed for the print button that is always visible
    this._viewModel.selectedOptions = this.buildSelectedOptionsForProductSettingValues(
      renoworksResult.productSettingValues
    );

    // Add the Summary
    let summary = this.buildSummary();
    if (summary) {
      this.addProgressBarStep('Summary', summary);
    }

    return this._viewModel;
  }

  buildSummary() {
    let summary = new SummaryViewModel(
      this.product,
      null,
      this._viewModel.interiorImage,
      this._viewModel.exteriorImage,
      this._viewModel.selectedOptions,
      DesignToolStepName.Summary
    );
    return summary;
  }

  buildSelectedOptionsForProductSettingValues(productSettingValues) {
    let result = [];

    for (let productSetting of this.productSettings) {
      if (productSetting.includeInSummary && productSettingValues.has(productSetting)) {
        let title = productSetting.summaryName(productSettingValues.get(productSetting));
        let value = productSetting.summaryFormatter(productSettingValues.get(productSetting));
        result.push({ title, value });
      }
    }

    return result;
  }

  get _exteriorProductSettings() {
    let result = [];
    for (let productSetting of this.productSettings) {
      if (
        productSetting.side === RenoworksProductSide.Exterior ||
        productSetting.side === RenoworksProductSide.Both
      ) {
        result.push(productSetting);
      }
    }
    return result;
  }

  get _interiorProductSettings() {
    let result = [];
    for (let productSetting of this.productSettings) {
      if (
        productSetting.side === RenoworksProductSide.Interior ||
        productSetting.side === RenoworksProductSide.Both
      ) {
        result.push(productSetting);
      }
    }
    return result;
  }

  async _getProductOptionsForValues(productSettingValues) {
    let interiorResult, interiorImageUrl, exteriorResult, exteriorImageUrl;

    if (this.supportedSides === RenoworksProductSide.Interior) {
      interiorResult = await this._getRenoworksResponse(
        RenoworksProductSide.Interior,
        productSettingValues
      );
      this._decodeHtmlPropertiesInRenoworksResponse(interiorResult);
      this._updateProductSettingValuesFromRenoworksResult(
        productSettingValues,
        interiorResult,
        this._interiorProductSettings
      );
      interiorImageUrl = this._getRenoworksImageUrl(
        RenoworksProductSide.Interior,
        productSettingValues
      );
    } else if (this.supportedSides === RenoworksProductSide.Exterior) {
      exteriorResult = await this._getRenoworksResponse(
        RenoworksProductSide.Exterior,
        productSettingValues
      );
      this._decodeHtmlPropertiesInRenoworksResponse(exteriorResult);
      this._updateProductSettingValuesFromRenoworksResult(
        productSettingValues,
        exteriorResult,
        this._exteriorProductSettings
      );
      exteriorImageUrl = this._getRenoworksImageUrl(
        RenoworksProductSide.Exterior,
        productSettingValues
      );
    } else {
      [interiorResult, exteriorResult] = await Promise.all([
        this._getRenoworksResponse(RenoworksProductSide.Interior, productSettingValues),
        this._getRenoworksResponse(RenoworksProductSide.Exterior, productSettingValues),
      ]);
      this._decodeHtmlPropertiesInRenoworksResponse(interiorResult);
      this._decodeHtmlPropertiesInRenoworksResponse(exteriorResult);
      this._updateProductSettingValuesFromRenoworksResult(
        productSettingValues,
        interiorResult,
        this._interiorProductSettings
      );
      this._updateProductSettingValuesFromRenoworksResult(
        productSettingValues,
        exteriorResult,
        this._exteriorProductSettings
      );
      interiorImageUrl = this._getRenoworksImageUrl(
        RenoworksProductSide.Interior,
        productSettingValues
      );
      exteriorImageUrl = this._getRenoworksImageUrl(
        RenoworksProductSide.Exterior,
        productSettingValues
      );
    }
    return new RenoworksResult(
      interiorResult,
      interiorImageUrl,
      exteriorResult,
      exteriorImageUrl,
      productSettingValues
    );
  }

  async _getRenoworksResponse(productSide, productSettingValues) {
    let params = productSettingValues.toRenoworks(productSide, RenoworksKeyUsage.ProductOptions);
    let response = await this.renoworksClient.getProductOptions(productSide, params.settings);
    return response;
  }

  _getRenoworksImageUrl(productSide, productSettingValues) {
    let params = productSettingValues.toRenoworks(productSide, RenoworksKeyUsage.Image);
    let renoworksKey = this.product.renoworksKey;
    let imageUrl = this.renoworksClient.getRenoworksImageUrl(
      productSide,
      params.settings,
      params.queryString,
      renoworksKey
    );
    return imageUrl;
  }

  _decodeHtmlPropertiesInRenoworksResponse(renoworksResponse) {
    if (renoworksResponse.product.name) {
      renoworksResponse.product.name = decodeHtml(renoworksResponse.product.name);
    }
    if (renoworksResponse.product.notes) {
      renoworksResponse.product.notes = decodeHtml(renoworksResponse.product.notes);
    }

    if (!renoworksResponse.product.tab) {
      return;
    }

    for (let tab of renoworksResponse.product.tab) {
      if (tab.name) {
        tab.name = decodeHtml(tab.name);
      }

      if (!tab.component) {
        continue;
      }

      for (let component of tab.component) {
        if (component.name) {
          component.name = decodeHtml(component.name);
        }
        if (component.optionName) {
          component.optionName = decodeHtml(component.optionName);
        }
        if (component.desc) {
          component.desc = decodeHtml(component.desc);
        }

        if (component.color) {
          for (let color of component.color) {
            if (color.name) {
              color.name = decodeHtml(color.name);
            }
          }
        }

        if (component.grilleSpacing) {
          for (let grilleSpacing of component.grilleSpacing) {
            if (grilleSpacing.name) {
              grilleSpacing.name = decodeHtml(grilleSpacing.name);
            }
          }
        }

        if (component.grilleWidth) {
          for (let grilleWidth of component.grilleWidth) {
            if (grilleWidth.name) {
              grilleWidth.name = decodeHtml(grilleWidth.name);
            }
          }
        }
      }
    }
  }

  _updateProductSettingValuesFromRenoworksResult(productSettingValues, result, productSettings) {
    let decodedSettings = decodeHtml(result.settings);
    let returnedSettings = decodedSettings.split('|');
    for (let returnedSetting of returnedSettings) {
      let settingParts = returnedSetting.split('=');
      let settingName = settingParts.shift();
      let settingValue = settingParts.join('=');

      let productSetting = productSettings.singleOrDefault(
        (productSetting) => productSetting.renoworksKey.name === settingName
      );
      if (productSetting !== null) {
        if (productSetting.childKeys !== null) {
          let valueParts = settingValue.split(';');
          productSettingValues.set(productSetting, valueParts[0]);
          if (valueParts.length > 1) {
            valueParts.shift();
            for (let value of valueParts) {
              let childParts = value.trim().split('=');
              let childName = childParts.shift();
              let childValue = childParts.join('=');
              let childKey = productSetting.childKeys.singleOrDefault(
                (_) => _.renoworksKey.name === childName
              );
              if (childKey !== null) {
                productSettingValues.set(childKey, childValue);
              }
            }
          }
        } else {
          productSettingValues.set(productSetting, settingValue);
        }
      }
    }
  }
}

export class AttributeOptionGroup {
  constructor(title) {
    this._options = [];
    this._title = title;
    this._note = false;
    this._pageSize = 0;
  }

  get title() {
    return this._title;
  }

  get options() {
    return this._options;
  }

  get note() {
    return this._note;
  }

  set note(note) {
    this._note = note;
  }

  get pageSize() {
    return this._pageSize;
  }

  set pageSize(pageSize) {
    this._pageSize = pageSize > 0 ? pageSize : 0;
  }
}

export class SelectableAttributeOptionGroup extends AttributeOptionGroup {
  constructor({
    title,
    isSelected,
    productSettingChanges,
    image = null,
    gtmItemHeader = null,
    gtmItemDetail = null,
    imageSide = RenoworksProductSide.Both,
  } = {}) {
    super(title);

    this._isSelected = isSelected;
    this._productSettingChanges = productSettingChanges;
    this._image = image;
    this._gtmItemHeader = gtmItemHeader;
    this._gtmItemDetail = gtmItemDetail;
    this._imageSide = imageSide;
    this._isClicked = false;
  }

  get isSelected() {
    return this._isSelected;
  }

  get image() {
    return this._image;
  }

  get productSettingChanges() {
    return this._productSettingChanges;
  }

  get gtmItemHeader() {
    return this._gtmItemHeader;
  }

  get gtmItemDetail() {
    return this._gtmItemDetail;
  }

  get imageSide() {
    return this._imageSide;
  }

  get isClicked() {
    return this._isClicked;
  }

  set isClicked(value) {
    this._isClicked = value;
  }
}

export class AttributeOption {
  constructor({
    title,
    isSelected,
    productSettingChanges,
    image = null,
    gtmItemHeader = null,
    gtmItemDetail = null,
    desc = null,
    colorRgb = null,
    imageSide = RenoworksProductSide.Both,
  } = {}) {
    this._title = title;
    this._isSelected = isSelected;
    this._productSettingChanges = productSettingChanges;
    this._image = image;
    this._gtmItemHeader = gtmItemHeader;
    this._gtmItemDetail = gtmItemDetail;
    this._desc = desc;
    this._colorRgb = colorRgb;
    this._imageSide = imageSide;
    this._isClicked = false;
  }

  get title() {
    return this._title;
  }

  get isSelected() {
    return this._isSelected;
  }

  get productSettingChanges() {
    return this._productSettingChanges;
  }

  get image() {
    return this._image;
  }

  get gtmItemHeader() {
    return this._gtmItemHeader;
  }

  get gtmItemDetail() {
    return this._gtmItemDetail;
  }

  get desc() {
    return this._desc;
  }

  get colorRgb() {
    return this._colorRgb;
  }

  get imageSide() {
    return this._imageSide;
  }

  get isClicked() {
    return this._isClicked;
  }

  set isClicked(value) {
    this._isClicked = value;
  }
}

export class AttributeViewModelBase {
  constructor(component, renoworksKeyName, productSide) {
    this._component = component;
    this._renoworksKeyName = renoworksKeyName;
    this._productSide = productSide;
    this._description = false;
    this._note = false;
    this._tertiaryLinks = [];
  }

  get description() {
    return this._description;
  }

  set description(description) {
    this._description = description;
  }

  get note() {
    return this._note;
  }

  set note(note) {
    this._note = note;
  }

  get tertiaryLinks() {
    return this._tertiaryLinks;
  }

  get component() {
    return this._component;
  }

  get renoworksKeyName() {
    return this._renoworksKeyName;
  }

  get productSide() {
    return this._productSide;
  }

  get props() {
    return { viewModel: this };
  }
}

export class DescriptionAttributeViewModel extends AttributeViewModelBase {
  constructor(text, renoworksKeyName, productSide) {
    super('DescriptionAttribute', renoworksKeyName, productSide);
    this.description = text;
  }
}

export class TextAttributeViewModel extends AttributeViewModelBase {
  constructor(text, renoworksKeyName, productSide) {
    super('TextAttribute', renoworksKeyName, productSide);
    this.description = text;

    this._options = [];
  }

  get options() {
    return this._options;
  }
}

export class RadioAttributeViewModel extends AttributeViewModelBase {
  constructor(renoworksKeyName, productSide) {
    super('RadioAttribute', renoworksKeyName, productSide);

    this._options = [];
  }

  get options() {
    return this._options;
  }
}

export class SwatchAttributeViewModel extends AttributeViewModelBase {
  constructor(renoworksKeyName, productSide) {
    super('SwatchAttribute', renoworksKeyName, productSide);

    this._options = [];
    this._pageSize = 0;
  }

  get options() {
    return this._options;
  }

  get pageSize() {
    return this._pageSize;
  }

  set pageSize(pageSize) {
    this._pageSize = pageSize > 0 ? pageSize : 0;
  }
}

export class DependentSwatchAttributeViewModel extends AttributeViewModelBase {
  constructor(selectedControlOption, renoworksKeyName, productSide) {
    super('DependentSwatchAttribute', renoworksKeyName, productSide);

    this._options = [];
    this._pageSize = 0;
    this._selectedControlOption = selectedControlOption;
  }

  get options() {
    return this._options;
  }

  get pageSize() {
    return this._pageSize;
  }

  set pageSize(pageSize) {
    this._pageSize = pageSize > 0 ? pageSize : 0;
  }

  get selectedControlOption() {
    return this._selectedControlOption;
  }
}

export class SizingAttributeViewModel extends AttributeViewModelBase {
  constructor(renoworksKeyName, productSide) {
    super('SizingAttribute', renoworksKeyName, productSide);

    this._widths = [];
    this._heights = [];
  }

  get widths() {
    return this._widths;
  }

  get heights() {
    return this._heights;
  }
}

export class TabbedSwatchAttributeViewModel extends AttributeViewModelBase {
  constructor(renoworksKeyName, productSide) {
    super('TabbedSwatchAttribute', renoworksKeyName, productSide);

    this._groups = [];
  }

  get groups() {
    return this._groups;
  }
}

export class HardwareAttributeViewModel extends AttributeViewModelBase {
  constructor(renoworksKeyName, productSide) {
    super('HardwareAttribute', renoworksKeyName, productSide);

    this._groups = [];
    this._optional = [];
  }

  get groups() {
    return this._groups;
  }

  get optional() {
    return this._optional;
  }
}

export class BrandHardwareAttributeViewModel extends AttributeViewModelBase {
  constructor() {
    super('BrandHardwareAttribute');

    this._options = [];
  }

  get options() {
    return this._options;
  }
}

export class BrandHardwareFinishAttributeViewModel extends AttributeViewModelBase {
  constructor() {
    super('BrandHardwareFinishAttribute');

    this._options = [];
  }

  get options() {
    return this._options;
  }
}

export class SummaryViewModel extends AttributeViewModelBase {
  //constructor(product, relatedProduct, interiorImage, exteriorImage, selectedOptions, findADealer, requestAQuote, favoritesLink) {
  constructor(
    product,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    relatedProduct,
    interiorImage,
    exteriorImage,
    selectedOptions,
    renoworksKeyName,
    productSide
  ) {
    super('SummaryAttribute', renoworksKeyName, productSide);
    // this._findADealer = findADealer;
    // this._requestAQuote = requestAQuote;
    // this._favoritesLink = favoritesLink;
    this._selectedOptions = selectedOptions;
    this._product = product;
    //this._relatedProduct = relatedProduct;
    this._interiorImage = interiorImage;
    this._exteriorImage = exteriorImage;
  }

  get exteriorImage() {
    return this._exteriorImage;
  }

  get favoritesLink() {
    return this._favoritesLink;
  }

  get findADealer() {
    return this._findADealer;
  }

  get interiorImage() {
    return this._interiorImage;
  }

  get product() {
    return this._product;
  }

  // get relatedProduct() {
  //   return this._relatedProduct;
  // }

  get requestAQuote() {
    if (!this._requestAQuote) {
      return this._requestAQuote;
    }

    let selectionsKeyValue = this.selectedOptions.map(
      (option) => option.title + '=' + option.value
    );
    let selectionsJoined = selectionsKeyValue.join('|');
    let selectionsEncoded = encodeURIComponent(selectionsJoined);

    let seriesName = encodeURIComponent(
      this._product.series?.value?.text + ' ' + this._product.category?.value?.text
    );

    let requestAQuoteUrl =
      (this._requestAQuote?.value?.href || this._requestAQuote?.value?.url) +
      '?d={designUrl}&p=' +
      this._product.renoworksKey +
      '&sn=' +
      seriesName +
      '&s=' +
      selectionsEncoded +
      '&ii={interiorImageUrl}&ei={exteriorImageUrl}';

    return {
      value: {
        url: requestAQuoteUrl,
        href: requestAQuoteUrl,
        ...this._requestAQuote.value,
      },
    };
  }

  get selectedOptions() {
    return this._selectedOptions;
  }
}

export class DesignToolStepName {
  static Sizing = 'Sizing';
  static Summary = 'Summary';
}
