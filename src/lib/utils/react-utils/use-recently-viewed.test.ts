import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useRecentlyViewed } from './use-recently-viewed';

describe('lib > utils > react-utils > use-recently-viewed', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('loads recent links from local storage', () => {
    const recentLinks = [
      { href: 'https://example.com/first', text: 'First', expiry: new Date().toISOString() },
    ];
    localStorage.setItem('recentlyViewed', JSON.stringify(recentLinks));

    const { result } = renderHook(() => useRecentlyViewed());

    expect(result.current.recentLinks).toEqual(recentLinks);
  });

  it('filters expired links from local storage', () => {
    const expired = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString();
    localStorage.setItem(
      'recentlyViewed',
      JSON.stringify([{ href: 'https://example.com/old', text: 'Old', expiry: expired }])
    );

    const { result } = renderHook(() => useRecentlyViewed());

    expect(result.current.recentLinks).toEqual([]);
    expect(localStorage.getItem('recentlyViewed')).toBe('[]');
  });

  it('adds a clicked document link to recent links', () => {
    const link = document.createElement('a');
    link.className = 'documentLink';
    link.href = 'https://example.com/document';
    link.title = 'Document';
    document.body.appendChild(link);

    const { result } = renderHook(() => useRecentlyViewed());

    act(() => {
      link.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(result.current.recentLinks).toHaveLength(1);
    expect(result.current.recentLinks[0]).toMatchObject({
      href: 'https://example.com/document',
      text: 'Document',
    });
    expect(JSON.parse(localStorage.getItem('recentlyViewed') ?? '[]')).toEqual(
      result.current.recentLinks
    );
  });

  it('moves an existing clicked link to the front', () => {
    const existing = {
      href: 'https://example.com/document',
      text: 'Document',
      expiry: '2020-01-01T00:00:00.000Z',
    };
    const other = {
      href: 'https://example.com/other',
      text: 'Other',
      expiry: new Date().toISOString(),
    };
    localStorage.setItem('recentlyViewed', JSON.stringify([existing, other]));

    const link = document.createElement('a');
    link.className = 'documentLink';
    link.href = existing.href;
    link.title = existing.text;
    document.body.appendChild(link);

    const { result } = renderHook(() => useRecentlyViewed());

    act(() => {
      link.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(result.current.recentLinks.map((item: { href: string }) => item.href)).toEqual([
      existing.href,
      other.href,
    ]);
    expect((result.current.recentLinks[0] as { expiry: string }).expiry).not.toBe(existing.expiry);
  });

  it('updates recent links from a storage event', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    const recentLinks = [
      { href: 'https://example.com/shared', text: 'Shared', expiry: new Date().toISOString() },
    ];

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'recentlyViewed',
          newValue: JSON.stringify(recentLinks),
        })
      );
    });

    expect(result.current.recentLinks).toEqual(recentLinks);
  });
});
