// Global
import { Field, Link, LinkField } from '@sitecore-content-sdk/nextjs';
import { useModalIdContext } from 'lib/context/GenericModalIDContext';
// Lib
import useExperienceEditor from 'lib/utils/use-experience-editor';
import { Children, JSX, MouseEvent, ReactNode } from 'react';
/**
 * This component adds some needed accessibility
 * updates to the JSS Link component
 */
export type CTASection = 'header' | 'footer' | 'utility' | 'mobile';

type LinkFieldInput = LinkField | LinkField['value'];

export interface LinkWrapperProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  field: LinkFieldInput;
  srOnlyText?: string;
  suppressLinkText?: boolean;
  suppressNewTabIcon?: boolean;
  modalId?: string | undefined;
  modalLinkText?: Field<string>;
  ariaLabel?: Field<string>;
  ctaSection?: CTASection;
  children?: ReactNode;
}

const INTERNAL_LINK_REGEX = /^\//g;

const LinkWrapper = ({
  children,
  field,
  srOnlyText,
  suppressLinkText,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  suppressNewTabIcon,
  modalId,
  modalLinkText,
  ariaLabel,
  ctaSection,
  ...props
}: LinkWrapperProps): JSX.Element => {
  // Format field as LinkField for consistency
  const asLinkField = !field?.value ? { value: { ...field } } : (field as LinkField);
  // Sitecore doesn't do tel: links correctly, it appends http to it.  Remove that.
  asLinkField.value.href = asLinkField.value.href?.replace('http://tel:', 'tel:');

  // Fix anchor being rendered twice for anchor linktypes in general link.  Fixed in Sitecore JSS v21, not fixed in v20.
  // Remove once on SitecoreJSS v21
  if (
    asLinkField.value.linktype === 'anchor' &&
    asLinkField.value.anchor &&
    (asLinkField.value.href?.indexOf(asLinkField.value.anchor) || -1) >= 0
  ) {
    asLinkField.value.anchor = '';
  }
  const text = suppressLinkText ? '' : asLinkField?.value?.text;
  const target = asLinkField?.value?.target;
  const { setSelectedModalId, prevFocusedElementRef } = useModalIdContext();

  const handleModalClick = (e: MouseEvent) => {
    if (modalId) {
      setSelectedModalId(modalId);
      if (prevFocusedElementRef) {
        prevFocusedElementRef.current = e.currentTarget as HTMLButtonElement;
      }
    }
  };

  const gtmProps = ((): Record<string, string | null> => {
    if (asLinkField.value.href?.includes('tel:')) {
      return {
        'data-gtm-click': '',
        'data-gtm-dl-event': 'click_to_call',
      };
    }
    if (ctaSection) {
      return {
        'data-gtm-click': '',
        'data-gtm-dl-event': 'nav_click',
        'data-gtm-dl-nav-section': ctaSection,
      };
    }

    return { 'data-gtm-click': '', 'data-gtm-dl-event': 'cta_click' };
  })();

  const isEE = useExperienceEditor();

  // if modalId is provided, then act as ModalCta
  if (modalId) {
    return (
      <button onClick={(e) => handleModalClick(e)} className={props.className}>
        {modalLinkText?.value} {children}
      </button>
    );
  }
  // In experience editor, do not pass any children but retain basic styling
  // so that double components do not appear when using <Link>
  if (isEE) {
    const ctaIcon = Children.toArray(children)?.[0];
    const ctaEEClassess = props.className;
    delete props.className;
    return (
      <div className={ctaEEClassess}>
        <Link
          field={asLinkField}
          {...props}
          showLinkTextWithChildrenPresent={false}
          internalLinkMatcher={INTERNAL_LINK_REGEX}
        />
        {ctaIcon && ctaIcon}
      </div>
    );
  }

  // If no content is present, don't print
  if (!suppressLinkText && !asLinkField.value.text && !asLinkField.value.href) {
    return <></>;
  }

  return (
    <Link
      field={asLinkField}
      {...props}
      {...gtmProps}
      showLinkTextWithChildrenPresent={false}
      internalLinkMatcher={INTERNAL_LINK_REGEX}
      tabIndex={0}
      role="link"
      rel={target === '_blank' ? (props.rel ?? 'noopener noreferrer') : props.rel}
      aria-label={`${ariaLabel?.value || text || ''}${
        target === '_blank' ? ' (Opens in a new tab)' : ''
      }`}
    >
      {text}
      {children}
      {(target === '_blank' || srOnlyText) && (
        <>
          <span className="sr-only">
            {srOnlyText && srOnlyText}
            {/* Preserve a single space character before SR Tab Text */}
            {target === '_blank' && ' (Opens in a new tab)'}
          </span>
          {/* {!suppressNewTabIcon && target === '_blank' && (
            <SvgIcon icon="new-tab" size="em" className="ml-2" />
          )} */}
        </>
      )}
    </Link>
  );
};

export default LinkWrapper;
