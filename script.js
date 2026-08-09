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

const songToggle = document.querySelector("#song-toggle");
const songToggleIcon = songToggle?.querySelector(".song-toggle-icon");
const songToggleLabel = songToggle?.querySelector("[data-song-label]");
const songStatus = document.querySelector("#song-status");
const filmIframe = document.querySelector("#film-player");
let songPlayer;
let filmPlayer;
let songPlayerReady = false;
let filmPlayerReady = false;
let firstClickRequestedPlayback = false;
let playbackStatusTimer;
let scrollPlaybackAttempted = false;
let scrollPointerStart;
let scrollTouchStart;
let trustedScrollGesturePending = false;

const passiveCaptureOptions = { capture: true, passive: true };
const passiveOptions = { passive: true };

function setSongStatus(message) {
  if (songStatus) songStatus.textContent = message;
}

function setSongControlPlaying(isPlaying) {
  songToggle?.setAttribute("aria-pressed", String(isPlaying));
  songToggle?.setAttribute("aria-label", isPlaying ? "Pause Our song" : "Play Our song");
  if (songToggleIcon) songToggleIcon.textContent = isPlaying ? "Ⅱ" : "▶";
  if (songToggleLabel) songToggleLabel.textContent = isPlaying ? "Pause music" : "Play music";
}

function clearPlaybackStatusTimer() {
  if (playbackStatusTimer) window.clearTimeout(playbackStatusTimer);
  playbackStatusTimer = undefined;
}

function pauseFilmIfPlaying() {
  if (!filmPlayerReady || !window.YT) return;
  const state = filmPlayer.getPlayerState();
  if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING) {
    filmPlayer.pauseVideo();
  }
}

function attemptSongPlayback() {
  if (!songPlayerReady) {
    setSongStatus("Music will start when the player is ready. The Play button will remain available.");
    return;
  }

  try {
    pauseFilmIfPlaying();
    songPlayer.unMute();
    songPlayer.setVolume(70);
    songPlayer.playVideo();
    setSongStatus("Starting Our song…");
    clearPlaybackStatusTimer();
    playbackStatusTimer = window.setTimeout(() => {
      if (songPlayer.getPlayerState() !== YT.PlayerState.PLAYING) {
        setSongControlPlaying(false);
        setSongStatus("Playback was blocked. Select Play music to try again.");
      }
    }, 2500);
  } catch {
    setSongControlPlaying(false);
    setSongStatus("Playback could not start. Select Play music to try again.");
  }
}

function handleFirstGuestClick(event) {
  if (!event.isTrusted || event.detail === 0 || (typeof event.button === "number" && event.button !== 0)) return;
  document.removeEventListener("click", handleFirstGuestClick, true);
  firstClickRequestedPlayback = true;
  attemptSongPlayback();
}

document.addEventListener("click", handleFirstGuestClick, true);

function removeScrollPlaybackListeners() {
  document.removeEventListener("wheel", handleScrollPlaybackGesture, passiveCaptureOptions);
  document.removeEventListener("pointerdown", handleScrollPointerStart, passiveCaptureOptions);
  document.removeEventListener("pointermove", handleScrollPointerMove, passiveCaptureOptions);
  document.removeEventListener("pointercancel", clearScrollPointer, passiveCaptureOptions);
  document.removeEventListener("pointerup", clearScrollPointer, passiveCaptureOptions);
  document.removeEventListener("touchstart", handleScrollTouchStart, passiveCaptureOptions);
  document.removeEventListener("touchmove", handleScrollTouchMove, passiveCaptureOptions);
  document.removeEventListener("touchcancel", clearScrollTouch, passiveCaptureOptions);
  document.removeEventListener("touchend", clearScrollTouch, passiveCaptureOptions);
  window.removeEventListener("scroll", handleScrollFallback, passiveOptions);
}

function requestSongFromScroll(event) {
  if (scrollPlaybackAttempted || !event.isTrusted) return;
  scrollPlaybackAttempted = true;
  removeScrollPlaybackListeners();
  firstClickRequestedPlayback = true;
  attemptSongPlayback();
}

