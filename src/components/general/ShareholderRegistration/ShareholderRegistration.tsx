'use client';

import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import ImagePrimary from 'helpers/Media/ImagePrimary';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { useRouter } from 'next/navigation';
import { JSX, useState } from 'react';

import { ShareholderRegistrationTheme } from './helpers/ShareholderRegistration.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type ShareholderRegistrationProps = ComponentProps &
  Sitecore.Components.General.ShareholderRegistration.ShareholderRegistration;

function ShareholderRegistration_Default(props: ShareholderRegistrationProps): JSX.Element {
  const { themeData } = useTheme(ShareholderRegistrationTheme);
  const router = useRouter();
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supportPhone = props.fields?.supportPhone?.value ?? '';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!code) {
      setError('Please enter your registration code.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/aw/webinar/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (!res.ok || !data?.ok) {
        setError(`Problems logging in?  Call ${supportPhone} for help.`);
        setSubmitting(false);
        return;
      }

      router.push(data.redirectTo);
    } catch {
      setError(`We hit a temporary issue. Please try again or call ${supportPhone} for help.`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Component variant="lg" padding={'px-0'} dataComponent="general/webinarregistration" {...props}>
      <div className={themeData.classes.componentWrapper}>
        <div className={themeData.classes.imageWrapper}>
          <ImagePrimary
            {...props}
            hideCaption={true}
            priority
            ratio="responsive"
            maxW="max-w-[640px]"
            additionalDesktopClasses="ml-auto mr-auto h-auto block"
          />
        </div>
        <Headline defaultTag="h2" classes={themeData.classes.headlineClass} {...props} />
        <div className="">
          <div className="text-left formWrapper">
            <form onSubmit={onSubmit} className="max-w-[640px] mx-auto" noValidate>
              <div>
                <label htmlFor="code" className={themeData.classes.formLabel}>
                  Registration Code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  inputMode="text"
                  autoComplete="one-time-code"
                  className={themeData.classes.formInput}
                  maxLength={7}
                  placeholder="Registration Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  aria-invalid={!!error}
                  aria-describedby={error ? 'code-error' : undefined}
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className={themeData.classes.buttonClass}
                >
                  {submitting ? 'Checking…' : 'Continue'}
                </button>
              </div>
            </form>
            {error && (
              <div className="max-w-[640px] mx-auto">
                <p id="code-error" className={themeData.classes.errorClass} role="alert">
                  {error}{' '}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(ShareholderRegistration_Default);
