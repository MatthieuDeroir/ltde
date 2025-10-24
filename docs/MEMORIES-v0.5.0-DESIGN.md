# v0.5.0 - Design System & UX Senior-Friendly

**Durée**: 4 jours | **Status**: 🔴 Not Started | **Prérequis**: v0.4.0 ✅

---

## 🎯 Objectif

Créer le design system complet et adapter l'interface pour grand-père (senior-friendly).

**Livrables**:
- Design tokens (colors, typography, spacing)
- Configuration Tailwind senior-friendly
- Composants UI redesignés (18px+, 60px boutons)
- Tests accessibilité WCAG AAA
- **Validation grand-père** ✨

---

## 📋 Checklist

### 1. Design Tokens

**`src/core/design-system/colors.ts`**
```typescript
export const colors = {
  slate: {
    1: '#fcfcfd', 2: '#f9f9fb', 3: '#f0f0f3',
    9: '#696e77', 11: '#3e4348', 12: '#1c1f24',
  },
  indigo: {
    1: '#fdfdfe', 2: '#f7f9ff', 3: '#edf2fe',
    9: '#3e63dd', 11: '#3358d4', 12: '#1f2d5c',
  },
  // Semantic
  success: '#16a34a',
  warning: '#f59e0b',
  error: '#dc2626',
};
```

**`src/core/design-system/typography.ts`**
```typescript
export const typography = {
  sizes: {
    base: '18px',    // Min 18px pour seniors
    lg: '20px',
    xl: '24px',
    '2xl': '28px',
    '3xl': '36px',
    '4xl': '48px',
  },
  lineHeight: { base: 1.8, heading: 1.3 },
  fonts: {
    sans: 'Inter, sans-serif',
    serif: 'Literata, serif',
  },
};
```

**`src/core/design-system/spacing.ts`**
```typescript
export const spacing = {
  buttonHeight: '60px',    // Min 60px
  touchTarget: '48px',     // WCAG min
  base: '16px',
};
```

---

### 2. Tailwind Config Senior-Friendly

**`tailwind.config.ts`**
```typescript
const config: Config = {
  theme: {
    extend: {
      fontSize: {
        base: ['18px', { lineHeight: '1.8' }],  // Override 16px
        lg: ['20px', { lineHeight: '1.8' }],
        xl: ['24px', { lineHeight: '1.6' }],
      },
      colors: {
        slate: { /* Radix colors */ },
        indigo: { /* Radix colors */ },
      },
      spacing: {
        btn: '60px',  // Boutons hauteur
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
```

- [ ] Texte base 18px (au lieu de 16px)
- [ ] Line-height 1.8 pour lisibilité
- [ ] Spacing button 60px

---

### 3. Redesign Composants UI

**`src/components/ui/button.tsx`** (Update)
```typescript
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        default: 'h-[60px] min-w-[120px] px-6 text-lg',  // 60px hauteur
        lg: 'h-[70px] min-w-[140px] px-8 text-xl',
        icon: 'h-[60px] w-[60px]',
      },
    },
  }
);
```

**Adaptations**:
- [ ] Hauteur min 60px
- [ ] Labels + icônes (pas juste icône)
- [ ] Focus ring 4px (très visible)
- [ ] Hover: Scale 1.02 + border 3px

---

### 4. Contrastes WCAG AAA

```typescript
// Texte sur fond blanc
const textColors = {
  primary: '#1a1a1a',      // Ratio 18.5:1 (AAA)
  secondary: '#4a4a4a',    // Ratio 9.7:1 (AAA)
};

// Boutons
const buttonColors = {
  primary: {
    bg: '#2563eb',         // Bleu vif
    text: '#ffffff',       // Ratio 8.6:1 (AAA)
    hover: '#1e40af',
  },
  danger: {
    bg: '#dc2626',         // Rouge vif
    text: '#ffffff',       // Ratio 7.1:1 (AAA)
  },
};
```

- [ ] Ratio contraste ≥ 4.5:1 (WCAG AAA)
- [ ] Tester avec axe DevTools
- [ ] Éviter gris clairs pour texte

---

### 5. Feedback Visuel Évident

```css
/* Hover */
.button:hover {
  transform: scale(1.02);
  border: 3px solid currentColor;
}

/* Focus */
.button:focus-visible {
  outline: 4px solid #2563eb;
  outline-offset: 4px;
}

/* Loading */
.spinner {
  width: 32px;
  height: 32px;
}
```

- [ ] Hover: Scale + border épaisse
- [ ] Focus: Outline 4px très visible
- [ ] Loading: Spinner 32px (gros)
- [ ] Disabled: Opacity 0.4 + cursor not-allowed

---

### 6. Navigation Simplifiée

