const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const mobileMenuMedia = window.matchMedia("(max-width: 800px)");
const pageRegions = [document.querySelector("main"), document.querySelector("footer")];

function updateHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 24);
}

function closeMenu(returnFocus = false) {
  menuButton?.setAttribute("aria-expanded", "false");
  navigation?.classList.remove("open");
  document.body.style.overflow = "";
  pageRegions.forEach((region) => {
    if (region) region.inert = false;
  });
  if (returnFocus) menuButton?.focus();
}

menuButton?.addEventListener("click", () => {
  const willOpen = menuButton.getAttribute("aria-expanded") !== "true";

  if (!willOpen) {
    closeMenu();
    return;
  }

  menuButton.setAttribute("aria-expanded", "true");
  navigation?.classList.add("open");
  document.body.style.overflow = "hidden";
  pageRegions.forEach((region) => {
    if (region) region.inert = true;
  });
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => closeMenu());
});

mobileMenuMedia.addEventListener?.("change", (event) => {
  if (!event.matches) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (menuButton?.getAttribute("aria-expanded") !== "true") return;

  if (event.key === "Escape") {
    closeMenu(true);
    return;
  }

  if (event.key !== "Tab") return;
  const focusable = [document.querySelector(".wordmark"), menuButton, ...navigation.querySelectorAll("a")].filter(Boolean);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const heroVideo = document.querySelector(".hero-video");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function updateHeroPlayback() {
  if (!heroVideo) return;

  if (reducedMotion.matches || document.hidden) {
    heroVideo.pause();
    return;
  }

  heroVideo.play().catch(() => {
    // The poster remains visible if a browser blocks background autoplay.
  });
}

reducedMotion.addEventListener?.("change", updateHeroPlayback);
document.addEventListener("visibilitychange", updateHeroPlayback);
updateHeroPlayback();

const weddingTime = new Date("2026-12-24T15:00:00+07:00").getTime();
const countdownFields = {
  days: document.querySelector('[data-count="days"]'),
  hours: document.querySelector('[data-count="hours"]'),
  minutes: document.querySelector('[data-count="minutes"]'),
  seconds: document.querySelector('[data-count="seconds"]'),
};

function updateCountdown() {
  const remaining = Math.max(0, weddingTime - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);

  countdownFields.days.textContent = String(Math.floor(totalSeconds / 86400));
  countdownFields.hours.textContent = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, "0");
  countdownFields.minutes.textContent = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  countdownFields.seconds.textContent = String(totalSeconds % 60).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

document.querySelectorAll(".accordion details").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;

    document.querySelectorAll(".accordion details").forEach((otherItem) => {
      if (otherItem !== item) otherItem.removeAttribute("open");
    });
  });
});

const galleryPhotos = [
  { number: 5, alt: "Mai Anh and Anh Tuan walking hand in hand in front of the Louvre pyramid" },
  { number: 10, alt: "Anh Tuan in a white suit on the steps of the Louvre" },
  { number: 18, alt: "Mai Anh and Anh Tuan sharing a quiet moment beneath a veil" },
  { number: 26, alt: "Mai Anh and Anh Tuan holding hands beneath the Louvre colonnade" },
  { number: 34, alt: "Mai Anh and Anh Tuan holding hands and walking through Paris" },
  { number: 40, alt: "Mai Anh and Anh Tuan in white outfits and sunglasses" },
  { number: 54, alt: "Mai Anh and Anh Tuan strolling near the Eiffel Tower" },
  { number: 63, alt: "Mai Anh and Anh Tuan outside a Parisian cafe" },
  { number: 89, alt: "Mai Anh posing alone in a red dress outside Au Bon Accueil" },
  { number: 80, alt: "Mai Anh and Anh Tuan seated together in a black and white portrait", landscape: true },
  { number: 100, alt: "Mai Anh and Anh Tuan posing playfully in red and black" },
  { number: 109, alt: "Anh Tuan in a black tuxedo with the Eiffel Tower behind him" },
  { number: 127, alt: "Mai Anh holding her bouquet with Anh Tuan beside her" },
  { number: 139, alt: "Mai Anh and Anh Tuan in wedding attire with the Eiffel Tower", landscape: true },
  { number: 151, alt: "Mai Anh and Anh Tuan together at an ornate Parisian entrance" },
  { number: 160, alt: "Mai Anh and Anh Tuan on the steps before a golden gate" },
  { number: 192, alt: "Mai Anh and Anh Tuan overlooking the Seine and Eiffel Tower at sunset", landscape: true },
  { number: 152, alt: "Mai Anh in a classic bridal portrait beneath her veil" },
  { number: 180, alt: "Mai Anh and Anh Tuan sharing a sunset moment above the Seine", landscape: true },
  { number: 197, alt: "Mai Anh and Anh Tuan together at sunset with the Eiffel Tower" },
];

const galleryGrid = document.querySelector("#gallery-grid");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxCaption = lightbox?.querySelector("figcaption");
let activePhotoIndex = 0;

function photoUrl(size, number) {
  return `assets/photos/prewedding/${size}/PreWeddingA%26T-${number}.jpg`;
}

function showPhoto(index) {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;

  activePhotoIndex = (index + galleryPhotos.length) % galleryPhotos.length;
  const photo = galleryPhotos[activePhotoIndex];
  lightboxImage.src = photoUrl("full", photo.number);
  lightboxImage.alt = photo.alt;
  lightboxCaption.textContent = `${activePhotoIndex + 1} / ${galleryPhotos.length}`;

  if (!lightbox.open) lightbox.showModal();
}

galleryPhotos.forEach((photo, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `gallery-item${photo.landscape ? " landscape" : ""}`;
  button.setAttribute("aria-label", `Open photo ${index + 1} of ${galleryPhotos.length}`);

  const image = document.createElement("img");
  image.src = photoUrl("thumbs", photo.number);
  image.alt = photo.alt;
  image.loading = "lazy";
  image.decoding = "async";
  image.width = photo.landscape ? 720 : 540;
  image.height = photo.landscape ? 480 : 720;
  button.appendChild(image);
  button.addEventListener("click", () => showPhoto(index));
  galleryGrid?.appendChild(button);
});

lightbox?.querySelector(".lightbox-close")?.addEventListener("click", () => lightbox.close());
lightbox?.querySelector(".lightbox-prev")?.addEventListener("click", () => showPhoto(activePhotoIndex - 1));
lightbox?.querySelector(".lightbox-next")?.addEventListener("click", () => showPhoto(activePhotoIndex + 1));
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox?.open) return;
  if (event.key === "ArrowLeft") showPhoto(activePhotoIndex - 1);
  if (event.key === "ArrowRight") showPhoto(activePhotoIndex + 1);
});

document.querySelector("#calendar-button")?.addEventListener("click", () => {
  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mai Anh and Anh Tuan//Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:20261224-wedding@maianh-anhtuan",
    "DTSTAMP:20260809T000000Z",
    "DTSTART:20261224T073000Z",
    "DTEND:20261224T150000Z",
    "SUMMARY:Mai Anh & Anh Tuan's Wedding",
    "DESCRIPTION:Welcome at 2:30 PM, ceremony at 3:00 PM, reception at 5:30 PM, and after party at 8:30 PM.",
    "LOCATION:Sheraton Hanoi Hotel\\, Hanoi\\, Vietnam",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([calendar], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "mai-anh-and-anh-tuan-wedding.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
});
