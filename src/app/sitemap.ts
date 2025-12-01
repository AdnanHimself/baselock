import { MetadataRoute } from 'next';
import { generateSeoCombinations } from '@/lib/seo-data';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://justunlock.link'; // Production URL
    const combinations = generateSeoCombinations();

    // Static routes
    const routes = [
        '',
        '/how-it-works',
        '/feedback',
        '/use-cases',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic SEO routes
    const seoRoutes = combinations.map((combo) => ({
        url: `${baseUrl}/use-cases/${combo.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [...routes, ...seoRoutes];
}
