# Aviya Patisserie — Home Bakery Business Academy
Static, bilingual (English / Hebrew) marketing website. Plain HTML, CSS, and vanilla JavaScript — no build step, no frameworks, no backend, no paid dependencies.

---

## 1. Project structure

```
aviya-patisserie/
├── index.html                 Home
├── digital-products.html      Recipe packs, templates, guides
├── mentorship.html            Mentorship packages
├── full-setup.html            Full Home Bakery Business Setup (premium)
├── branding-websites.html     Logo / brand kit / website services
├── free-resources.html        Free guide + lead magnet
├── about.html                 Founder story
├── contact.html                Contact & application links
├── legal.html                 Terms, Privacy, Refund, Disclaimer, etc. (one combined page)
├── styles.css                 All styling (colors, type, layout, components)
├── script.js                  Language switch, mobile nav, scroll animations
└── README.md                  This file
```

There is no `images/` folder yet — every photo spot on the site is a dashed placeholder box (`<div class="img-placeholder">`). Add your own `images/` folder and swap in `<img>` tags when you have real photos (see Section 5).

---

## 2. How the language switch works

Every piece of visible text on the site is written **twice** in the HTML — once inside an element with class `lang-en`, once with class `lang-he`:

```html
<h1 class="lang-en">Turn your baking dream into a business.</h1>
<h1 class="lang-he">להפוך את חלום האפייה שלך לעסק.</h1>
```

- `script.js` sets `<html lang="en" dir="ltr">` or `<html lang="he" dir="rtl">` when someone clicks the **EN / HE** buttons in the header.
- `styles.css` hides whichever language doesn't match:
  ```css
  html[lang="en"] .lang-he{ display:none !important; }
  html[lang="he"] .lang-en{ display:none !important; }
  ```
- The chosen language is saved in the browser's `localStorage`, so it's remembered on the next visit.
- English is always the default on first visit, per the project requirements.

### How to edit English text
Find the element with class `lang-en` and edit the text inside it directly. Nothing else needs to change.

### How to edit Hebrew translations
Find the matching element with class `lang-he` — it's always placed directly after (or near) the `lang-en` version of the same content — and edit the Hebrew text. Keep it natural and warm, not a literal word-for-word translation.

### Adding a brand-new block of text
Always add **both** a `lang-en` and a `lang-he` version, in the same place, so nothing goes blank when someone switches languages. If you only add one, that content will simply disappear when the site is switched to the other language.

---

## 3. How to replace PayPal links

Every "Buy" button links to a placeholder instead of a real PayPal button, e.g.:

```html
<a href="PAYPAL_LINK_ENGLISH_RECIPE" class="btn btn-primary btn-sm" target="_blank" rel="noopener">
```

1. Create a PayPal Buy Now / payment link for each product (PayPal → Create Payment Link, or PayPal.Me, or a hosted button).
2. In your code editor, use **Find & Replace across files** to swap:
   - `PAYPAL_LINK_ENGLISH_RECIPE` → your real PayPal link for the English version of that specific recipe
   - `PAYPAL_LINK_HEBREW_RECIPE` → your real PayPal link for the Hebrew version
3. **Important:** every recipe/template needs its *own* unique PayPal link (so you know what was purchased and can deliver the right file). The placeholder text is reused across products in this template — replace each one individually rather than doing one global find-and-replace for every instance.

---

## 4. How to replace form links (Jotform / Google Form / Tally)

Three placeholder link types are used throughout the site:

| Placeholder | Used for | Where it appears |
|---|---|---|
| `JOTFORM_PURCHASE_AGREEMENT_LINK` | The purchase agreement someone signs before paying for a digital product | Below each recipe/template's Buy buttons |
| `JOTFORM_APPLICATION_LINK` | Mentorship, Full Setup, logo, and website service applications | `mentorship.html`, `full-setup.html`, `branding-websites.html`, `contact.html` |
| `EMAIL_SIGNUP_FORM_LINK` | The free guide opt-in | `free-resources.html`, homepage CTA |

