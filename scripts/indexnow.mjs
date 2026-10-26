// Tells IndexNow-supporting search engines (Bing, Yandex and others; NOT Google)
// which URLs changed. Run it after a deploy:  node scripts/indexnow.mjs
// It reads the live sitemap, so it submits exactly what the site publishes.
// The key is public by design: the same value is served at /<key>.txt so the
// engines can confirm the site is yours.
import { readdirSync, readFileSync } from "node:fs";

const HOST = "www.kevinandrew.tech";
const keyFile = readdirSync("public").find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("No IndexNow key file in public/");
const key = readFileSync(`public/${keyFile}`, "utf8").trim();

const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urlList.length === 0) throw new Error("Sitemap returned no URLs");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key,
    keyLocation: `https://${HOST}/${keyFile}`,
    urlList,
  }),
});
console.log(`${res.status} ${res.statusText}: submitted ${urlList.length} URLs`);
if (!res.ok && res.status !== 202) process.exit(1);
