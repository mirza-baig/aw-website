// Hide sizing for Bay & Bow Windows
let BayBowSizingRulesProducts = [
  'aw_bay_400casement',
  'aw_bow_400casement',
  'aw_bay_400doublehung_tw',
  'aw_bay_400doublehung_ww',
];

class RenoworksKey {
  constructor(name, usage, location) {
    this._name = name;
    this._usage = usage;
    this._location = location;
  }

  get name() {
    return this._name;
  }

  get usage() {
    return this._usage;
  }

  get location() {
    return this._location;
  }
}

class RenoworksChildKey {
  constructor(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }
}

export class RenoworksProductSide {
  static Interior = 1;
  static Exterior = 2;
  static Both = 3;
}

export class RenoworksKeyUsage {
  static ProductOptions = 1;
  static Image = 2;
  static Both = 3;
}

export class RenoworksKeyLocation {
  static Settings = 1;
  static QueryString = 2;
}

export class RenoworksChildKeys {
  static Color = new RenoworksChildKey('color');
  static Cols = new RenoworksChildKey('cols');
  static GrilleSpacing = new RenoworksChildKey('grilleSpacing');
  static GrilleWidth = new RenoworksChildKey('grilleWidth');
  static Rows = new RenoworksChildKey('rows');
}

export class RenoworksKeys {
  static BlindsBetweenGlass = new RenoworksKey(
    'Blinds Between Glass',
    RenoworksKeyUsage.Both,
    RenoworksKeyLocation.Settings
  );
  static BottomRailHeight = new RenoworksKey(
    'Bottom Rail Height',
    RenoworksKeyUsage.Both,
    RenoworksKeyLocation.Settings
  );
  static Configuration = new RenoworksKey(
    'Configuration',
    RenoworksKeyUsage.Both,
    RenoworksKeyLocation.Settings
  );
  static ExteriorTrimProfile = new RenoworksKey(
    'Exterior Trim Profile',
    RenoworksKeyUsage.Both,
    RenoworksKeyLocation.Settings
  );
  static FrameColor = new RenoworksKey(
    'Frame Color',
    RenoworksKeyUsage.Both,
    RenoworksKeyLocation.Settings
  );
  static FrameStain = new RenoworksKey(
    'Frame Stain',
    RenoworksKeyUsage.Both,
    RenoworksKeyLocation.Settings
  );
  static InteriorStainPaint = new RenoworksKey(
    'Interior Stain and Paint',
    RenoworksKeyUsage.Both,
    RenoworksKeyLocation.Settings
  );
  static Glass = new RenoworksKey('Glass', RenoworksKeyUsage.Both, RenoworksKeyLocation.Settings);
  static GlassOptions = new RenoworksKey(
    'Glass Options',
    RenoworksKeyUsage.Both,
    RenoworksKeyLocation.Settings
  );
  static ProfileStyle = new RenoworksKey(
    'Profile Style',
    RenoworksKeyUsage.Both,
    RenoworksKeyLocation.Settings
  );
  static GrilleStyle = new RenoworksKey(
    'Grille Style',
    RenoworksKeyUsage.Both,
    RenoworksKeyLocation.Settings
  );
  static GrilleType = new RenoworksKey(
    'Grille Type',
    RenoworksKeyUsage.Both,
    RenoworksKeyLocation.Settings
  );
  static HardwareOptions = new RenoworksKey(
    'Hardware Options',
    RenoworksKeyUsage.Both,
    RenoworksKeyLocation.Settings
  );
  static Manufacturer = new RenoworksKey(
    'Manufacturer',
    RenoworksKeyUsage.Both,
    RenoworksKeyLocation.Settings
  );
  static HandleStyle = new RenoworksKey(
    'Handle Style',
    RenoworksKeyUsage.Both,
    RenoworksKeyLocation.Settings
  );
  static PlateStyle = new RenoworksKey(
    'Plate Style',
    RenoworksKeyUsage.Both,
    RenoworksKeyLocation.Settings
  );
  static Finish = new RenoworksKey('Finish', RenoworksKeyUsage.Both, RenoworksKeyLocation.Settings);
  static Height = new RenoworksKey('Height', RenoworksKeyUsage.Both, RenoworksKeyLocation.Settings);
  static HeightInches = new RenoworksKey(
    'hgtIn',
    RenoworksKeyUsage.Image,
    RenoworksKeyLocation.QueryString
  );
  static OptionalHardware = new RenoworksKey(
    'Optional Hardware',
    RenoworksKeyUsage.Both,
    RenoworksKeyLocation.Settings
  );
  static Operation = new RenoworksKey(
    'Operation',
    RenoworksKeyUsage.Both,
    RenoworksKeyLocation.Settings
  );
  static PanelStyle = new RenoworksKey(
    'Panel Style',
    RenoworksKeyUsage.Both,
    RenoworksKeyLocation.Settings
  );
  static RailAndStileWidth = new RenoworksKey(
    'Rail and Stile Width',
    RenoworksKeyUsage.Both,
    RenoworksKeyLocation.Settings
  );
  static SashColor = new RenoworksKey(
    'Sash Color',
    RenoworksKeyUsage.Both,
    RenoworksKeyLocation.Settings
  );
  static SideliteStyle = new RenoworksKey(
    'Sidelite Style',
    RenoworksKeyUsage.Both,
    RenoworksKeyLocation.Settings
  );
  static Screen = new RenoworksKey('Screen', RenoworksKeyUsage.Both, RenoworksKeyLocation.Settings);
  static Shape = new RenoworksKey('Shape', RenoworksKeyUsage.Both, RenoworksKeyLocation.Settings);
  static Width = new RenoworksKey('Width', RenoworksKeyUsage.Both, RenoworksKeyLocation.Settings);
  static WidthInches = new RenoworksKey(
    'widIn',
    RenoworksKeyUsage.Image,
    RenoworksKeyLocation.QueryString
  );
}

