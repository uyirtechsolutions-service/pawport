import { siteUrl } from './_lib/seo'

export default function sitemap() {
  return [
    {
      url: new URL('/', siteUrl).toString(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: new URL('/services', siteUrl).toString(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: new URL('/process', siteUrl).toString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: new URL('/stories', siteUrl).toString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}