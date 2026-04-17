/**
 * StudioPage.js — Premium Voice Studio
 * Fixed: voice switching, generate with different voice, error display
 */

import { store } from '../state.js';
import { generateTTS } from '../services/api.js';
import { showToast } from '../components/Toast.js';
import { renderAudioPlayer } from '../components/AudioPlayer.js';
import { showLoadingModal, hideLoadingModal } from '../components/LoadingModal.js';

const VOICES = [
  { name: 'Puck', desc: 'Deep & Authoritative', category: 'featured', bestFor: 'Corporate, Documentaries', face: '🧔' },
  { name: 'Kore', desc: 'Soothing & Calm', category: 'featured', bestFor: 'Wellness, Meditation', face: '👩' },
  { name: 'Aoede', desc: 'Narrative Warmth', category: 'featured', bestFor: 'Travel, Audiobooks', face: '🧑‍✈️' },
  { name: 'Charon', desc: 'Crisp Professional', category: 'more', face: '👨‍💼' },
  { name: 'Fenrir', desc: 'Dynamic Storyteller', category: 'more', face: '🧙' },
  { name: 'Leda', desc: 'Bright Energetic', category: 'more', face: '👧' },
  { name: 'Orus', desc: 'Resonant Bass', category: 'more', face: '🎭' },
  { name: 'Zephyr', desc: 'Airy & Light', category: 'more', face: '🧚' },
  { name: 'Callirrhoe', desc: 'Elegant Poised', category: 'more', face: '👸' },
  { name: 'Autonoe', desc: 'Warm Conversational', category: 'more', face: '🙋‍♀️' },
  { name: 'Enceladus', desc: 'Bold Dramatic', category: 'more', face: '🦸' },
  { name: 'Iapetus', desc: 'Steady Documentary', category: 'more', face: '👨‍🏫' },
  { name: 'Umbriel', desc: 'Soft Whisper', category: 'more', face: '🌙' },
  { name: 'Algieba', desc: 'Cheerful Upbeat', category: 'more', face: '😊' },
  { name: 'Despina', desc: 'Clear Articulate', category: 'more', face: '🗣️' },
  { name: 'Erinome', desc: 'Mystical Ethereal', category: 'more', face: '🔮' },
  { name: 'Algenib', desc: 'Commanding Presence', category: 'more', face: '🎖️' },
];

const AVATAR_COLORS = {
  'Puck': { bg: 'linear-gradient(135deg, #e2dfff, #c7d2fe)' },
  'Kore': { bg: 'linear-gradient(135deg, #ccfbf1, #a7f3d0)' },
  'Aoede': { bg: 'linear-gradient(135deg, #ffdbcc, #fed7aa)' },
};

