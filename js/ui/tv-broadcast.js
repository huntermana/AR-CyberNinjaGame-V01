// Cyber Ninja: Firewall Slasher - TV Broadcast Mode & Display Scaler

export class TvBroadcastManager {
  constructor() {
    this.isTvMode = localStorage.getItem('cyber_ninja_tv_mode') === 'true';
    if (this.isTvMode) {
      document.body.classList.add('tv-broadcast-mode');
    }
  }

  toggle() {
    this.isTvMode = !this.isTvMode;
    if (this.isTvMode) {
      document.body.classList.add('tv-broadcast-mode');
    } else {
      document.body.classList.remove('tv-broadcast-mode');
    }
    localStorage.setItem('cyber_ninja_tv_mode', this.isTvMode.toString());
    return this.isTvMode;
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Fullscreen request denied', err);
      });
      return true;
    } else {
      document.exitFullscreen().catch(err => {
        console.warn('Exit fullscreen failed', err);
      });
      return false;
    }
  }
}

export const tvBroadcast = new TvBroadcastManager();
