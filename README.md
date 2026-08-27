# Omid Mohammadi — Portfolio

> **Business, technology, design, communication.**
> A multidisciplinary portfolio built as a precision instrument.

---

## Design Direction

**THE INSTRUMENT** — a website designed as a physical object.

- **Light-mode warm off-white base** derived from aged ABS plastic and paper materials
- **Dual typeface system:** Inter (display + body) × JetBrains Mono (technical labels)
- **Safety orange** accent for actions, **green** for status, **yellow** for warnings
- **Sharp geometry** — zero border-radius on primary elements
- **Modular panels, data plates, and system labels** referencing industrial hardware

---

## Architecture

```
portfolio-website/
├── index.html          # Single-page semantic HTML5
├── css/
│   ├── styles.css      # Import orchestrator
│   ├── tokens.css      # Design tokens (colors, spacing, type, etc.)
│   ├── reset.css       # Base reset + texture overlay
│   ├── typography.css  # Font imports + type scale
│   ├── layout.css      # Grid system + containers
│   ├── components.css  # Nav, buttons, panels, badges, inputs
│   ├── sections.css    # Section-specific styles
│   └── responsive.css  # Breakpoints (tablet + mobile)
├── js/
│   └── main.js         # Nav, scrollspy, reveals, contact form
└── assets/
    └── images/         # Project imagery
```

## Tech Stack

- **Zero dependencies** — vanilla HTML5, CSS3, JavaScript ES6+
- **No build tools** — serves directly via any static file server
- **Google Fonts:** Inter + JetBrains Mono
- **Web3Forms** for contact form submissions

---

## Running Locally

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

Open [http://localhost:8080](http://localhost:8080)