export async function renderStudioPage(container) {
  const script = store.get('enhancedScript') || store.get('rawScript') || '';
  // Track selected voice locally AND in store for reliability
  let selectedVoice = store.get('selectedVoice') || 'Puck';
  let showAllVoices = false;
  let currentBlobUrl = store.get('audioBlobUrl') || null;
  let isGenerating = store.get('isGenerating') || false;

  container.innerHTML = `
    <div class="page-content page-enter" style="height: 100%; padding-bottom: 1rem;">
      <div class="grid-two-panel" style="height: 100%;">

        <!-- Left: Script Editor Zone -->
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <!-- Studio Header -->
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: linear-gradient(135deg, #a855f7, #6366f1); display: flex; align-items: center; justify-content: center;">
                <span class="material-symbols-outlined" style="color: white; font-size: 22px;">mic_external_on</span>
              </div>
              <div>
                <h1 style="font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 800; letter-spacing: -0.02em;">
                  Production Studio
                </h1>
                <p style="font-size: var(--text-xs); color: var(--text-muted); font-weight: 500;" id="studio-subtitle">
                  ${script ? `${script.split(/\s+/).length} words • Ready to generate` : 'Paste your script below to get started'}
                </p>
              </div>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn--ghost navbar__icon-btn" title="Import File" id="studio-import-btn">
                <span class="material-symbols-outlined">upload_file</span>
              </button>
            </div>
          </div>

          <!-- Script Editor -->
          <div class="editor-panel stagger-reveal" style="flex: 1; position: relative; overflow: hidden;">
            <div style="position: absolute; inset: 0; pointer-events: none; z-index: 0;">
              <div style="position: absolute; top: -60px; right: -60px; width: 180px; height: 180px; background: rgba(168, 85, 247, 0.04); border-radius: 50%; filter: blur(40px);"></div>
              <div style="position: absolute; bottom: -40px; left: -40px; width: 140px; height: 140px; background: rgba(99, 102, 241, 0.04); border-radius: 50%; filter: blur(40px);"></div>
            </div>
            <textarea class="editor-textarea" id="studio-script" style="position: relative; z-index: 1; min-height: 400px;" placeholder="Paste your script text here to start generating audio...&#10;&#10;You can type directly or come from the Enhancement Studio for AI-optimized text.">${escapeHtml(script)}</textarea>
          </div>
        </div>

        <!-- Right: Voice Console -->
        <div class="right-panel stagger-reveal" style="animation-delay: 100ms; background: linear-gradient(180deg, var(--bg-sidebar), #f0eef5);">
          
          <div style="text-align: center; padding: 0.5rem 0 0.25rem;">
            <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: var(--text-ghost);">Voice Console</div>
          </div>

          <!-- Featured Voices -->
          <div>
            <div class="right-panel__section-title">Featured Voices</div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;" id="featured-voices">
              ${renderFeaturedVoices(selectedVoice)}
            </div>
          </div>

          <!-- More Voices -->
          <div>
            <button style="display: flex; align-items: center; gap: 0.5rem; width: 100%; padding: 0.5rem 0.75rem; font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); cursor: pointer; background: none; border: none; transition: color 0.15s;" id="show-more-voices-btn">
              <span class="material-symbols-outlined" style="font-size: 16px;" id="more-chevron">expand_more</span>
              <span id="more-voices-label">All 17 Voices</span>
            </button>
            <div id="more-voices-list" style="display: none; flex-direction: column; gap: 0.25rem; margin-top: 0.5rem; max-height: 180px; overflow-y: auto;">
              ${renderMoreVoices(selectedVoice)}
            </div>
          </div>

          <!-- Bottom Controls -->
          <div class="right-panel__bottom">
            <div id="player-mount"></div>

            <!-- Selected Voice Indicator -->
            <div style="display: flex; align-items: center; justify-content: center; gap: 0.625rem; padding: 0.625rem 0.75rem; background: linear-gradient(135deg, rgba(168,85,247,0.08), rgba(99,102,241,0.08)); border-radius: var(--radius-sm); border: 1px solid rgba(168,85,247,0.12);">
              <span style="font-size: 18px;" id="selected-voice-face">${getVoiceFace(selectedVoice)}</span>
              <span style="font-size: var(--text-sm); font-weight: 700; color: var(--text-primary);" id="selected-voice-indicator">${selectedVoice}</span>
              <span style="font-size: var(--text-xs); color: var(--text-muted); font-weight: 500;">selected</span>
            </div>

            <button class="btn btn--gradient btn--glow btn--full btn--lg" id="generate-btn" style="border-radius: var(--radius-lg); padding: 1.125rem; font-size: var(--text-base);">
              <span class="material-symbols-outlined" style="font-size: 22px;">waves</span>
              <span class="btn__text">Generate Speech</span>
            </button>

            <button class="btn btn--secondary btn--full" id="download-btn" style="display: none; border-radius: var(--radius-lg);">
              <span class="material-symbols-outlined" style="font-size: 18px;">download</span>
              <span class="btn__text">Download WAV</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  // ── Audio Player ──
  const playerMount = container.querySelector('#player-mount');
  const downloadBtn = container.querySelector('#download-btn');
  
  const player = renderAudioPlayer(playerMount, {
    onDownload: downloadAudio,
  });

  function downloadAudio() {
    if (currentBlobUrl) {
      const a = document.createElement('a');
      a.href = currentBlobUrl;
      a.download = `tts_${selectedVoice.toLowerCase()}.wav`;
      a.click();
    }
  }

  if (currentBlobUrl) {
    player.loadAudio(currentBlobUrl);
    if (downloadBtn) downloadBtn.style.display = '';
  }

  // ── Show More Voices ──
  const showMoreBtn = container.querySelector('#show-more-voices-btn');
  const moreVoicesList = container.querySelector('#more-voices-list');
  const moreVoicesLabel = container.querySelector('#more-voices-label');
  const moreChevron = container.querySelector('#more-chevron');

  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      showAllVoices = !showAllVoices;
      moreVoicesList.style.display = showAllVoices ? 'flex' : 'none';
      moreVoicesLabel.textContent = showAllVoices ? 'Hide Extra Voices' : 'All 17 Voices';
      moreChevron.textContent = showAllVoices ? 'expand_less' : 'expand_more';
    });
  }

  // ── Voice Selection (FIXED — updates local variable AND store) ──
  function handleVoiceClick(e) {
    const card = e.target.closest('[data-voice]');
    if (!card) return;
    
    // Stop propagation to prevent double-firing
    e.stopPropagation();
    
    const voice = card.dataset.voice;
    
    // Update both local state and store
    selectedVoice = voice;
    store.set('selectedVoice', voice);

    // Visual update — all cards
    container.querySelectorAll('[data-voice]').forEach(c => {
      const isThis = c.dataset.voice === voice;
      c.classList.toggle('active', isThis);
      const check = c.querySelector('.voice-card__check');
      if (check) check.style.opacity = isThis ? '1' : '0';
    });

    // Update indicator
    const indicator = container.querySelector('#selected-voice-indicator');
    const faceEl = container.querySelector('#selected-voice-face');
    if (indicator) indicator.textContent = voice;
    if (faceEl) faceEl.textContent = getVoiceFace(voice);

    showToast(`Voice changed to "${voice}"`, 'info');
  }

  // Use event delegation on the whole right panel for voice clicks
  container.querySelector('#featured-voices')?.addEventListener('click', handleVoiceClick);
  if (moreVoicesList) moreVoicesList.addEventListener('click', handleVoiceClick);

  // ── Script editing ──
  const studioScript = container.querySelector('#studio-script');
  if (studioScript) {
    studioScript.addEventListener('input', () => {
      const val = studioScript.value;
      store.set('enhancedScript', val);
      // Update subtitle
      const subtitle = container.querySelector('#studio-subtitle');
      if (subtitle) {
        const wc = val.trim() ? val.trim().split(/\s+/).length : 0;
        subtitle.textContent = wc > 0 ? `${wc} words • Ready to generate` : 'Paste your script below to get started';
      }
    });
  }

  // ── Import ──
  container.querySelector('#studio-import-btn')?.addEventListener('click', () => {
    const tmp = document.createElement('input');
    tmp.type = 'file'; tmp.accept = '.txt,.docx';
    tmp.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      showLoadingModal('Importing Script', 'Reading your file...');
      try {
        const { uploadDocument } = await import('../services/api.js');
        const result = await uploadDocument(file);
        store.update({ rawScript: result.text, enhancedScript: result.text, uploadedFilename: result.filename });
        if (studioScript) studioScript.value = result.text;
        hideLoadingModal();
        showToast(`Imported "${result.filename}"`, 'success');
      } catch (err) {
        hideLoadingModal();
        showToast(`Import failed: ${err.message}`, 'error');
      }
    };
    tmp.click();
  });

  // ── Generate Button (FIXED — uses local selectedVoice, prevents double-click) ──
  const generateBtn = container.querySelector('#generate-btn');
  if (generateBtn) {
    generateBtn.addEventListener('click', async () => {
      // Prevent double-click
      if (isGenerating) return;

      const text = (studioScript?.value || store.get('enhancedScript') || store.get('rawScript') || '').trim();
      if (!text) {
        showToast('Please enter or paste a script first.', 'error');
        return;
      }

      // Read the CURRENT selected voice directly from local variable
      const voice = selectedVoice;
      
      if (!voice) {
        showToast('Please select a voice first.', 'error');
        return;
      }

      isGenerating = true;
      store.set('isGenerating', true);
      showLoadingModal('Generating Audio', `Synthesizing speech with voice "${voice}"...`);

      try {
        const blob = await generateTTS(text, voice);
        
        // Revoke previous blob
        if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
        currentBlobUrl = URL.createObjectURL(blob);
        store.update({ audioBlobUrl: currentBlobUrl });

        player.loadAudio(currentBlobUrl);
        player.play();

        if (downloadBtn) downloadBtn.style.display = '';

        hideLoadingModal();
        showToast(`Audio generated with "${voice}"!`, 'success');
      } catch (err) {
        hideLoadingModal();
        // handleResponse in api.js shows HTTP error toasts
        // This catches network errors
        showToast(`Generation failed: ${err.message}`, 'error');
      } finally {
        isGenerating = false;
        store.set('isGenerating', false);
      }
    });
  }

  if (downloadBtn) downloadBtn.addEventListener('click', downloadAudio);

  return () => {
    // Cleanup — keep blob URL in store for persistence
  };
}

function getVoiceFace(name) {
  const voice = VOICES.find(v => v.name === name);
  return voice?.face || '🎙️';
}

function renderFeaturedVoices(selectedVoice) {
  const featured = VOICES.filter(v => v.category === 'featured');
  return featured.map(voice => {
    const isActive = voice.name === selectedVoice;
    const colors = AVATAR_COLORS[voice.name] || { bg: 'var(--bg-inset)' };
    return `
      <div class="voice-card ${isActive ? 'active' : ''}" data-voice="${voice.name}" style="padding: 0.875rem; cursor: pointer;">
        <div class="voice-card__avatar" style="background: ${colors.bg}; width: 46px; height: 46px; font-size: 24px; border-radius: var(--radius-md);">
          ${voice.face}
        </div>
        <div class="voice-card__info">
          <div class="voice-card__name" style="font-size: var(--text-base);">${voice.name}</div>
          <div class="voice-card__desc">${voice.desc}</div>
          <div style="font-size: 9px; color: var(--text-ghost); margin-top: 2px;">Best for: ${voice.bestFor}</div>
        </div>
        <span class="material-symbols-outlined filled voice-card__check" style="font-size: 20px; opacity: ${isActive ? '1' : '0'}; color: var(--primary); transition: opacity 0.2s;">check_circle</span>
      </div>
    `;
  }).join('');
}

function renderMoreVoices(selectedVoice) {
  const more = VOICES.filter(v => v.category === 'more');
  return more.map(voice => {
    const isActive = voice.name === selectedVoice;
    return `
      <div class="voice-card ${isActive ? 'active' : ''}" data-voice="${voice.name}" style="cursor: pointer;">
        <div class="voice-card__avatar" style="width: 36px; height: 36px; font-size: 16px;">
          ${voice.face}
        </div>
        <div class="voice-card__info">
          <div class="voice-card__name">${voice.name}</div>
          <div class="voice-card__desc">${voice.desc}</div>
        </div>
        <span class="material-symbols-outlined filled voice-card__check" style="font-size: 18px; opacity: ${isActive ? '1' : '0'}; color: var(--primary); transition: opacity 0.2s;">check_circle</span>
      </div>
    `;
  }).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
