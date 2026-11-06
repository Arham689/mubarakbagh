# mubarakbagh

Website for **Mubarak Bagh**, traditional Indian couture for women (sarees, lehengas, bridal).
This repo contains five full-page layout concepts that you switch between using the tab bar at the bottom of the page.

## Run it

```bash
nvm use          # uses Node 22 from .nvmrc (Node 18 will NOT work with Tailwind 4)
npm install
npm run dev      # http://localhost:3000
```

Link straight to a template with a hash: `/#rajwada`, `/#zari`, `/#jharokha`, `/#mehfil`, `/#noor`.

## The templates

| Tab | Concept | Signature interactions |
|---|---|---|
| **Rajwada** | Editorial maison (Maison Alaïa, Dior style) | Arch frame opens to full-bleed on scroll, letter-rise wordmark, scroll-lit manifesto, sticky split chapters, pinned **horizontal-scroll** collection |
| **Zari 3D** | WebGL luxury | **Three.js silk drape** (custom shader) that ripples to the cursor, floating gold bangles, sparkles, count-up stats, **3D tilt + glare cards**, horizontal swatch library |
| **Jharokha** | Rajasthani palace minimalism | Arched window that expands to full screen, parallax arch triptych, **drag-to-explore** lookbook with progress bar, curtain-reveal gallery |
| **Mehfil** | Modern boutique | Staggered **bento** entrance, **sticky stacking cards**, cursor-follow image preview on the collection index, magnetic CTA |
| **Noor** | Dark museum gallery | Cursor **spotlight** reveal hero, **scroll-driven 3D carousel ring**, clip-path wipe reveals |

All templates are mobile-friendly. On touch devices, cursor effects (tilt, magnetic pull, image preview) switch off or change: the spotlight and silk ripple move on their own, and the index list shows inline thumbnails. The WebGL scene renders fewer polygons and at lower resolution on phones.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS 4
- [Motion](https://motion.dev): animations, scroll-linked transforms, drag, layout
- [Lenis](https://lenis.dev): smooth scrolling (`components/SmoothScroll.tsx`)
- three.js + @react-three/fiber + drei: 3D in the Zari tab

## Where things live

```
app/page.tsx                 tab switcher (template list, names, concept notes)
components/TemplateTabs.tsx  the bottom tab bar
components/ui/motion-kit.tsx reusable effects: RevealText, HorizontalScroll, TiltCard,
                             Magnetic, Marquee, Parallax, CountUp, CurtainReveal …
components/three/SilkScene.tsx  WebGL silk + bangles
templates/*.tsx              one file per layout concept
lib/images.ts                every image in one place, swap here
```

## Images

All photos are free-license images from [Unsplash](https://unsplash.com), listed in `lib/images.ts`.
To change a photo, open it on Unsplash, right-click → *Copy image address*, and paste the `photo-…` id into that file.
Replace them with your own product photography before launch.

Photographers: shades by 43, Dhruv Vishwakarma, Sabesh Photography, Bulbul Ahmed, Bella Pon Fruitsia,
The Behruz Theory, SAREE GHAR, Morni Saree, Royal Photography, Abhishek Sharma, Alok Verma, Aayush Rawat,
Harsh Gupta, Gurpreet Singh, Raúl Mermans García, Urvi Kotasthane, The Metropolitan Museum of Art,
Roberto Reposo, Aditya Siva, Mayur Sable, Jayanth Muppaneni, Tony Sebastian, Johan Mouchet, Pradheep Rajendirane.
