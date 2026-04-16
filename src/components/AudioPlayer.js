/**
 * AudioPlayer.js — Custom Audio Player with Waveform
 */

export function renderAudioPlayer(container, options = {}) {
  const { onDownload } = options;

  const wrapper = document.createElement('div');
  wrapper.className = 'player';
  wrapper.id = 'audio-player';
  wrapper.style.display = 'none';

  wrapper.innerHTML = `
    <audio id="native-audio" preload="metadata"></audio>
    
    <div class="player__header">
      <span class="player__label">Generated Audio</span>
      <span class="player__time" id="player-time">0:00 / 0:00</span>
    </div>

    <div class="player__waveform" id="player-waveform">
      ${Array.from({ length: 20 }, () => `<span class="wave-bar paused"></span>`).join('')}
    </div>

    <div class="player__progress" id="player-progress">
      <div class="player__progress-fill" id="player-progress-fill" style="width: 0%"></div>
      <div class="player__progress-knob" id="player-progress-knob" style="left: 0%"></div>
    </div>

    <div class="player__controls">
      <button class="player__btn" id="player-rewind" title="Rewind 10s">
        <span class="material-symbols-outlined">replay_10</span>
      </button>
      <button class="player__play-btn" id="player-play" title="Play/Pause">
        <span class="material-symbols-outlined" id="player-play-icon">play_arrow</span>
      </button>
      <button class="player__btn" id="player-forward" title="Forward 10s">
        <span class="material-symbols-outlined">forward_10</span>
      </button>
      <button class="player__btn" id="player-download" title="Download WAV" style="margin-left: auto;">
        <span class="material-symbols-outlined">download</span>
      </button>
    </div>
  `;

  container.appendChild(wrapper);

  // DOM refs
  const audio = wrapper.querySelector('#native-audio');
  const playBtn = wrapper.querySelector('#player-play');
  const playIcon = wrapper.querySelector('#player-play-icon');
  const timeDisplay = wrapper.querySelector('#player-time');
  const progressBar = wrapper.querySelector('#player-progress');
  const progressFill = wrapper.querySelector('#player-progress-fill');
  const progressKnob = wrapper.querySelector('#player-progress-knob');
  const rewindBtn = wrapper.querySelector('#player-rewind');
  const forwardBtn = wrapper.querySelector('#player-forward');
  const downloadBtn = wrapper.querySelector('#player-download');
  const waveBars = wrapper.querySelectorAll('.wave-bar');

  function formatTime(s) {
    if (isNaN(s) || !isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function updateWaveBars(playing) {
    waveBars.forEach(bar => {
      bar.classList.toggle('paused', !playing);
    });
  }

  // Play/Pause
  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', () => {
    playIcon.textContent = 'pause';
    updateWaveBars(true);
  });

  audio.addEventListener('pause', () => {
    playIcon.textContent = 'play_arrow';
    updateWaveBars(false);
  });

  audio.addEventListener('ended', () => {
    playIcon.textContent = 'play_arrow';
    updateWaveBars(false);
    progressFill.style.width = '100%';
    progressKnob.style.left = '100%';
  });

  // Progress
  audio.addEventListener('timeupdate', () => {
    if (audio.duration > 0) {
      const pct = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = `${pct}%`;
      progressKnob.style.left = `${pct}%`;
      timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
  });

  // Seek
  progressBar.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pos * audio.duration;
  });

  // Rewind / Forward
  rewindBtn.addEventListener('click', () => {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  });

  forwardBtn.addEventListener('click', () => {
    audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
  });

  // Download
  downloadBtn.addEventListener('click', () => {
    if (onDownload) onDownload();
  });

  // Public API
  return {
    element: wrapper,
    show() {
      wrapper.style.display = 'block';
    },
    hide() {
      wrapper.style.display = 'none';
    },
    loadAudio(blobUrl) {
      audio.src = blobUrl;
      progressFill.style.width = '0%';
      progressKnob.style.left = '0%';
      timeDisplay.textContent = '0:00 / 0:00';
      wrapper.style.display = 'block';
    },
    play() {
      audio.play();
    },
    pause() {
      audio.pause();
    },
    getAudioElement() {
      return audio;
    },
  };
}
