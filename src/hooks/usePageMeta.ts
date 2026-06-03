import { useEffect } from 'react';

export interface PageMeta {
  /** document.title + og:title + twitter:title */
  title?: string;
  /** meta description + og/twitter description */
  description?: string;
  /** absolute canonical URL (also used for og:url) */
  canonical?: string;
  /** add <meta name="robots" content="noindex"> */
  noindex?: boolean;
}

/**
 * Manages per-page SEO/social meta (title, description, canonical, Open Graph,
 * Twitter card, robots) while a component is mounted, cleaning up on unmount.
 *
 * NB: injected via JS, so Googlebot (which renders JS) honours these, but
 * non-JS link-preview bots (Slack/X/etc.) do not — rich previews for shared
 * links need server-side prerendering. This hook is the CSR groundwork.
 */
export function usePageMeta({ title, description, canonical, noindex }: PageMeta): void {
  useEffect(() => {
    const prevTitle = document.title;
    const created: Element[] = [];

    const addMeta = (attr: 'name' | 'property', key: string, content: string) => {
      const el = document.createElement('meta');
      el.setAttribute(attr, key);
      el.setAttribute('content', content);
      document.head.appendChild(el);
      created.push(el);
    };
    const addLink = (rel: string, href: string) => {
      const el = document.createElement('link');
      el.setAttribute('rel', rel);
      el.setAttribute('href', href);
      document.head.appendChild(el);
      created.push(el);
    };

    if (title) {
      document.title = title;
      addMeta('property', 'og:title', title);
      addMeta('name', 'twitter:title', title);
    }
    if (description) {
      addMeta('name', 'description', description);
      addMeta('property', 'og:description', description);
      addMeta('name', 'twitter:description', description);
    }
    if (canonical) {
      addLink('canonical', canonical);
      addMeta('property', 'og:url', canonical);
    }
    if (title || description) {
      addMeta('property', 'og:type', 'website');
      addMeta('name', 'twitter:card', 'summary');
    }
    if (noindex) addMeta('name', 'robots', 'noindex');

    return () => {
      document.title = prevTitle;
      created.forEach((el) => el.parentNode?.removeChild(el));
    };
  }, [title, description, canonical, noindex]);
}
