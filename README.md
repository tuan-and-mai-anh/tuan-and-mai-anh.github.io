# Mai Anh & Anh Tuan's Wedding Website

A responsive, static wedding website for December 24, 2026 in Hanoi, Vietnam.

## Preview locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Publishing

The project has no build step and can be hosted directly with GitHub Pages, Netlify, Cloudflare Pages, or any static web host.

## Content notes

- RSVP is intentionally marked “coming soon” until the couple supplies their Fillout form ID. No previous-couple form URL or integration is included.
- The calendar download stores the 2:30 PM Hanoi welcome time in UTC for broad calendar compatibility.
- No analytics, third-party form embeds, or tracking scripts are included.

## Video

- The hero uses an eight-second excerpt from `teaser.MA_AT.h26510bit.mov` (approximately 00:51.5–00:59.5), selected for its cohesive sequence of the couple walking together by the Seine.
- Web outputs are 1280×720, silent, 25 fps: H.264 MP4 (~1.3 MB) and VP9 WebM (~1.0 MB), with a 1600×900 JPEG poster.
- The background loop is muted, inline, and paused when the page is hidden. Visitors who prefer reduced motion see the poster instead.
- The full film is embedded lazily from YouTube using the privacy-enhanced `youtube-nocookie.com` domain: `https://www.youtube.com/watch?v=zc-idmSZ0Js`.

## Curated photo selection

The “years, coast to coast” story visual uses `PreWeddingA&T-71.jpg`.

The gallery uses the following 20 different images from the couple's authorized pre-wedding list. The set balances Louvre, café, street, Seine, Eiffel Tower, and formal architectural settings; portrait and landscape compositions; white, red/black, and wedding outfits; and candid, playful, editorial, and intimate moments. Bride-only portraits are positions 9 (`PreWeddingA&T-89.jpg`) and 18 (`PreWeddingA&T-152.jpg`); groom-only portraits are positions 2 (`PreWeddingA&T-10.jpg`) and 12 (`PreWeddingA&T-109.jpg`). The remaining 16 images show the couple. The final desktop row combines a portrait, a landscape, and a portrait so it fills the four-column grid without a singleton.

- `PreWeddingA&T-5.jpg`
- `PreWeddingA&T-10.jpg`
- `PreWeddingA&T-18.jpg`
- `PreWeddingA&T-26.jpg`
- `PreWeddingA&T-34.jpg`
- `PreWeddingA&T-40.jpg`
- `PreWeddingA&T-54.jpg`
- `PreWeddingA&T-63.jpg`
- `PreWeddingA&T-89.jpg`
- `PreWeddingA&T-80.jpg`
- `PreWeddingA&T-100.jpg`
- `PreWeddingA&T-109.jpg`
- `PreWeddingA&T-127.jpg`
- `PreWeddingA&T-139.jpg`
- `PreWeddingA&T-151.jpg`
- `PreWeddingA&T-160.jpg`
- `PreWeddingA&T-192.jpg`
- `PreWeddingA&T-152.jpg`
- `PreWeddingA&T-180.jpg`
- `PreWeddingA&T-197.jpg`

Each gallery image has a web-optimized full version (maximum 2,200 pixels, progressive JPEG) and a lazy-loaded thumbnail (maximum 720 pixels). The story image keeps only its full-size asset. Metadata is stripped during conversion.
