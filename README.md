# OLIVE FITNESS-LADIES GYM — Kodungaiyur, Chennai (static + light backend)

Premium mobile-first site: Olive + Cream + Gold. 9 pages + legal + 404.
Real business: 1st Floor, Apollo Building, 15, Kattabomman Main Road, 1st St, Kodungaiyur, Chennai 600118.
Hours: Mon–Sat 6 AM–1 PM & 4–9 PM; Sun 6 AM–12 PM (Tue PM unconfirmed in listings).

## Run locally
- Frontend only: open `index.html` (or `npx serve .`)
- Full (forms API): `cd backend && npm install && node server.js` → http://localhost:3000
- Health: `GET /api/health` • Enquiries: `POST /api/enquiries` → saved to `backend/enquiries.json`

## Still needed from the owner
1. **Confirm phone/WhatsApp** — site interim-uses public listing +91 73582 94290 (`assets/js/config.js`, all `wa.me`/`tel:` links, schema). Replace when owner shares the number.
2. **Price list** — plans are enquire-for-price (`membership.html`, `index.html`, `data/plans.json`).
3. **Exact batch days/times + coach names/photos/certs** (`classes.html`, `trainers.html`, `data/gym.json`).
4. **Real photos** in `assets/img/` (compressed, with alt text).
5. **Real domain** in `sitemap.xml` + canonicals (currently `https://www.example.com`).
6. **Verified Google reviews** to replace paraphrased feedback themes (`testimonials.html`, `index.html`).
7. `privacy.html` / `terms.html` → legal-reviewed copy.

## Deploy
- Static: Netlify / Vercel / GitHub Pages (upload repo root). Backend: Render/Fly/any Node host (`backend/`), set `PORT` env.
- HTTPS enforced by host. Submit sitemap to Search Console. Claim/verify Google Business Profile.
