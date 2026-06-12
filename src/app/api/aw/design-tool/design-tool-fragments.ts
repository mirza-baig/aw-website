export const ImgFieldFragment = `
fragment ImgField on ImageField {
  title
  src
  height
  width
  alt
}
`;

export const LnkFieldFragment = `
fragment LnkField on LinkField {
  __typename
  text
  target
  url
  anchor
}
`;

export const ProductTypeFragment = `
fragment ProductType on LookupField {
  targetItem {
    ... on AW_ProductType {
      productTypeName {
        value
      }
      productTypeDescription {
        value
      }
      productTypeImage {
        alt
        height
        width
        src
      }
    }
  }
}
`;

export const OptionQueryResultFragment = `
fragment OptionQueryResult on Item {
  ... on AW_DesignToolOption {
    ctaText {
      value
    }
    optionHeading {
      value
    }
    optionImage {
      ...ImgField
    }
    optionIcon {
      ...ImgField
    }
    stepHeading {
      value
    }
    stepSubhead {
      value
    }
    stepCopy {
      value
    }
    helpCTAText {
      value
    }
    helpText {
      value
    }
  }
}
`;

export const OptionChildQueryResultFragment = `
fragment OptionChildQueryResult on Item {
  ... on AW_DesignToolOption {
    ctaText {
      value
    }
    optionHeading {
      value
    }
    optionImage {
      ...ImgField
    }
    optionIcon {
      ...ImgField
    }
    stepHeading {
      value
    }
    stepSubhead {
      value
    }
    stepCopy {
      value
    }
    helpCTAText {
      value
    }
    helpText {
      value
    }
    helpImage1 {
      ...ImgField
    }
    helpImage2 {
      ...ImgField
    }
    helpImage3 {
      ...ImgField
    }
    helpImage4 {
      ...ImgField
    }
    helpImage5 {
      ...ImgField
    }
    helpMobileImage1 {
      ...ImgField
    }
    helpMobileImage2 {
      ...ImgField
    }
    helpMobileImage3 {
      ...ImgField
    }
    helpMobileImage4 {
      ...ImgField
    }
    helpMobileImage5 {
      ...ImgField
    }
  }
}
`;

export const ProductItemQueryResultFragment = `
fragment ProductItemQueryResult on LookupField {
  targetItem {
    ... on AW_Product {
      productDetailPageLink {
        ...LnkField
      }
      findADealerLink {
        ...LnkField
      }
      productSeries {
        ...ProductType
      }
      productType {
        ...ProductType
      }
      productName {
        value
      }
      productId {
        value
      }
      renoworksKey {
        value
      }
      renoworksName {
        value
      }
      priceLevel {
        targetItem {
          ... on AW_PriceLevel {
            priceLevelText {
              value
            }
          }
        }
      }
      bazaarvoiceProductId {
        value
      }
    }
  }
}
`;

export const ProductConfigItemQueryResultFragment = `
  fragment ProductConfigItemQueryResult on LookupField {
    targetItem{
      ... on AW_ProductConfiguration {
        productDimensions{value}
      }
    }
  }
`;

export const ProductQueryResultFragment = `
fragment ProductQueryResult on Item {
    ... on AW_DesignToolProduct {
      product {
          ...ProductItemQueryResult
      }
	    bulletText1 {value}
      bulletText2 {value}
      bulletText3 {value}
      productImage1 {...ImgField}
      productImage2 {...ImgField}
      productImage3 {...ImgField}
      productImage4 {...ImgField}
      productImage5 {...ImgField}
      videoYouTubeId1 {value}
      videoYouTubeId2 {value}
      videoYouTubeId3 {value}
      videoYouTubeId4 {value}
      videoYouTubeId5 {value}
      summaryText{value}
      sizingText{value}
      customSizingText{value}
      disclaimerText{value}
      glassText{value}
      homeDepotBuyCTAText{value}
      homeDepotSpecialOrderCTAText{value}
      homeDepotSpecialOrderLightboxText{value}
      displayUniversalHandingLogo{value}
      designHeading{value}
      designSubhead{value}
      summaryHeading{value}
      summarySubhead{value}
      productConfiguration{...ProductConfigItemQueryResult}
      sizeChartsLink{...LnkField}
      customSizesLink{...LnkField}
      ctaText{value}
      relatedProduct{
        targetItem{
          id
        }
      }
      featureImage{...ImgField}
      featureText{value}
  	}
  }
`;

export const ProductChildQueryResultFragment = `
fragment ProductChildQueryResult on Item {
    ... on AW_DesignToolProduct {
      product {
          ...ProductItemQueryResult
      }
	    bulletText1 {value}
      bulletText2 {value}
      bulletText3 {value}
      productImage1 {...ImgField}
      productImage2 {...ImgField}
      productImage3 {...ImgField}
      productImage4 {...ImgField}
      productImage5 {...ImgField}
      videoYouTubeId1 {value}
      videoYouTubeId2 {value}
      videoYouTubeId3 {value}
      videoYouTubeId4 {value}
      videoYouTubeId5 {value}
      displayUniversalHandingLogo{value}
      designHeading{value}
      designSubhead{value}
      summaryHeading{value}
      summarySubhead{value}
      ctaText{value}
      featureImage{...ImgField}
      featureText{value}
  	}
  }
`;
