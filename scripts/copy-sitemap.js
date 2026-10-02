import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const sitemap0 = path.join(distDir, 'sitemap-0.xml');
const sitemapIndex = path.join(distDir, 'sitemap-index.xml');
const targetSitemap = path.join(distDir, 'sitemap.xml');

try {
  if (fs.existsSync(sitemap0)) {
    fs.copyFileSync(sitemap0, targetSitemap);
    console.log('✅ Successfully created dist/sitemap.xml from sitemap-0.xml');
  } else if (fs.existsSync(sitemapIndex)) {
    fs.copyFileSync(sitemapIndex, targetSitemap);
    console.log('✅ Successfully created dist/sitemap.xml from sitemap-index.xml');
  } else {
    console.log('ℹ️ No sitemap xml found to copy.');
  }
} catch (err) {
  console.error('⚠️ Error copying sitemap:', err);
}