export class RenoworksClient {
  constructor(productKey, apiHost, prefix) {
    this._productKey = productKey;
    this._apiHost = apiHost;
    this._prefix = prefix;
    this._interiorRwd = prefix + 'interior/' + productKey + '_INT.rwd';
    this._exteriorRwd = prefix + 'exterior/' + productKey + '_EXT.rwd';
  }

  get productKey() {
    return this._productKey;
  }

  // TODO: Put proxy back
  async getProductOptions(productSide, settings) {
    let rwd = productSide === RenoworksProductSide.Interior ? this._interiorRwd : this._exteriorRwd;
    let url =
      this._apiHost +
      '/_rwapi/?function=ProductOptions&mode=json&rwd=' +
      rwd +
      '&settings=' +
      settings;

    // TODO: Handle errors on network and renoworks?
    const response = await fetch(url, { method: 'GET' });

    const body = await response.text();

    if (body.startsWith('<error>')) {
      throw new Error(body.replace('<error>', '').replace('</error>', ''));
    } else {
      let json = JSON.parse(body);
      return json;
    }
  }

  getRenoworksImageUrl(productSide, settings, queryString, renoworksKey) {
    let rwd = productSide === RenoworksProductSide.Interior ? this._interiorRwd : this._exteriorRwd;
    // For the Sidelite Style we want to remove the color selection
    // this reqular experession will remove string after the 3 digit sidelite id
    const regex = /(.*Sidelite(?: |\+)Style(?:=|%3D)[0-9]{1,3})([^|]*)(.*)/g;
    let settingsValue = settings.replace(regex, '$1$3');

    // For Bay and Bow we have a workaround to get the images to display
    // Need to remove the grilleWidth and grilleSpacing attributes settings
    if (BayBowSizingRulesProducts.indexOf(renoworksKey) > -1) {
      const regex2 = /(\+grilleWidth)(.*?)(?=\+)/g;
      settingsValue = settingsValue.replace(regex2, '');

      const regex3 = /(\+grilleSpacing)(.*?)(\%22)/g;
      settingsValue = settingsValue.replace(regex3, '');
    }

    return (
      this._apiHost +
      '/_rwapi/?function=ProductRender&mode=image&rwd=' +
      rwd +
      '&settings=' +
      settingsValue +
      '&' +
      queryString
    );
  }
}
