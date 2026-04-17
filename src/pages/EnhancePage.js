/**
 * EnhancePage.js — Upload + Paste + AI Script Enhancement
 * Editable enhanced text, working re-enhance, proper error display
 */

import { store } from '../state.js';
import { navigate } from '../router.js';
import { uploadDocument, enhanceScript } from '../services/api.js';
import { showToast } from '../components/Toast.js';
import { showLoadingModal, hideLoadingModal } from '../components/LoadingModal.js';

export async function renderEnhancePage(container) {
  const rawScript = store.get('rawScript') || '';
  const enhancedScript = store.get('enhancedScript') || '';
  const filename = store.get('uploadedFilename') || '';
  const clarityScore = store.get('clarityScore') || 0;
  const engagementScore = store.get('engagementScore') || 0;
  const sentiment = store.get('sentiment') || null;
  const hasEnhanced = !!enhancedScript;

  container.innerHTML = `
    <div class="page-content page-enter" style="height: 100%; padding-bottom: 1rem;">
      <div class="enhance-layout" style="height: 100%;">
        <!-- Main Editor Area -->
        <div class="enhance-layout__main">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
            <div class="section-header" style="margin-bottom: 0;">
              <div class="section-header__overline">Script Workshop</div>
              <h1 class="section-header__title" style="font-size: var(--text-2xl);">Enhancement Studio</h1>
              <p class="section-header__desc" style="font-size: var(--text-sm);">
                Upload your script or paste text below. Let AI optimize it for studio-quality voice synthesis.
              </p>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-shrink: 0;">
              <button class="btn btn--ghost" id="import-script-btn">
                <span class="material-symbols-outlined" style="font-size: 18px;">upload_file</span>
                <span class="btn__text">Import File</span>
              </button>
              <button class="btn btn--gradient btn--glow" id="enhance-btn" ${!rawScript ? 'disabled' : ''} style="${!rawScript ? 'opacity: 0.5; animation: none; pointer-events: none;' : ''}">
                <span class="material-symbols-outlined" style="font-size: 18px;">auto_awesome</span>
                <span class="btn__text">Enhance with AI</span>
              </button>
            </div>
          </div>

          ${hasEnhanced ? renderDiffView(rawScript, enhancedScript) : renderInputArea(rawScript, filename)}
        </div>

        <!-- Right Sidebar -->
        <div class="enhance-layout__sidebar">
          <!-- Enhancement Options -->
          <div class="card card--flat widget stagger-reveal">
            <div class="widget__title">Enhancement Options</div>
            <div class="toggle-row">
              <span class="toggle-row__label">Auto Pacing</span>
              <div class="toggle on" id="toggle-pacing" data-key="pacing">
                <div class="toggle__knob"></div>
              </div>
            </div>
            <div class="toggle-row">
              <span class="toggle-row__label">Tone Markers</span>
              <div class="toggle on" id="toggle-tone" data-key="tone">
                <div class="toggle__knob"></div>
              </div>
            </div>
          </div>

          <!-- Script Analysis -->
          <div class="card card--flat widget stagger-reveal">
            <div class="widget__title">Script Analysis</div>
            <div class="widget__row">
              <span class="widget__label">Clarity Score</span>
              <span class="widget__value widget__value--primary">${hasEnhanced ? clarityScore + '%' : '—'}</span>
            </div>
            <div class="progress" style="margin-top: 0.5rem; margin-bottom: 1rem;">
              <div class="progress__fill animate-progress" style="width: ${hasEnhanced ? clarityScore : 0}%;"></div>
            </div>
            <div class="widget__row">
              <span class="widget__label">Engagement</span>
              <span class="widget__value widget__value--teal">${hasEnhanced ? engagementScore + '%' : '—'}</span>
            </div>
            <div class="progress" style="margin-top: 0.5rem;">
              <div class="progress__fill progress__fill--teal animate-progress" style="width: ${hasEnhanced ? engagementScore : 0}%;"></div>
            </div>
            ${!hasEnhanced ? '<p style="font-size: var(--text-xs); color: var(--text-ghost); margin-top: 1rem; font-style: italic;">Enhance your script to see analysis</p>' : ''}
          </div>

          <!-- Sentiment Map -->
          <div class="card card--flat widget stagger-reveal">
            <div class="widget__title">Sentiment Map</div>
            ${hasEnhanced && sentiment ? `
              <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                <span class="material-symbols-outlined" style="color: var(--tertiary); font-size: 24px;">sentiment_satisfied</span>
                <div style="flex: 1; height: 8px; border-radius: 4px; overflow: hidden; display: flex; background: var(--bg-inset);">
                  <div style="width: ${sentiment.inspiring}%; height: 100%; background: var(--tertiary); transition: width 1s var(--ease-out);"></div>
                  <div style="width: ${sentiment.steady}%; height: 100%; background: var(--secondary); transition: width 1s var(--ease-out);"></div>
                  <div style="width: ${sentiment.neutral}%; height: 100%; background: var(--border); transition: width 1s var(--ease-out);"></div>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.3px;">
                <span style="color: var(--tertiary);">Inspiring (${sentiment.inspiring}%)</span>
                <span style="color: var(--secondary);">Steady (${sentiment.steady}%)</span>
                <span style="color: var(--text-ghost);">Neutral (${sentiment.neutral}%)</span>
              </div>
            ` : `
              <div style="text-align: center; padding: 1rem 0;">
                <span class="material-symbols-outlined" style="font-size: 32px; color: var(--border);">analytics</span>
                <p style="font-size: var(--text-xs); color: var(--text-ghost); margin-top: 0.5rem; font-style: italic;">Enhance your script to see sentiment</p>
              </div>
            `}
          </div>

          <!-- Tip Card -->
          <div class="tip-card stagger-reveal">
            <div class="tip-card__label">Editor Tip</div>
            <p class="tip-card__text">
              "Inserting a 0.5s pause after your key premise increases listener retention by 22%."
            </p>
            <span class="material-symbols-outlined tip-card__bg-icon">lightbulb</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // ── DOM Refs ──
  const dropzone = container.querySelector('#dropzone');
  const fileInput = container.querySelector('#file-input');
  const textarea = container.querySelector('#script-textarea');
  const enhancedTextarea = container.querySelector('#enhanced-textarea');
  const enhanceBtn = container.querySelector('#enhance-btn');
  const importBtn = container.querySelector('#import-script-btn');
  const proceedBtn = container.querySelector('#proceed-studio-btn');
  const reEnhanceBtn = container.querySelector('#re-enhance-btn');
  const resetBtn = container.querySelector('#reset-btn');
  const togglePacing = container.querySelector('#toggle-pacing');
  const toggleTone = container.querySelector('#toggle-tone');

  let autoPacing = store.get('autoPacing') ?? true;
  let toneMarkers = store.get('toneMarkers') ?? true;

  // ── Toggle Logic ──
  function setupToggle(el, storeKey, initialValue, callback) {
    if (!el) return;
    if (!initialValue) {
      el.classList.remove('on');
    } else {
      el.classList.add('on');
    }
    el.addEventListener('click', () => {
      el.classList.toggle('on');
      const isOn = el.classList.contains('on');
      store.set(storeKey, isOn);
      callback(isOn);
    });
  }
  setupToggle(togglePacing, 'autoPacing', autoPacing, (val) => { autoPacing = val; });
  setupToggle(toggleTone, 'toneMarkers', toneMarkers, (val) => { toneMarkers = val; });

  // ── Enable/disable enhance btn ──
  function updateEnhanceBtn() {
    const text = (textarea ? textarea.value : store.get('rawScript') || '').trim();
    if (enhanceBtn) {
      enhanceBtn.disabled = !text;
      enhanceBtn.style.opacity = text ? 1 : 0.5;
      enhanceBtn.style.pointerEvents = text ? '' : 'none';
      enhanceBtn.style.animation = text ? '' : 'none';
    }
  }

  // ── File Upload ──
  function handleFiles(files) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.docx')) {
      showToast('Please upload a .txt or .docx file', 'error');
      return;
    }
    showLoadingModal('Uploading Script', 'Extracting text from your document...');
    uploadDocument(file).then(result => {
      store.update({
        rawScript: result.text, enhancedScript: '', uploadedFilename: result.filename,
        wordCount: result.word_count, charCount: result.char_count,
        clarityScore: 0, engagementScore: 0, sentiment: null,
      });
      hideLoadingModal();
      showToast(`Uploaded "${result.filename}" — ${result.word_count} words extracted`, 'success');
      navigate('enhance');
    }).catch(err => {
      hideLoadingModal();
      showToast(`Upload failed: ${err.message}`, 'error');
    });
  }

  // Dropzone events
  if (dropzone) {
    ['dragenter', 'dragover'].forEach(ev => {
      dropzone.addEventListener(ev, (e) => { e.preventDefault(); e.stopPropagation(); dropzone.classList.add('dragover'); });
    });
    ['dragleave', 'drop'].forEach(ev => {
      dropzone.addEventListener(ev, (e) => { e.preventDefault(); e.stopPropagation(); dropzone.classList.remove('dragover'); });
    });
    dropzone.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files));
  }
  if (fileInput) fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

  // Import button
  if (importBtn) {
    importBtn.addEventListener('click', () => {
      const tmp = document.createElement('input');
      tmp.type = 'file'; tmp.accept = '.txt,.docx';
      tmp.onchange = (e) => handleFiles(e.target.files);
      tmp.click();
    });
  }

  // ── Textarea → save to state ──
  let textareaTimeout;
  if (textarea) {
    textarea.addEventListener('input', () => {
      updateEnhanceBtn();
      clearTimeout(textareaTimeout);
      textareaTimeout = setTimeout(() => {
        store.set('rawScript', textarea.value);
      }, 300);
    });
  }

  // ── Enhanced text editing — save changes to state ──
  let enhancedTextareaTimeout;
  if (enhancedTextarea) {
    enhancedTextarea.addEventListener('input', () => {
      clearTimeout(enhancedTextareaTimeout);
      enhancedTextareaTimeout = setTimeout(() => {
        store.set('enhancedScript', enhancedTextarea.value);
      }, 300);
    });
  }

  // ── Enhance Logic ──
  let isEnhancing = false;
  async function doEnhance() {
    if (isEnhancing) return;
    
    // Force sync the DOM value to state immediately before enhancing
    if (enhancedTextarea && enhancedTextarea.value.trim()) {
      // Re-enhancing: Use the edited enhanced script as the new baseline
      store.set('rawScript', enhancedTextarea.value);
    } else if (textarea) {
      // Normal enhance: make sure we have latest user input even if they just pasted
      store.set('rawScript', textarea.value);
    }

    const text = store.get('rawScript')?.trim();
    if (!text) {
      showToast('No script text to enhance. Please write or upload text first.', 'error');
      return;
    }

    isEnhancing = true;
    showLoadingModal('Enhancing Script', 'Gemini AI is optimizing pacing, tone markers, and cadence...');

    try {
      const result = await enhanceScript(text, autoPacing, toneMarkers);
      store.update({
        enhancedScript: result.enhanced_text,
        toneAnalysis: result.tone_analysis,
        estimatedDuration: result.estimated_duration,
        wordCount: result.word_count,
        charCount: result.char_count,
        clarityScore: result.clarity_score || 85,
        engagementScore: result.engagement_score || 75,
        sentiment: result.sentiment || { inspiring: 55, steady: 30, neutral: 15 },
      });
      hideLoadingModal();
      showToast('Script enhanced successfully!', 'success');
      navigate('enhance');
    } catch (err) {
      hideLoadingModal();
      // handleResponse in api.js already shows toast for HTTP errors
      // This catches network-level errors (connection refused, etc.)
      if (!err.message?.includes('unexpected')) {
        showToast(`Enhancement failed: ${err.message}`, 'error');
      }
    } finally {
      isEnhancing = false;
    }
  }

  if (enhanceBtn) enhanceBtn.addEventListener('click', doEnhance);
  if (reEnhanceBtn) reEnhanceBtn.addEventListener('click', doEnhance);
  if (proceedBtn) proceedBtn.addEventListener('click', () => navigate('studio'));

  // ── Reset button (go back to editor) ──
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      store.update({ enhancedScript: '', clarityScore: 0, engagementScore: 0, sentiment: null });
      navigate('enhance');
    });
  }

  // ── Cleanup on unmount ──
  return () => {
    clearTimeout(textareaTimeout);
    clearTimeout(enhancedTextareaTimeout);
  };
}

function renderInputArea(rawScript, filename) {
  return `
    <div style="flex: 1; display: flex; flex-direction: column; gap: 1rem;">
      <div class="editor-panel stagger-reveal" style="flex: 1;">
        <div class="editor-panel__glow"></div>
        <div style="position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column;">
          ${filename ? `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-light);">
              <span class="material-symbols-outlined" style="font-size: 16px; color: var(--primary);">description</span>
              <span style="font-size: var(--text-xs); font-weight: 600; color: var(--text-muted);">${escapeHtml(filename)}</span>
            </div>
          ` : ''}
          <textarea class="editor-textarea" id="script-textarea" placeholder="Paste your script text here, or use Import to upload a file...">${escapeHtml(rawScript)}</textarea>
        </div>
      </div>
      <div class="dropzone stagger-reveal" id="dropzone" style="padding: 1.25rem;">
        <input type="file" class="dropzone__input" id="file-input" accept=".txt,.docx" />
        <div style="display: flex; align-items: center; gap: 1rem;">
          <span class="material-symbols-outlined dropzone__icon" style="font-size: 28px; margin-bottom: 0;">cloud_upload</span>
          <div style="text-align: left;">
            <div class="dropzone__title" style="font-size: var(--text-sm);">Or drop a script file here</div>
            <div class="dropzone__desc" style="font-size: 11px;">Supports .txt and .docx • Max 5MB</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderDiffView(rawScript, enhancedScript) {
  const toneAnalysis = store.get('toneAnalysis') || 'Professional';
  const wordCount = store.get('wordCount') || '—';
  const estimatedDuration = store.get('estimatedDuration') || '—';

  return `
    <div class="editor-panel stagger-reveal" style="flex: 1; display: flex; flex-direction: column;">
      <div class="editor-panel__glow"></div>
      <div style="position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; overflow: hidden;">
        <div style="flex: 1; overflow-y: auto; padding-right: 0.5rem;">
          <!-- Original Draft (read-only, collapsed) -->
          <div style="margin-bottom: 1rem; padding: 0.875rem; background: var(--bg-inset); border-radius: var(--radius-md); border: 1px solid var(--border-light);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <span class="material-symbols-outlined" style="font-size: 14px; color: var(--text-ghost);">edit_note</span>
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--text-ghost);">Original Draft</span>
            </div>
            <div style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; max-height: 80px; overflow-y: auto;">${escapeHtml(rawScript)}</div>
          </div>

          <!-- Enhanced Script (EDITABLE textarea) -->
          <div style="margin-bottom: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span class="material-symbols-outlined" style="font-size: 16px; color: var(--primary);">auto_awesome</span>
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--primary);">Optimized Script</span>
              <span class="diff-badge">AI Enhanced</span>
              <span style="font-size: 10px; color: var(--text-ghost); margin-left: auto; font-style: italic;">Click to edit</span>
            </div>
            <textarea class="editor-textarea" id="enhanced-textarea" style="min-height: 180px; border: 2px solid var(--primary-light); border-radius: var(--radius-md); background: rgba(79, 70, 229, 0.02);">${escapeHtml(enhancedScript)}</textarea>
          </div>

          <!-- Meta Tags -->
          <div class="diff-meta-tags" style="margin-bottom: 0.5rem;">
            <span class="meta-pill">
              <span class="meta-pill__dot"></span>
              Tone: ${toneAnalysis}
            </span>
            <span class="meta-pill">
              <span class="material-symbols-outlined">speed</span>
              ${wordCount} words
            </span>
            <span class="meta-pill">
              <span class="material-symbols-outlined">timer</span>
              ${estimatedDuration}
            </span>
          </div>
        </div>

        <!-- Action Buttons (fixed at bottom) -->
        <div style="padding-top: 1rem; border-top: 1px solid var(--border-light); display: flex; gap: 0.75rem; flex-shrink: 0;">
          <button class="btn btn--ghost" id="reset-btn" title="Start over">
            <span class="material-symbols-outlined" style="font-size: 16px;">arrow_back</span>
            <span class="btn__text">Edit Original</span>
          </button>
          <button class="btn btn--secondary" id="re-enhance-btn">
            <span class="material-symbols-outlined" style="font-size: 16px;">refresh</span>
            <span class="btn__text">Re-enhance</span>
          </button>
          <button class="btn btn--gradient btn--full btn--lg" id="proceed-studio-btn" style="flex: 1;">
            <span class="material-symbols-outlined" style="font-size: 18px;">mic_external_on</span>
            <span class="btn__text">Proceed to Studio</span>
            <span class="material-symbols-outlined" style="font-size: 18px;">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
