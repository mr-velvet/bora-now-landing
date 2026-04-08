// Video background carousel
// Each video crossfades to the next starting at 2.5s to avoid frozen last frame.

const FADE_AT = 2.5; // seconds — start crossfade before video ends

export class VideoBg {
  constructor(container) {
    this.container = container;
    this.videos = Array.from(container.querySelectorAll('video'));
    this.current = 0;
    this.transitioning = false;
  }

  init() {
    if (!this.videos.length) return;

    // Remove loop from all videos
    this.videos.forEach(v => v.removeAttribute('loop'));

    // Watch timeupdate to trigger early crossfade
    this.videos.forEach(vid => {
      vid.addEventListener('timeupdate', () => {
        if (!this.transitioning && vid === this.videos[this.current] && vid.currentTime >= FADE_AT) {
          this.transitioning = true;
          this.next();
        }
      });
    });

    // Preload next video
    this.preload(1);

    // First video is already active + autoplay
    this.videos[0].play().catch(() => {});
  }

  next() {
    const prev = this.current;
    this.current = (this.current + 1) % this.videos.length;

    const nextVid = this.videos[this.current];

    // Preload the one after next
    this.preload((this.current + 1) % this.videos.length);

    // Reset and play next before crossfade
    nextVid.currentTime = 0;
    nextVid.play().catch(() => {});

    // Crossfade
    this.videos[prev].classList.remove('active');
    nextVid.classList.add('active');

    // Reset previous after fade completes, unlock transition
    setTimeout(() => {
      this.transitioning = false;
      if (!this.videos[prev].classList.contains('active')) {
        this.videos[prev].pause();
        this.videos[prev].currentTime = 0;
      }
    }, 2000);
  }

  preload(idx) {
    const vid = this.videos[idx];
    if (!vid || vid.dataset.preloaded) return;
    vid.preload = 'auto';
    vid.load();
    vid.dataset.preloaded = 'true';
  }
}
