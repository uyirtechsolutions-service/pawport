import { siteUrl } from './_lib/seo'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
  }
}