import type { ModelViewerElement } from '@google/model-viewer';
import classNames from 'classnames';
import SvgIcon, { IconTypes } from 'helpers/SvgIcon/SvgIcon';
import { getEnum } from 'lib/utils/get-enum';
import { JSX, useEffect, useRef, useState } from 'react';
import { isDesktop } from 'react-device-detect';
import { FaSms } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

import ModalWrapper from '../ModalWrapper/ModalWrapper';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type CallToActionARProps = Sitecore.Elements.AR.CallToActionAR & {
  classes?: {
    wrapper?: string;
    buttonClasses?: string;
  };
};

const CallToActionAR = ({ fields, classes }: CallToActionARProps): JSX.Element => {
  // Add the Modal Viewer script
  //useModelViewerScript();
  const ref = useRef<ModelViewerElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const _icon = getEnum<IconTypes>(fields?.buttonIcon);
  const [pageUrl, setPageUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    import('@google/model-viewer');
  }, []);
  const handleOrientationChange = () => {
    setAngle(window.screen.orientation.angle);
  };
  useEffect(() => {
    // Get the current page's URL when the component mounts
    setPageUrl(window.location.href);
    if (pageUrl.includes('?ar=true')) {
      setIsModalOpen(true);
    }

    if (screen.orientation) {
      setAngle(window.screen.orientation.angle);
      // Property doesn't exist on screen in IE11
      screen.orientation.addEventListener('change', handleOrientationChange);
    }

    return () => {
      window.removeEventListener('change', handleOrientationChange);
    };
  }, [pageUrl]);

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setPhone('');
    setEmail('');
    setStatusMessage('');
    setIsModalOpen(false);
    setEmailSent(false);
  };

  const sendSMS = async (phone: string) => {
    const link = location.origin + location.pathname + '?ar=true';

    try {
      const response = await fetch('/api/aw/share-ar-link', {
        method: 'POST',
        body: JSON.stringify({
          phoneNumber: phone,
          link: link,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setStatusMessage('Message sent.');
        setPhone('');
      } else {
        setStatusMessage('Error sending message.');
      }
    } catch (error) {
      console.error('---catch-error---:', error);
      setStatusMessage('Error sending message.');
    }
  };

  const handleClickSMS = () => {
    setStatusMessage('');
    if (phone) {
      if (/^\d{10,11}$/.test(phone)) {
        sendSMS(phone);
      } else {
        setStatusMessage('Please enter a valid phone number.');
      }
    } else {
      setStatusMessage('Please enter a valid phone number.');
    }
  };

  const handleClickEmail = () => {
    setStatusMessage('');
    const linkAddress = pageUrl + '?ar=true';
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    if (email && emailRegex.test(email)) {
      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
        fields?.arShareSubjectTemplate?.value
      )}&body=${encodeURIComponent(fields?.arShareMessageTemplate?.value + linkAddress)}`;
      window.location.href = mailtoLink;
      setEmailSent(true);
    } else {
      setStatusMessage('Please enter a valid email.');
    }
  };

  return (
    <>
      <ModalWrapper
        isModalOpen={isModalOpen}
        size={angle === 90 ? 'extra-large' : 'fluid'}
        handleClose={handleClose}
      >
        <div className="px-4 pb-4">
          <model-viewer
            ref={ref}
            src={fields?.gltfLink?.value.href}
            ios-src={fields?.usdzLink?.value.href}
            ar=""
            camera-controls=""
            quick-look-browsers="safari chrome"
            camera-orbit="0deg 90deg"
            poster={fields?.posterImage?.value?.src}
            tabIndex={0}
            className="mb-[15px] ml-auto mr-auto min-h-[250px] w-full"
            ar-status="not-presenting"
          ></model-viewer>
          {isDesktop && (
            <div className="mt-2 block font-sans text-[14px] leading-[17px] ">
              {fields?.arDesktopMessage?.value}
            </div>
          )}
          {statusMessage && (
            <div className="mt-2 block font-sans text-[14px] leading-[17px] text-error">
              {statusMessage}
            </div>
          )}
          {isDesktop && (
            <div className="mt-4 grid grid-cols-1 gap-4 ml:grid-cols-2">
              <div className="flex items-center">
                <div className="flex items-center">
                  <input
                    type="tel"
                    placeholder="xxx-xxx-xxxx"
                    className="w-full rounded-sm border border-[#b9b9b9]"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <button
                    type="button"
                    className="ml-2 flex h-[40px] min-w-[40px] items-center justify-center rounded-[6px] bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    onClick={handleClickSMS}
                  >
                    <FaSms size={25} color="white" />
                  </button>
                </div>
              </div>
              {!emailSent ? (
                <div className="flex items-center">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full rounded-sm border border-[#b9b9b9]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    type="button"
                    className="ml-2 flex h-[40px] min-w-[40px] items-center justify-center rounded-[6px] bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    onClick={handleClickEmail}
                  >
                    <MdEmail size={25} color="white" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center">Thank you for your interest!</div>
              )}
            </div>
          )}
        </div>
      </ModalWrapper>
      <div className={classNames(classes?.wrapper, 'flex items-start md:flex-row md:items-center')}>
        {fields?.buttonText && (
          <div
            className={classNames(
              classes?.wrapper,
              'mb-s flex items-start md:flex-row md:items-center md:space-x-4'
            )}
          >
            <button
              onClick={() => {
                handleOpen();
              }}
              className={classNames(classes?.buttonClasses)}
            >
              <span>{fields?.buttonText?.value}</span>
              <SvgIcon icon={_icon} className="ml-xxs" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CallToActionAR;