function handleScrollPlaybackGesture(event) {
  requestSongFromScroll(event);
}

function handleScrollPointerStart(event) {
  if (!event.isTrusted || event.isPrimary === false) return;
  if (event.pointerType === "mouse" && event.button !== 0) return;
  trustedScrollGesturePending = true;
  scrollPointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
}

function handleScrollPointerMove(event) {
  if (!event.isTrusted || !scrollPointerStart || event.pointerId !== scrollPointerStart.id) return;
  const horizontalDistance = Math.abs(event.clientX - scrollPointerStart.x);
  const verticalDistance = Math.abs(event.clientY - scrollPointerStart.y);
  if (verticalDistance >= 8 && verticalDistance > horizontalDistance) requestSongFromScroll(event);
}

function clearScrollPointer(event) {
  if (!scrollPointerStart || event.pointerId === scrollPointerStart.id) scrollPointerStart = undefined;
  trustedScrollGesturePending = false;
}

function handleScrollTouchStart(event) {
  if (!event.isTrusted || event.touches.length !== 1) return;
  const touch = event.touches[0];
  trustedScrollGesturePending = true;
  scrollTouchStart = { x: touch.clientX, y: touch.clientY };
}

function handleScrollTouchMove(event) {
  if (!event.isTrusted || !scrollTouchStart || event.touches.length !== 1) return;
  const touch = event.touches[0];
  const horizontalDistance = Math.abs(touch.clientX - scrollTouchStart.x);
  const verticalDistance = Math.abs(touch.clientY - scrollTouchStart.y);
  if (verticalDistance >= 8 && verticalDistance > horizontalDistance) requestSongFromScroll(event);
}

function clearScrollTouch() {
  scrollTouchStart = undefined;
  trustedScrollGesturePending = false;
}

function handleScrollFallback(event) {
  if (trustedScrollGesturePending) requestSongFromScroll(event);
}

document.addEventListener("wheel", handleScrollPlaybackGesture, passiveCaptureOptions);
document.addEventListener("pointerdown", handleScrollPointerStart, passiveCaptureOptions);
document.addEventListener("pointermove", handleScrollPointerMove, passiveCaptureOptions);
document.addEventListener("pointercancel", clearScrollPointer, passiveCaptureOptions);
document.addEventListener("pointerup", clearScrollPointer, passiveCaptureOptions);
document.addEventListener("touchstart", handleScrollTouchStart, passiveCaptureOptions);
document.addEventListener("touchmove", handleScrollTouchMove, passiveCaptureOptions);
document.addEventListener("touchcancel", clearScrollTouch, passiveCaptureOptions);
document.addEventListener("touchend", clearScrollTouch, passiveCaptureOptions);
window.addEventListener("scroll", handleScrollFallback, passiveOptions);

songToggle?.addEventListener("click", () => {
  if (!songPlayerReady) {
    setSongStatus("The music player is still loading. Please try again in a moment.");
    return;
  }

  if (songPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
    songPlayer.pauseVideo();
  } else {
    attemptSongPlayback();
  }
});

function handleSongStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    clearPlaybackStatusTimer();
    document.removeEventListener("click", handleFirstGuestClick, true);
    removeScrollPlaybackListeners();
    setSongControlPlaying(true);
    setSongStatus("Our song is playing.");
    pauseFilmIfPlaying();
  } else if (event.data === YT.PlayerState.PAUSED) {
    clearPlaybackStatusTimer();
    setSongControlPlaying(false);
    setSongStatus("Music paused.");
  } else if (event.data === YT.PlayerState.ENDED) {
    clearPlaybackStatusTimer();
    setSongControlPlaying(false);
    setSongStatus("Our song has ended. Select Play music to hear it again.");
  } else if (event.data === YT.PlayerState.BUFFERING) {
    setSongStatus("Starting Our song…");
  }
}

