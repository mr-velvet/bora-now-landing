// Video background carousel
// Cycles through videos independently of slide navigation
// Each video crossfades to the next on a timer

const INTERVAL = 12000; // ms between video switches
const PRELOAD_AHEAD = 1; // how many videos to preload ahead

export class VideoBg {
  constructor(container) {
    this.container = container;
    this.videos = Array.from(container.querySelectorAll('video'));
    this.current = 0;
    this.timer = null;
  }

  init() {
    if (!this.videos.length) return;

    // First video is already active + autoplay
    // Preload next
    this.preload(1);

    // Start cycling
    this.timer = setInterval(() => this.next(), INTERVAL);
  }

  next() {
    const prev = this.current;
    this.current = (this.current + 1) % this.videos.length;

    // Preload upcoming
    this.preload(this.current);
    this.preload((this.current + 1) % this.videos.length);

    // Start playing new video before making it visible
    const nextVid = this.videos[this.current];
    nextVid.play().catch(() => {});

    // Crossfade
    this.videos[prev].classList.remove('active');
    nextVid.classList.add('active');

    // Pause previous after fade completes
    setTimeout(() => {
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

  destroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
