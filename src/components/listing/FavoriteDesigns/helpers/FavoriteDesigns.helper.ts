import { ButtonGroupProps } from 'helpers/ButtonGroup/ButtonGroup';
import { ImageToggleWrapperProps } from 'helpers/ImageToggleWrapper/ImageToggleWrapper';

import { DesignProps } from './FavoriteDesignsTypes.helper';

export const getImageToggleData = (props: DesignProps): ImageToggleWrapperProps => {
  return {
    fields: {
      primaryImage: {
        value: {
          src: props.interiorImage?.src,
          width: 387,
          height: 387,
        },
      },
      primaryImageMobile: {
        value: {
          src: props.interiorImage?.src,
          width: 387,
          height: 387,
        },
      },
      secondaryImage: {
        value: {
          src: props.exteriorImage?.src,
          width: 387,
          height: 387,
        },
      },
      secondaryImageMobile: {
        value: {
          src: props.exteriorImage?.src,
          width: 387,
          height: 387,
        },
      },
    },
  };
};

export const getButtonGroupData = (props: DesignProps): Partial<ButtonGroupProps> => {
  return {
    cta1: {
      variant: {
        name: '',
        id: '',
        url: '',
        fields: {
          Value: {
            value: 'primary',
          },
        },
      },
      field: {
        value: {
          href: decodeURIComponent(props.requestAQuoteUrl),
          linktype: 'internal',
          text: 'Get a quote',
          querystring: '',
          target: '',
          id: '{7FB335D2-8E99-458E-9EF9-562A78CCB821}',
        },
      },
      icon: {
        id: '50590edc-7ea7-4436-9a3e-701c87a07db2',
        url: '',
        name: 'Arrow',
        displayName: 'Arrow',
        fields: {
          Value: {
            value: 'arrow',
          },
        },
      },
      classes: 'mr-2',
    },
    cta2: {
      variant: {
        name: '',
        url: '',
        id: '',
        fields: {
          Value: {
            value: 'link',
          },
        },
      },
      field: {
        value: {
          href: props.url,
          linktype: 'internal',
          text: 'Edit design selections',
          querystring: '',
          target: '',
          id: '{7FB335D2-8E99-458E-9EF9-562A78CCB821}',
        },
      },
      icon: {
        id: '50590edc-7ea7-4436-9a3e-701c87a07db2',
        url: '',
        name: 'Arrow',
        displayName: 'Arrow',
        fields: {
          Value: {
            value: 'arrow',
          },
        },
      },
      classes: 'my-s ml:my-0 ml-0!',
    },
  };
};

export const shareServicesToExclude = [
  'amazon_wish_list',
  'aol_mail',
  'balatarin',
  'bibsonomy',
  'bitty_browser',
  'blinklist',
  'blogger',
  'blogmarks',
  'bookmarks_fr',
  'box_net',
  'buffer',
  'care2_news',
  'citeulike',
  'copy_link',
  'design_float',
  'diary_ru',
  'diaspora',
  'digg',
  'diigo',
  'douban',
  'draugiem',
  'dzone',
  'evernote',
  'facebook_messenger',
  'fark',
  'flipboard',
  'folkd',
  'google_bookmarks',
  'google_classroom',
  'hacker_news',
  'hatena',
  'houzz',
  'instapaper',
  'kakao',
  'kik',
  'kindle_it',
  'known',
  'line',
  'linkedin',
  'livejournal',
  'mail_ru',
  'mastodon',
  'mendeley',
  'meneame',
  'mewe',
  'mix',
  'mixi',
  'myspace',
  'netvouz',
  'odnoklassniki',
  'papaly',
  'pinboard',
  'plurk',
  'pocket',
  'print',
  'printfriendly',
  'protopage_bookmarks',
  'pusha',
  'qzone',
  'reddit',
  'rediff',
  'refind',
  'renren',
  'sina_weibo',
  'sitejot',
  'skype',
  'slashdot',
  'sms',
  'stocktwits',
  'svejo',
  'symbaloo_bookmarks',
  'telegram',
  'threema',
  'trello',
  'tuenti',
  'tumblr',
  'twiddla',
  'twitter',
  'typepad_post',
  'viadeo',
  'viber',
  'vk',
  'wanelo',
  'wechat',
  'whatsapp',
  'wordpress',
  'wykop',
  'xing',
  'yoolink',
  'yummly',
];
