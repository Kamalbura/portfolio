# Helios Protocol · Final Mandate Checklist

## Performance (≥95 Lighthouse)
- [ ] Run Lighthouse on production build; Performance/Accessibility/Best Practices/SEO all score ≥95.
- [ ] All hero and project imagery optimized (Next `<Image>` sizing, modern formats, explicit width hints).
- [ ] Heavy scenes (R3F, GSAP timelines) lazy loaded or dynamically imported where appropriate.
- [ ] Execute `ANALYZE=true npm run build` to inspect bundles and confirm no unexpected bloat.

## Accessibility (WCAG 2.1 AA)
- [ ] `prefers-reduced-motion` respected for all major timelines and gestures.
- [ ] Keyboard navigation verified: Tab/Shift+Tab reach all interactive elements with visible focus states.
- [ ] Semantic structure audited (landmarks, heading order, descriptive `aria-label`s, alt text on imagery).
- [ ] Color contrast ratios ≥4.5:1 for body text and ≥3:1 for large text/UI accents.

## Responsiveness
- [ ] 320px viewport: layouts readable, choreography gracefully reduced, no horizontal scroll.
- [ ] 768px viewport: touch targets ≥44px, magnetic/cursor effects degrade gracefully on touch.
- [ ] 1280px viewport: full parallax and pinning remain smooth.
- [ ] ≥2560px viewport: typography and hero canvas scale cleanly without artifacting.
