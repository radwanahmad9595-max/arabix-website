# ARABIx — أرابيكس

Official one-page website for **ARABIx (أرابيكس)** — trusted Arabic content for AI applications.

## Stack
Plain static site (HTML + CSS + vanilla JS). No build step. Hosted on **Cloudflare Pages**.

```
index.html            Main page (Arabic, RTL)
404.html              Not-found page
assets/css/style.css  Styles (brand tokens at the top)
assets/js/main.js     Interactions (review demo, tabs, pixels, form)
assets/img/           Logo (SVG), icons, social share image
_headers              Cloudflare security & cache headers
robots.txt, sitemap.xml, site.webmanifest
```

## Brand
Colors: `#1F1B57` indigo-deep · `#2E3F96` indigo · `#6E9BE0` sky (decoration only) · `#DCE6F7` sky-soft · `#1C1A52` ink · `#F7F8FC` surface
Font: IBM Plex Sans Arabic (Google Fonts)

## Deploy
Cloudflare Pages → connect this repo → Framework preset: **None** · Build command: *(empty)* · Output directory: `/`
