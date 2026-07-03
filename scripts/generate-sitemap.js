const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data/regions.json"), "utf8"));
const { siteUrl, districts } = data;

const urls = [
  "/",
  "/reviews/",
  "/reviews/customer/"
];

for (const gu of districts) {
  urls.push(`/regions/${gu.slug}/`);
  for (const dong of gu.dongs) {
    urls.push(`/regions/${gu.slug}/${dong.slug}/`);
  }
}

const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${siteUrl}${u}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u === "/" ? "1.0" : u.includes("/regions/") && u.split("/").filter(Boolean).length === 2 ? "0.8" : "0.7"}</priority>
  </url>`).join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml, "utf8");
console.log(`Sitemap generated with ${urls.length} URLs.`);