Build these forms in Jotform, Google Forms, or Tally, then Find & Replace the placeholder text with your real form URLs. The suggested purchase agreement wording is in Section 8 below — paste it into your Jotform's terms/consent field.

---

## 5. How to replace images

Every photo spot is currently a dashed placeholder:

```html
<div class="img-placeholder" role="img" aria-label="Photo placeholder: Israeli chocolate yeast cake">
  <span class="lang-en">Recipe photo placeholder</span>
  <span class="lang-he">מקום לתמונת מתכון</span>
</div>
```

To replace one with a real photo:
1. Add your image file to a new `images/` folder (create it next to `index.html`).
2. Replace the whole `<div class="img-placeholder">...</div>` block with:
   ```html
   <img src="images/your-photo.jpg" alt="Israeli chocolate yeast cake, sliced on a wooden board" loading="lazy">
   ```
3. Always write a real, descriptive `alt` text — it matters for accessibility and SEO.
4. For the social-share preview image, replace `images/og-cover.jpg` in the `<meta property="og:image">` tag in every page's `<head>` (recommended size: 1200×630px).

---

## 6. How to update prices

Every price is a placeholder:

```html
<p class="price">$0.00<!-- REPLACE: set your price --></p>
```

Find each `$0.00` in `digital-products.html`, `mentorship.html`, `full-setup.html`, and `branding-websites.html`, and replace it with your real price (e.g. `$18.00`, or `Starting at $250`).

---

## 7. How to deploy

This is a static site — no build step, no server required.

### Netlify
1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Deploy manually**.
2. Drag the whole `aviya-patisserie` folder onto the upload area.
3. Netlify gives you a live URL immediately. Add a custom domain under **Domain settings** if you have one.

### Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**.
2. Import the folder (via Git, or drag-and-drop with the Vercel CLI: `vercel deploy`).
3. No framework preset needed — choose "Other".

### GitHub Pages
1. Create a new GitHub repository and push these files to it.
2. Go to **Settings → Pages**.
3. Set the source branch to `main` and the folder to `/ (root)`.
4. Your site will be live at `https://yourusername.github.io/repo-name/`.

### Cloudflare Pages
1. Go to the Cloudflare dashboard → **Workers & Pages → Create → Pages**.
2. Connect your GitHub repo, or use **Direct Upload** and drag in the folder.
3. Build command: leave blank. Output directory: `/`.

In all four cases, `index.html` must stay at the root of whatever folder you deploy.

---

## 8. Purchase agreement wording (for your Jotform)

Paste this into your Jotform's terms/consent checkbox field for digital product purchases. It matches the summary already published on `legal.html`.

**English:**
> By purchasing this digital product, I confirm that I understand the materials provided by Aviya Patisserie are for my personal business use only. I agree not to copy, share, distribute, resell, upload, teach, reproduce, or transfer these materials to any other person, group, platform, or business. I understand that recipes, templates, guides, spreadsheets, and educational materials are protected content. I understand that this purchase does not include legal, tax, accounting, licensing, food safety, or regulatory advice. I am responsible for checking and following the laws, cottage food rules, health regulations, tax rules, and business requirements in my own country, state, city, or county. I understand that digital products are manually delivered by email after payment confirmation. I understand that digital products are non-refundable once delivered, unless otherwise stated in writing. I confirm that purchases, paid services, and contracts must be completed by an adult or with parent/guardian approval where required. I confirm that I have read and agree to these terms.

**Hebrew:**
> ברכישת מוצר דיגיטלי זה, אני מאשרת שאני מבינה כי החומרים המסופקים על ידי Aviya Patisserie מיועדים לשימוש עסקי אישי שלי בלבד. אני מסכימה שלא להעתיק, לשתף, להפיץ, למכור מחדש, להעלות, ללמד, לשכפל או להעביר חומרים אלו לכל אדם, קבוצה, פלטפורמה או עסק אחר. אני מבינה שמתכונים, תבניות, מדריכים, גיליונות אלקטרוניים וחומרים חינוכיים הם תוכן מוגן. אני מבינה שרכישה זו אינה כוללת ייעוץ משפטי, מס, ראיית חשבון, רישוי, בטיחות מזון או רגולציה. אני אחראית לבדוק ולפעול לפי החוקים, כללי ה-cottage food, תקנות הבריאות, כללי המס ודרישות העסק במדינה, המחוז, העיר או הקהילה שלי. אני מבינה שמוצרים דיגיטליים נשלחים ידנית במייל לאחר אישור התשלום. אני מבינה שמוצרים דיגיטליים אינם ניתנים להחזר לאחר המסירה, אלא אם צוין אחרת בכתב. אני מאשרת שרכישות, שירותים בתשלום והסכמים יש להשלים באמצעות בגיר/ה או באישור הורה/אפוטרופוס במקרים הנדרשים. אני מאשרת שקראתי והסכמתי לתנאים אלו.

