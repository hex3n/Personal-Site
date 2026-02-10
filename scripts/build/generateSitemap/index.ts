import { readdirSync, writeFileSync } from 'fs';
import { basename, extname, join } from 'path';

const BASE_URL = (process.env.SITEMAP_BASE_URL ??
	'https://slowbro213.github.io/Rakeli'
).replace(/\/$/, '');

const STATIC_ROUTES = ['index.html', 'about.html', 'writeups.html', 'blogs.html'];

function getGeneratedRoutes(directory: string, routePrefix: string): string[] {
	return readdirSync(directory)
		.filter((file) => extname(file) === '.md')
		.map((file) => basename(file, '.md').split('.')[0])
		.map((slug) => `${routePrefix}/${slug}.html`)
		.sort((a, b) => a.localeCompare(b));
}

function toUrlTag(pathname: string): string {
	return `  <url><loc>${BASE_URL}/${pathname}</loc></url>`;
}

const blogRoutes = getGeneratedRoutes('src/md/blogs', 'blogs');
const writeupRoutes = getGeneratedRoutes('src/md/writeups', 'writeups');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...STATIC_ROUTES, ...writeupRoutes, ...blogRoutes].map(toUrlTag).join('\n')}
</urlset>
`;

writeFileSync(join('public', 'sitemap.xml'), xml);
console.log(
	`✅ Sitemap generated with ${STATIC_ROUTES.length + writeupRoutes.length + blogRoutes.length} routes`,
);