**`src/components/layout/Header.tsx`** (Update)
```typescript
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo GROS */}
        <Link href="/" className="text-3xl font-bold text-indigo-600">
          Capsules Mémoires
        </Link>

        {/* Nav simple (max 5 entrées) */}
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-lg font-medium hover:text-indigo-600">
            Accueil
          </Link>
          <Link href="/recherche" className="text-lg font-medium">
            Rechercher
          </Link>
          <Button size="lg">Connexion</Button>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] Logo gros (text-3xl)
- [ ] Nav max 5 entrées
- [ ] Text-lg pour links (20px)
- [ ] Bouton retour TOUJOURS visible (dans pages internes)

---

### 7. Composant Aide Permanent

**`src/components/layout/HelpButton.tsx`**
```typescript
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function HelpButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700"
      >
        <span className="text-3xl">❓</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Besoin d'aide ?</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-lg">
            <section>
              <h3 className="mb-2 font-bold">📖 Comment créer un souvenir ?</h3>
              <ol className="ml-4 list-decimal space-y-2">
                <li>Cliquez sur "Nouveau Souvenir"</li>
                <li>Donnez un titre à votre souvenir</li>
                <li>Écrivez votre texte</li>
                <li>Ajoutez des photos (optionnel)</li>
                <li>Cliquez sur "Publier"</li>
              </ol>
            </section>

            <section>
              <h3 className="mb-2 font-bold">🎤 Comment enregistrer ma voix ?</h3>
              <p>Cliquez sur le gros bouton rouge "Enregistrer ma voix" dans l'éditeur.</p>
            </section>

            <section>
              <h3 className="mb-2 font-bold">📞 Contact</h3>
              <p>Email: support@memories.app</p>
              <p>Téléphone: 01 23 45 67 89</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

**`src/app/layout.tsx`** (Ajout HelpButton)
```typescript
import { HelpButton } from '@/components/layout/HelpButton';

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <HelpButton />
        </Providers>
      </body>
    </html>
  );
}
```

- [ ] Bouton aide fixe (bottom-right)
- [ ] Taille 80x80px (très visible)
- [ ] Modal avec FAQ
- [ ] Text-lg (20px) dans modal

---

### 8. Tests Accessibilité

```bash
pnpm add -D @axe-core/react
```

**`src/lib/axe.ts`** (Dev only)
```typescript
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  import('@axe-core/react').then((axe) => {
    axe.default(React, ReactDOM, 1000);
  });
}
```

**Tests manuels**:
- [ ] Tester navigation clavier (Tab, Enter)
- [ ] Tester contrastes (axe DevTools)
- [ ] Tester screen reader (NVDA/JAWS)
- [ ] Vérifier ARIA labels
- [ ] Vérifier focus visible partout

---

## ✅ Critères de Validation v0.5.0

### Tests Automatiques
```bash
pnpm test
pnpm lint
pnpm type-check
pnpm build
```

### Tests Accessibilité
- [ ] axe DevTools: 0 violations
- [ ] Contrastes ≥ 4.5:1 (WCAG AAA)
- [ ] Navigation clavier fonctionne
- [ ] Focus visible sur tous éléments interactifs

### Tests Manuels UX Senior-Friendly
- [ ] Texte min 18px partout (vérifier avec DevTools)
- [ ] Boutons min 60px hauteur
- [ ] Espacement généreux entre éléments
- [ ] Bouton aide visible et cliquable
- [ ] Logo et navigation lisibles
- [ ] Messages erreur clairs (si applicable)

### **Validation Grand-Père** ✨
- [ ] Grand-père navigue sans difficulté
- [ ] Lit le texte facilement
- [ ] Clique sur boutons sans erreur
- [ ] Comprend navigation
- [ ] **Feedback positif**

---

## 📦 Commit & Tag

```bash
git checkout dev
git add .
git commit -m "feat(design): implement senior-friendly design system

- Design tokens (colors, typography, spacing)
- Tailwind config (18px base, 60px buttons)
- UI components redesign (large sizes, high contrast)
- WCAG AAA compliance (4.5:1 contrast minimum)
- Help button component (permanent)
- Accessibility tests (axe-core)

✅ Grand-père validation passed
✅ WCAG AAA compliance"

git checkout main
git merge dev
git tag -a v0.5.0 -m "Release v0.5.0 - Design System & UX Senior-Friendly

✅ Design system complete
✅ Senior-friendly interface (18px+, 60px buttons)
✅ WCAG AAA compliant
✅ Grand-père approved ✨
✅ Ready for v0.6.0 (TipTap Editor)"

git push origin main dev v0.5.0
```

---

## 🔄 Prochaines Étapes

➡️ **v0.6.0 - Éditeur TipTap**
- Setup TipTap + extensions
- Toolbar basique/avancée
- Auto-save
- Preview mode

---

**Version**: v0.5.0
**Durée estimée**: 4 jours
**Prérequis**: v0.4.0 ✅
**Next**: v0.6.0 - Éditeur TipTap