function initializeYouTubePlayers() {
  songPlayer = new YT.Player("song-player", {
    width: 640,
    height: 360,
    videoId: "hiI_f9hsC7I",
    host: "https://www.youtube-nocookie.com",
    playerVars: {
      autoplay: 0,
      controls: 1,
      playsinline: 1,
      rel: 0,
      origin: window.location.origin,
    },
    events: {
      onReady: (event) => {
        songPlayerReady = true;
        songToggle.disabled = false;
        event.target.getIframe().title = "Our song — YouTube player";
        setSongStatus("Ready to play Our song.");
        if (firstClickRequestedPlayback) attemptSongPlayback();
      },
      onStateChange: handleSongStateChange,
      onError: () => {
        clearPlaybackStatusTimer();
        songToggle.disabled = true;
        setSongControlPlaying(false);
        setSongStatus("The music player is unavailable. Use the YouTube link to listen.");
      },
    },
  });

  if (filmIframe) {
    filmPlayer = new YT.Player(filmIframe, {
      events: {
        onReady: (event) => {
          filmPlayerReady = true;
          event.target.getIframe().title = "Mai Anh and Anh Tuan's pre-wedding film";
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING && songPlayerReady) {
            const songState = songPlayer.getPlayerState();
            if (songState === YT.PlayerState.PLAYING || songState === YT.PlayerState.BUFFERING) {
              songPlayer.pauseVideo();
            }
          }
        },
      },
    });
  }
}

window.onYouTubeIframeAPIReady = initializeYouTubePlayers;
const youtubeApiScript = document.createElement("script");
youtubeApiScript.src = "https://www.youtube.com/iframe_api";
youtubeApiScript.async = true;
youtubeApiScript.addEventListener("error", () => {
  songToggle.disabled = true;
  setSongStatus("The music player could not load. Use the YouTube link to listen.");
});
document.head.appendChild(youtubeApiScript);