---

## 9. Where to update business email and social links

Three placeholders appear in the footer of every page, in `contact.html`, and in `legal.html`:

- `BUSINESS_EMAIL` → replace with your real email, e.g. `hello@aviyapatisserie.com` (it appears both as visible text and inside `mailto:` links — replace both).
- `INSTAGRAM_LINK` → replace with your full Instagram profile URL.
- `WHATSAPP_LINK` → replace with your WhatsApp click-to-chat link (e.g. `https://wa.me/1XXXXXXXXXX`).

Use Find & Replace across all files for each of these three placeholders — they're identical everywhere, so a single global replace is safe for these three (unlike the PayPal links, which must stay unique per-product).

---

## 10. How to add a new product

To add a new recipe pack, template, or guide, copy an existing `<div class="card product-card reveal">...</div>` block in `digital-products.html` and:

1. Update the English name, description, and included items.
2. Add the matching Hebrew (`lang-he`) version of every line.
3. Update the price.
4. Set unique PayPal links for the English and Hebrew versions.
5. Keep the purchase agreement link and "manually delivered" notice — don't remove them.

## How to add a new recipe in English and Hebrew

Recipes follow the same product-card pattern (Section 10 above). Each recipe pack should always show, in both languages: step-by-step instructions, U.S. ingredient adaptations, Israeli ingredient alternatives, selling tips, packaging ideas, suggested pricing guidance, and photography tips — even if some of that detail lives in the delivered PDF rather than on the card itself, mention it in the card's "includes" list so customers know what they're buying.

---

## 11. Manual steps to complete before launching

- [ ] Replace all `PAYPAL_LINK_ENGLISH_RECIPE` / `PAYPAL_LINK_HEBREW_RECIPE` placeholders with real, unique PayPal links per product.
- [ ] Replace all `JOTFORM_PURCHASE_AGREEMENT_LINK` placeholders with your real purchase agreement form link.
- [ ] Replace all `JOTFORM_APPLICATION_LINK` placeholders with your real mentorship / Full Setup / branding / website application form links.
- [ ] Replace `EMAIL_SIGNUP_FORM_LINK` with your real free-guide opt-in form link.
- [ ] Replace every `$0.00` price placeholder with real prices.
- [ ] Replace `BUSINESS_EMAIL`, `INSTAGRAM_LINK`, and `WHATSAPP_LINK` everywhere they appear.
- [ ] Replace `EFFECTIVE_DATE_PLACEHOLDER` in `legal.html` with the date your terms go live.
- [ ] Add real product/lifestyle photos and update all `img-placeholder` divs and `alt` text.
- [ ] Add a real 1200×630 Open Graph image and update `og:image` in every page's `<head>`.
- [ ] Update `og:url` in every page's `<head>` to your real domain.
- [ ] Review every Hebrew translation for tone and accuracy — a native speaker's proofread is strongly recommended before launch.
- [ ] Have a qualified attorney review `legal.html` for your specific state/country before publishing — this template is a starting point, not legal advice.
- [ ] Set up your PayPal account, Jotform/Google Form/Tally forms, and email delivery workflow so purchases actually get fulfilled.
- [ ] Test the EN/HE switch and mobile menu on a real phone before launch.

---

Built with plain HTML, CSS, and vanilla JavaScript. No frameworks, no build tools, no paid dependencies — edit any file directly in a text editor.
