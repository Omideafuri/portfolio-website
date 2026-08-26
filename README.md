# Omid — Freelance Web Designer & Front-End Developer Portfolio

> **"Websites that make good businesses look undeniable."**  
> A high-converting personal freelance client acquisition website combining modern digital design, editorial typography, and high-performance front-end development.

---

## 🎯 Conversion Strategy & Architecture

This website is engineered around the conversion sequence:
`VISITOR → TRUST → INTEREST → CONTACT → CLIENT`

- **Within 5 Seconds:** Understands who I am (Omid, independent designer/developer) and my core value proposition.
- **Within 10 Seconds:** Understands what I do (design + build high-performance websites for businesses & founders).
- **Within 20 Seconds:** Sees real, authentic case studies (Zaravi Gold, Colorado) with 01-04 challenge/direction/build/result breakdowns.
- **Within 30 Seconds:** Understands my specific services, 4-step process, and hybrid design+code advantage.
- **Within 60 Seconds:** Has an ultra-low-friction pathway to submit a project inquiry through a functional lead form or direct email.

---

## 🎨 Design System & Palette

- **Canvas & High Readability (Eggshell):** `#ECE7D6` / `#F5F2E9`
- **Mid-Tone Banding (Olive):** `#6B6D3B` (Why Work With Me, Value Strips)
- **Deep Contrast Showcase (Moss):** `#2E3821` (Selected Work, Lead Generation)
- **Structure & Typography (Onyx):** `#191919`
- **Conversion Accent & CTAs (Chartreuse):** `#C8D92B`

---

## 🛠 Tech Stack

- **Markup & Semantics:** HTML5, Accessible Landmarks (`<main>`, `<header>`, `<nav>`, `<article>`, `<section>`, `<footer>`), Schema.org JSON-LD structured data.
- **Styles & Layout:** Modular CSS3, CSS Grid, Flexbox, Fluid Clamping, CSS Variables, Grain Texture Overlay, `prefers-reduced-motion` compliance.
- **Typography:** `Syne` (Structural Bold Grotesque), `Newsreader` (Editorial Serif), `EB Garamond` (Body Copy), `JetBrains Mono` (Technical Metadata).
- **Interactions & Scripts:** Vanilla JavaScript (ES6+), IntersectionObserver for scroll reveals, ScrollSpy navigation, custom event analytics dispatcher.
- **Lead Generation:** Async form handler supporting Web3Forms / Formspree with live validation, loading feedback, success states, and mailto fallback.

---

## 🚀 Running Locally

```bash
# Using Python
python -m http.server 8080

# Or using Node/npx
npx serve .
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📬 Contact Form Configuration

To connect the lead intake form to your email inbox:

1. **Option A (Web3Forms - Recommended, Zero Server):**
   - Get a free Access Key from [web3forms.com](https://web3forms.com).
   - In `index.html`, update the hidden input value:
     ```html
     <input type="hidden" name="access_key" value="YOUR_ACTUAL_ACCESS_KEY_HERE">
     ```
   - In `js/main.js`, update `CONFIG.defaultAccessKey`.

2. **Option B (Formspree):**
   - Change the form `action` attribute in `index.html` to:
     ```html
     <form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
     ```

3. **Fallback:** If offline or in testing mode without an API key, the form gracefully validates, displays feedback, and offers a direct pre-filled `mailto:` link to `omideafuri@gmail.com`.