document.addEventListener("visibilitychange", () => {
  if (!document.hidden || !window.YT) return;
  if (songPlayerReady && songPlayer.getPlayerState() === YT.PlayerState.PLAYING) songPlayer.pauseVideo();
  if (filmPlayerReady && filmPlayer.getPlayerState() === YT.PlayerState.PLAYING) filmPlayer.pauseVideo();
});

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
  { number: 80, alt: "Mai Anh and Anh Tuan seated together with the Eiffel Tower behind them", wide: true },
  { number: 18, alt: "Mai Anh and Anh Tuan sharing a quiet moment beneath a veil" },
  { number: 26, alt: "Mai Anh and Anh Tuan holding hands beneath the Louvre colonnade" },
  { number: 180, alt: "Mai Anh and Anh Tuan sharing a sunset moment above the Seine", wide: true },
  { number: 34, alt: "Mai Anh and Anh Tuan holding hands and walking through Paris" },
  { number: 40, alt: "Mai Anh and Anh Tuan in white outfits and sunglasses" },
  { number: 192, alt: "Mai Anh and Anh Tuan overlooking the Seine and Eiffel Tower at sunset", wide: true },
  { number: 54, alt: "Mai Anh and Anh Tuan strolling near the Eiffel Tower" },
  { number: 63, alt: "Mai Anh and Anh Tuan outside a Parisian cafe" },
  { number: 89, alt: "Mai Anh posing alone in a red dress outside Au Bon Accueil" },
  { number: 100, alt: "Mai Anh and Anh Tuan posing playfully in red and black" },
  { number: 109, alt: "Anh Tuan in a black tuxedo with the Eiffel Tower behind him" },
  { number: 127, alt: "Mai Anh holding her bouquet with Anh Tuan beside her", wide: true },
  { number: 160, alt: "Mai Anh and Anh Tuan on the steps before a golden gate" },
  { number: 151, alt: "Mai Anh and Anh Tuan together at an ornate Parisian entrance" },
  { number: 152, alt: "Mai Anh in a classic bridal portrait beneath her veil" },
  { number: 197, alt: "Mai Anh and Anh Tuan together at sunset with the Eiffel Tower" },
  { number: 14, alt: "Mai Anh and Anh Tuan striding together on the Louvre steps" },
  { number: 1, alt: "Mai Anh and Anh Tuan walking toward the Louvre pyramid", wide: true },
  { number: 22, alt: "Mai Anh and Anh Tuan framed by sunlit Louvre columns" },
  { number: 36, alt: "Mai Anh and Anh Tuan walking through the Palais Royal courtyard" },
  { number: 44, alt: "Anh Tuan posing in sunglasses beside the Palais Royal columns" },
  { number: 53, alt: "Mai Anh and Anh Tuan beneath a Paris street sign" },
  { number: 75, alt: "Mai Anh and Anh Tuan standing together on a grand Paris boulevard", wide: true },
  { number: 58, alt: "Mai Anh and Anh Tuan sharing a playful moment by a Paris kiosk" },
  { number: 61, alt: "Mai Anh waving as she walks through Paris with Anh Tuan" },
  { number: 136, alt: "Mai Anh and Anh Tuan kissing on a terrace overlooking the Eiffel Tower", wide: true },
  { number: 65, alt: "Mai Anh and Anh Tuan kissing outside a flower-filled Paris shop" },
  { number: 66, alt: "Mai Anh and Anh Tuan walking along a shaded Paris lane" },
  { number: 68, alt: "Mai Anh and Anh Tuan walking past a Paris flower shop" },
  { number: 72, alt: "Mai Anh and Anh Tuan facing each other on a Paris street" },
  { number: 77, alt: "Mai Anh and Anh Tuan holding hands as they cross a Paris street" },
  { number: 82, alt: "Anh Tuan posing in a dark suit with the Eiffel Tower behind him" },
  { number: 91, alt: "Mai Anh and Anh Tuan laughing together near the Eiffel Tower" },
  { number: 95, alt: "Mai Anh and Anh Tuan holding hands beneath the Eiffel Tower" },
  { number: 104, alt: "Mai Anh posing alone in her wedding gown on an Eiffel Tower terrace" },
  { number: 114, alt: "Mai Anh and Anh Tuan sharing a black and white terrace portrait" },
  { number: 124, alt: "Mai Anh posing alone with her bouquet on a Paris terrace" },
  { number: 116, alt: "Mai Anh and Anh Tuan smiling together in wedding attire" },
  { number: 144, alt: "Mai Anh and Anh Tuan seated together with the Eiffel Tower behind them" },
  { number: 158, alt: "Mai Anh and Anh Tuan beneath an ornate stone arch" },
  { number: 162, alt: "Mai Anh and Anh Tuan standing together on a tree-lined lawn", wide: true },
  { number: 166, alt: "Mai Anh and Anh Tuan walking together in a black and white garden portrait" },
  { number: 174, alt: "Mai Anh and Anh Tuan holding hands beside her feathered wedding dress" },
  { number: 181, alt: "Mai Anh and Anh Tuan looking across the Seine in a black and white portrait", wide: true },
  { number: 175, alt: "Mai Anh and Anh Tuan posing in sunglasses at sunset" },
  { number: 196, alt: "Mai Anh and Anh Tuan touching hands above the Seine at sunset" },
  { number: 193, alt: "Mai Anh and Anh Tuan sharing a soft-focus sunset moment", wide: true },
];

const galleryGrid = document.querySelector("#gallery-grid");
const galleryToggle = document.querySelector("#gallery-toggle");
const galleryStatus = document.querySelector("#gallery-status");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxCaption = lightbox?.querySelector("figcaption");
const initiallyVisiblePhotos = 20;
const landscapePhotoNumbers = new Set([80, 180, 181]);
const twoByThreePhotoNumbers = new Set([5, 22, 53, 82, 91, 144]);
let activePhotoIndex = 0;
let touchStartX = 0;
let touchStartY = 0;

function photoUrl(size, number) {
  return `assets/photos/prewedding/${size}/PreWeddingA%26T-${number}.jpg`;
}

function photoDimensions(size, number) {
  if (landscapePhotoNumbers.has(number)) return size === "full" ? [2200, 1467] : [720, 480];
  if (twoByThreePhotoNumbers.has(number)) return size === "full" ? [1467, 2200] : [480, 720];
  return size === "full" ? [1650, 2200] : [540, 720];
}

