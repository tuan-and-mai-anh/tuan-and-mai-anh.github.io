# Mai Anh & Anh Tuan's Wedding Website

A responsive, static wedding website for December 24, 2026 in Hanoi, Vietnam.

## Preview locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. The root path is always the language selector; the complete sites are available at `/en/` and `/vn/`.

## Language routes

- `/` is a lightweight English/Tiếng Việt selector with no JavaScript, video, gallery, or music initialization.
- `/en/` contains the complete English site.
- `/vn/` contains the complete Vietnamese site.
- Both full sites share `/styles.css`, `/script.js`, and the single asset library under `/assets/`.
- The selector uses the couple's supplied Eiffel Tower portrait in responsive 480 px and 680 px WebP files, with JPEG fallbacks. Its bilingual-neutral alt text identifies the couple, Paris, and the Eiffel Tower.

## Publishing

The project has no build step and can be hosted directly with GitHub Pages, Netlify, Cloudflare Pages, or any static web host.

## Content notes

- RSVP buttons link directly to the couple's language-specific Fillout forms in a new tab; no form embeds or scripts are included.
- The calendar download stores the 2:30 PM Hanoi welcome time in UTC for broad calendar compatibility.
- No analytics, third-party form embeds, or tracking scripts are included.

## Music

- “Our song” uses the official YouTube IFrame API and privacy-enhanced `youtube-nocookie.com` player for video `hiI_f9hsC7I`; no audio is downloaded or hosted here.
- The first genuine click/tap or trusted scroll gesture attempts playback once. Passive wheel, pointer/touch movement, and scroll-fallback listeners remove themselves after the attempt, while a persistent Play/Pause control and status message remain available when browser autoplay policies block it.
- Starting the song pauses the pre-wedding film, and starting the film pauses the song so their audio does not compete.

## Video

- The hero uses a boundary-aligned 14.56-second excerpt from `teaser.MA_AT.h26510bit.mov` (00:05.08–00:19.64). Frame inspection selected the first stable image after the blur at 00:05 and the nearest clean cut before 00:20.
- Web outputs are 1280×720, silent, 25 fps: H.264 MP4 (~2.37 MB) and VP9 WebM (~1.72 MB), with a 1600×900 JPEG poster from 00:12.36 (~0.08 MB).
- The background loop is muted, inline, and paused when the page is hidden. Visitors who prefer reduced motion see the poster instead.
- The full film is embedded lazily from YouTube using the privacy-enhanced `youtube-nocookie.com` domain: `https://www.youtube.com/watch?v=zc-idmSZ0Js`.

## Curated photo selection

The “Our love story” visual uses `PreWeddingA&T-71.jpg`.

The gallery uses the following 60 unique images from the couple's authorized pre-wedding list, in this exact order. The first 20 are visible initially; the remaining 40 are revealed with the “View all” control. The selection balances Louvre, café, flower-shop, street, Seine, Eiffel Tower, garden, and formal architectural settings; portrait and landscape compositions; white, red/black, and wedding outfits; and candid, playful, editorial, detail, and intimate moments. Twelve wide layout features keep every desktop and mobile grid row balanced, while the lightbox always displays the complete uncropped image.

Subject counts: 52 couple photos, 4 bride-only portraits (positions 11, 17, 37, and 39: `PreWeddingA&T-89.jpg`, `PreWeddingA&T-152.jpg`, `PreWeddingA&T-104.jpg`, and `PreWeddingA&T-124.jpg`), and 4 groom-only portraits (positions 2, 13, 23, and 34: `PreWeddingA&T-10.jpg`, `PreWeddingA&T-109.jpg`, `PreWeddingA&T-44.jpg`, and `PreWeddingA&T-82.jpg`). `PreWeddingA&T-71.jpg` is deliberately excluded because it is the story visual; `PreWeddingA&T-139.jpg`, which is used as the page's social-sharing image, is also excluded from the gallery.

- `PreWeddingA&T-5.jpg`
- `PreWeddingA&T-10.jpg`
- `PreWeddingA&T-80.jpg`
- `PreWeddingA&T-18.jpg`
- `PreWeddingA&T-26.jpg`
- `PreWeddingA&T-180.jpg`
- `PreWeddingA&T-34.jpg`
- `PreWeddingA&T-40.jpg`
- `PreWeddingA&T-192.jpg`
- `PreWeddingA&T-54.jpg`
- `PreWeddingA&T-89.jpg`
- `PreWeddingA&T-100.jpg`
- `PreWeddingA&T-109.jpg`
- `PreWeddingA&T-127.jpg`
- `PreWeddingA&T-160.jpg`
- `PreWeddingA&T-151.jpg`
- `PreWeddingA&T-152.jpg`
- `PreWeddingA&T-197.jpg`
- `PreWeddingA&T-14.jpg`
- `PreWeddingA&T-1.jpg`
- `PreWeddingA&T-22.jpg`
- `PreWeddingA&T-36.jpg`
- `PreWeddingA&T-44.jpg`
- `PreWeddingA&T-53.jpg`
- `PreWeddingA&T-75.jpg`
- `PreWeddingA&T-58.jpg`
- `PreWeddingA&T-61.jpg`
- `PreWeddingA&T-136.jpg`
- `PreWeddingA&T-65.jpg`
- `PreWeddingA&T-66.jpg`
- `PreWeddingA&T-68.jpg`
- `PreWeddingA&T-72.jpg`
- `PreWeddingA&T-77.jpg`
- `PreWeddingA&T-82.jpg`
- `PreWeddingA&T-91.jpg`
- `PreWeddingA&T-95.jpg`
- `PreWeddingA&T-104.jpg`
- `PreWeddingA&T-114.jpg`
- `PreWeddingA&T-124.jpg`
- `PreWeddingA&T-116.jpg`
- `PreWeddingA&T-144.jpg`
- `PreWeddingA&T-158.jpg`
- `PreWeddingA&T-162.jpg`
- `PreWeddingA&T-166.jpg`
- `PreWeddingA&T-174.jpg`
- `PreWeddingA&T-181.jpg`
- `PreWeddingA&T-175.jpg`
- `PreWeddingA&T-196.jpg`
- `PreWeddingA&T-193.jpg`
- `PreWeddingA&T-13.jpg`
- `PreWeddingA&T-16.jpg`
- `PreWeddingA&T-19.jpg`
- `PreWeddingA&T-47.jpg`
- `PreWeddingA&T-55.jpg`
- `PreWeddingA&T-56.jpg`
- `PreWeddingA&T-88.jpg`
- `PreWeddingA&T-92.jpg`
- `PreWeddingA&T-99.jpg`
- `PreWeddingA&T-195.jpg`
- `PreWeddingA&T-194.jpg`

Each gallery image has a web-optimized full version (maximum 2,200 pixels) and a lazy-loaded thumbnail (maximum 720 pixels), using progressive JPEG or WebP assets with metadata stripped during conversion. The story image keeps only its full-size asset.
