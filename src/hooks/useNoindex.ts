import { useEffect } from 'react';

/**
 * Adds `<meta name="robots" content="noindex">` to <head> while the component
 * is mounted, and removes it on unmount. Use on pages that should not be
 * indexed by search engines — transient/dynamic results, the not-found
 * catch-all, and error pages — which otherwise return HTTP 200 with thin or
 * "not found" content and get flagged as Soft 404s.
 *
 * Googlebot renders JS before indexing, so a JS-injected noindex is honoured.
 * (robots.txt isn't an option here: the app is served under /ProtVar/ on the
 * shared www.ebi.ac.uk host, whose root robots.txt we don't control.)
 */
export function useNoindex(): void {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);
}