function showPhoto(index) {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;

  activePhotoIndex = (index + galleryPhotos.length) % galleryPhotos.length;
  const photo = galleryPhotos[activePhotoIndex];
  const [width, height] = photoDimensions("full", photo.number);
  lightboxImage.src = photoUrl("full", photo.number);
  lightboxImage.alt = photo.alt;
  lightboxImage.width = width;
  lightboxImage.height = height;
  lightboxCaption.textContent = `${activePhotoIndex + 1} / ${galleryPhotos.length}`;

  if (!lightbox.open) lightbox.showModal();

  [-1, 1].forEach((offset) => {
    const adjacentPhoto = galleryPhotos[(activePhotoIndex + offset + galleryPhotos.length) % galleryPhotos.length];
    const preload = new Image();
    preload.src = photoUrl("full", adjacentPhoto.number);
  });
}

galleryPhotos.forEach((photo, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `gallery-item${photo.wide ? " landscape" : ""}`;
  button.setAttribute("aria-label", `Open photo ${index + 1} of ${galleryPhotos.length}`);
  button.hidden = index >= initiallyVisiblePhotos;

  const image = document.createElement("img");
  const [width, height] = photoDimensions("thumbs", photo.number);
  const thumbnailUrl = photoUrl("thumbs", photo.number);
  if (index < initiallyVisiblePhotos) image.src = thumbnailUrl;
  else image.dataset.src = thumbnailUrl;
  image.alt = photo.alt;
  image.loading = "lazy";
  image.decoding = "async";
  image.width = width;
  image.height = height;
  button.appendChild(image);
  button.addEventListener("click", () => showPhoto(index));
  galleryGrid?.appendChild(button);
});

galleryToggle?.addEventListener("click", () => {
  const willExpand = galleryToggle.getAttribute("aria-expanded") !== "true";
  const galleryItems = galleryGrid?.querySelectorAll(".gallery-item") ?? [];

  galleryItems.forEach((item, index) => {
    if (index < initiallyVisiblePhotos) return;
    item.hidden = !willExpand;
    const image = item.querySelector("img");
    if (willExpand && image?.dataset.src) {
      image.src = image.dataset.src;
      delete image.dataset.src;
    }
  });

  galleryToggle.setAttribute("aria-expanded", String(willExpand));
  galleryToggle.textContent = willExpand ? "Collapse gallery" : "View all";
  if (galleryStatus) {
    galleryStatus.textContent = willExpand
      ? "All 50 gallery photos are now visible."
      : "Gallery collapsed to the first 20 photos.";
  }
});

lightbox?.querySelector(".lightbox-close")?.addEventListener("click", () => lightbox.close());
lightbox?.querySelector(".lightbox-prev")?.addEventListener("click", () => showPhoto(activePhotoIndex - 1));
lightbox?.querySelector(".lightbox-next")?.addEventListener("click", () => showPhoto(activePhotoIndex + 1));
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

lightbox?.addEventListener("touchstart", (event) => {
  const touch = event.changedTouches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}, { passive: true });

lightbox?.addEventListener("touchend", (event) => {
  const touch = event.changedTouches[0];
  const horizontalDistance = touch.clientX - touchStartX;
  const verticalDistance = touch.clientY - touchStartY;
  if (Math.abs(horizontalDistance) < 50 || Math.abs(horizontalDistance) <= Math.abs(verticalDistance)) return;
  showPhoto(activePhotoIndex + (horizontalDistance < 0 ? 1 : -1));
}, { passive: true });

document.addEventListener("keydown", (event) => {
  if (!lightbox?.open) return;
  if (event.key === "ArrowLeft") showPhoto(activePhotoIndex - 1);
  if (event.key === "ArrowRight") showPhoto(activePhotoIndex + 1);
  if (event.key === "Home") showPhoto(0);
  if (event.key === "End") showPhoto(galleryPhotos.length - 1);
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
