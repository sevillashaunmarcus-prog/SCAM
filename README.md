# 💖 Pixel-Art Interactive Date Invitation ("Will You Go Out With Me?")

Isang cute, interactive, at romantic 8-bit / pixel-art dating game invitation website na pwedeng-pwede i-deploy nang libre sa **Vercel** o **GitHub Pages**!

---

## ✨ Features

- 🕹️ **Old-school Pixel Art Game Aesthetic:** Pastel colors, retro pixel borders, 8-bit fonts (`Press Start 2P` & `Pixelify Sans`), at tactile arcade-style buttons.
- 💔 **Playful NO Button Interaction:**
  - Bawat click, lumiliit ang NO button at lumalaki naman ang YES button!
  - Nagpapakita ng random cute funny messages ("Are you sure? 🥺", "Think again! 😭", "Nice try! 😭", atbp.).
  - May cute screen shake at pixel particle bursts (hearts, tears, sparkles).
  - Eventually, maglalaho ang NO button sa sobrang liit!
- 📅 **Interactive Step-by-Step Date Planning:**
  - **Step 1:** Date & Time Picker na may retro calendar/clock at quick chips.
  - **Step 2:** Date Activity Cards (Dinner, Coffee, Night Out, Outdoor Date).
  - **Step 3:** Food Cravings (Pizza, Pasta, Burgers, Japanese, Chicken, Desserts, Other).
  - **Step 4:** Outfit Color Matching na may live interactive pixel shirt preview!
  - **Step 5:** Pickup Location Input na may cute helper banner.
  - **Step 6 (Final Screen):** RPG victory screen kung saan nakadisplay ang preferences niya kasama ang **Actual Planned Date Mo**, na may magkahiwalay na copy buttons para pwede niyang piliin kung alin ang kokopyahin (Her Choices o What I Planned)!
- 💌 **Single-File Configuration (`js/config.js`):**
  - Dito mo lang babaguhin ang iyong `FINAL_DATE_PLAN` (Date, Time, Activity, Food, Outfit, Pickup Location, Sweet Message).
- 🧸 **Zero-Friction GIF / Image Placeholders:**
  - Suportado ang Animated GIF, PNG, JPG, at WEBP.
  - Kapag wala pang nakalagay na GIF, may magandang fallback pixel placeholder frame para hindi masira ang hitsura ng site.
- 🔊 **Built-in 8-Bit Web Audio Synthesizer:**
  - Walang external MP3 files! Pure browser audio synthesis para sa authentic bleeps, blops, at victory fanfare. May sound toggle button (🔊 / 🔇).
- 📱 **Mobile-First & Ultra Responsive:**
  - Swabeng-swabe sa smartphones (iOS / Android), tablet, at desktop. Walang horizontal scrolling at madaling pindutin.

---

## 📁 Project Structure

```text
SCAM/
├── index.html               # Main game structure (all pages & dialogs)
├── vercel.json              # Vercel deployment configuration
├── README.md                # Dokumentasyon at setup guide
├── css/
│   ├── pixel-base.css       # Design tokens, pixel fonts, colors & background grid
│   ├── pixel-components.css # Arcade buttons, cards, inputs, HUD & media containers
│   └── animations.css       # Floating hearts, confetti, particle bursts & pixel wipes
├── js/
│   ├── config.js            # ⭐️ DITO MO I-EEDIT ANG DATE DETAILS MO!
│   ├── sound.js             # 8-bit retro sound synthesizer (Web Audio API)
│   ├── pixel-effects.js     # Ambient pixel particles & celebration confetti
│   └── app.js               # State engine, NO button physics, page transitions
└── assets/
    ├── gifs/                # Ilagay dito ang animated GIFs (landing, date, pickup, final)
    ├── images/              # Static photos kung gusto mo
    └── stickers/            # Pixel stickers o extra icons
```

---

## 🛠️ Paano I-customize ang Date Plan Mo

Buksan lang ang file na **`js/config.js`**:

```javascript
const FINAL_DATE_PLAN = {
    // 📅 Petsa na gusto mo
    date: "Saturday, November 28, 2026",

    // ⏰ Oras ng date
    time: "5:30 PM",

    // 🎬 Ano ang gagawin ninyo
    activity: "Romantic Candlelight Dinner & Late Night Stargazing Walk",

    // 🍝 Pagkain na kakainin
    food: "Your favorite Italian Pasta & Pizza, plus Dessert!",

    // 👕 Matching outfit color
    outfitColor: "Pastel Pink / Matching Beige",

    // 🚗 Saan mo siya susunduin
    pickupLocation: "Right in front of your doorstep. Just get ready! 🚗",

    // 💌 Cute personal message
    specialMessage: "I can't wait to spend some time with you. You make my heart happy! ❤️"
};
```

---

## 🖼️ Paano Maglagay ng Cute Animated GIFs

Ilagay lang ang iyong napiling GIFs sa loob ng folder na `assets/gifs/` gamit ang mga pangalang ito:

- `assets/gifs/landing-couple.gif` — Cute couple / pixel bears sa landing page.
- `assets/gifs/date-animation.gif` — Cute calendar o date planning animation sa Step 1.
- `assets/gifs/pickup-animation.gif` — Pixel car o driving animation sa Step 5.
- `assets/gifs/final-couple.gif` — Romantic ending GIF sa final details screen.

> **Tip:** Pwede kang kumuha ng pixel GIFs mula sa Pinterest, Tenor, o Giphy (i-search: "cute pixel couple gif", "pixel peach goma gif", "pixel bear love gif").

---

## 🚀 Paano I-deploy sa Vercel

1. **I-test Locally:**
   - I-double click lang ang `index.html` para buksan sa browser (Chrome, Edge, Safari, Firefox).
2. **I-push sa GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: cute pixel date invitation website"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```
3. **I-deploy sa Vercel:**
   - Pumunta sa [vercel.com](https://vercel.com) at mag-login gamit ang GitHub.
   - I-click ang **"Add New Project"** at piliin ang iyong repository.
   - Pindutin ang **"Deploy"** (automatic na mare-recognize ng Vercel ang static HTML/CSS/JS site!).
   - Tapos na! May sarili ka nang shareable link (halimbawa: `https://our-date-invite.vercel.app`) na pwede mong ipadala sa kaniya! 💕
