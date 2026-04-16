/**
 * OverviewPage.js — Dashboard / Landing Page
 * Shows workflow steps, featured voices with faces, and quick start
 */

import { navigate } from '../router.js';

export async function renderOverviewPage(container) {
  container.innerHTML = `
    <div class="page-content page-enter">
      <!-- Hero Header -->
      <section style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem;">
        <div>
          <h1 style="font-family: var(--font-display); font-size: var(--text-4xl); font-weight: 800; letter-spacing: -0.03em; color: var(--text-primary); margin-bottom: 0.25rem;">
            Welcome back, Luthier.
          </h1>
          <p style="font-size: var(--text-base); color: var(--text-muted);">
            Your sonic projects are ready for their next layer of craft.
          </p>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn--secondary" id="overview-import-btn">
            <span class="material-symbols-outlined" style="font-size: 18px;">file_upload</span>
            <span class="btn__text">Import Script</span>
          </button>
          <button class="btn btn--primary btn--glow" id="overview-new-btn">
            <span class="material-symbols-outlined" style="font-size: 18px;">add</span>
            <span class="btn__text">New Production</span>
          </button>
        </div>
      </section>

      <!-- How It Works -->
      <section style="margin-bottom: 2.5rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
          <h3 style="font-family: var(--font-display); font-size: var(--text-xl); font-weight: 700;">How It Works</h3>
        </div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;">
          
          <div class="card card--flat stagger-reveal" style="text-align: center; padding: 1.75rem 1.25rem; position: relative; overflow: visible;">
            <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); width: 24px; height: 24px; border-radius: 50%; background: var(--primary); color: white; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center;">1</div>
            <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: var(--primary-ghost); display: flex; align-items: center; justify-content: center; margin: 0.5rem auto 1rem;">
              <span class="material-symbols-outlined" style="color: var(--primary); font-size: 24px;">upload_file</span>
            </div>
            <div style="font-family: var(--font-display); font-weight: 700; font-size: var(--text-base); margin-bottom: 0.375rem;">Upload Script</div>
            <p style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5;">Upload .txt/.docx or paste your text directly into the editor.</p>
          </div>
          
          <div class="card card--flat stagger-reveal" style="text-align: center; padding: 1.75rem 1.25rem; position: relative; overflow: visible;">
            <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); width: 24px; height: 24px; border-radius: 50%; background: var(--secondary); color: white; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center;">2</div>
            <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: rgba(0, 106, 97, 0.08); display: flex; align-items: center; justify-content: center; margin: 0.5rem auto 1rem;">
              <span class="material-symbols-outlined" style="color: var(--secondary); font-size: 24px;">auto_awesome</span>
            </div>
            <div style="font-family: var(--font-display); font-weight: 700; font-size: var(--text-base); margin-bottom: 0.375rem;">AI Enhancement</div>
            <p style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5;">Gemini AI optimizes pacing, tone, and cadence for studio-quality output.</p>
          </div>
          
          <div class="card card--flat stagger-reveal" style="text-align: center; padding: 1.75rem 1.25rem; position: relative; overflow: visible;">
            <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); width: 24px; height: 24px; border-radius: 50%; background: var(--tertiary); color: white; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center;">3</div>
            <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: rgba(126, 48, 0, 0.08); display: flex; align-items: center; justify-content: center; margin: 0.5rem auto 1rem;">
              <span class="material-symbols-outlined" style="color: var(--tertiary); font-size: 24px;">record_voice_over</span>
            </div>
            <div style="font-family: var(--font-display); font-weight: 700; font-size: var(--text-base); margin-bottom: 0.375rem;">Select Voice</div>
            <p style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5;">Choose from 17 premium AI voices — each crafted for different styles.</p>
          </div>
          
          <div class="card card--flat stagger-reveal" style="text-align: center; padding: 1.75rem 1.25rem; position: relative; overflow: visible;">
            <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); width: 24px; height: 24px; border-radius: 50%; background: var(--success); color: white; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center;">4</div>
            <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: rgba(16, 185, 129, 0.08); display: flex; align-items: center; justify-content: center; margin: 0.5rem auto 1rem;">
              <span class="material-symbols-outlined" style="color: var(--success); font-size: 24px;">headphones</span>
            </div>
            <div style="font-family: var(--font-display); font-weight: 700; font-size: var(--text-base); margin-bottom: 0.375rem;">Generate & Download</div>
            <p style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5;">Generate WAV audio, preview in-browser, and download instantly.</p>
          </div>
          
        </div>
      </section>

      <!-- Top 3 Voices Showcase with Faces -->
      <section style="margin-bottom: 2.5rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
          <div>
            <h3 style="font-family: var(--font-display); font-size: var(--text-xl); font-weight: 700;">Featured Voices</h3>
            <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 0.125rem;">Hand-picked for their unique character — click to start generating</p>
          </div>
          <a href="#studio" style="font-size: var(--text-sm); font-weight: 700; color: var(--primary);">All 17 Voices →</a>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem;">
          
          <!-- Puck -->
          <div class="card card--interactive stagger-reveal" style="padding: 1.75rem; cursor: pointer;" id="voice-puck">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem;">
              <div style="width: 56px; height: 56px; border-radius: var(--radius-lg); background: linear-gradient(135deg, var(--primary-light), #c7d2fe); display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0;">
                🧔
              </div>
              <div>
                <div style="font-weight: 800; font-size: var(--text-lg); font-family: var(--font-display);">Puck</div>
                <div style="font-size: 10px; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.5px;">Deep Authoritative</div>
              </div>
              <span class="material-symbols-outlined filled" style="margin-left: auto; color: var(--warning); font-size: 20px;">star</span>
            </div>
            <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.7; margin-bottom: 1rem;">Commanding male voice ideal for corporate presentations, documentaries, and educational narration. Projects authority and trust.</p>
            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text-ghost); margin-bottom: 0.5rem;">Best For</div>
            <div style="display: flex; gap: 0.375rem; flex-wrap: wrap;">
              <span style="padding: 0.25rem 0.625rem; border-radius: var(--radius-full); background: var(--primary-ghost); font-size: 11px; font-weight: 600; color: var(--primary);">Corporate</span>
              <span style="padding: 0.25rem 0.625rem; border-radius: var(--radius-full); background: var(--primary-ghost); font-size: 11px; font-weight: 600; color: var(--primary);">Documentary</span>
              <span style="padding: 0.25rem 0.625rem; border-radius: var(--radius-full); background: var(--primary-ghost); font-size: 11px; font-weight: 600; color: var(--primary);">Education</span>
            </div>
          </div>

          <!-- Kore -->
          <div class="card card--interactive stagger-reveal" style="padding: 1.75rem; cursor: pointer;" id="voice-kore">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem;">
              <div style="width: 56px; height: 56px; border-radius: var(--radius-lg); background: linear-gradient(135deg, var(--secondary-light), #a7f3d0); display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0;">
                👩
              </div>
              <div>
                <div style="font-weight: 800; font-size: var(--text-lg); font-family: var(--font-display);">Kore</div>
                <div style="font-size: 10px; font-weight: 700; color: var(--secondary); text-transform: uppercase; letter-spacing: 0.5px;">Soothing & Calm</div>
              </div>
              <span class="material-symbols-outlined filled" style="margin-left: auto; color: var(--warning); font-size: 20px;">star</span>
            </div>
            <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.7; margin-bottom: 1rem;">Gentle female voice perfect for meditation apps, bedtime stories, wellness content, and ASMR. Puts listeners completely at ease.</p>
            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text-ghost); margin-bottom: 0.5rem;">Best For</div>
            <div style="display: flex; gap: 0.375rem; flex-wrap: wrap;">
              <span style="padding: 0.25rem 0.625rem; border-radius: var(--radius-full); background: var(--secondary-ghost); font-size: 11px; font-weight: 600; color: var(--secondary);">Wellness</span>
              <span style="padding: 0.25rem 0.625rem; border-radius: var(--radius-full); background: var(--secondary-ghost); font-size: 11px; font-weight: 600; color: var(--secondary);">Meditation</span>
              <span style="padding: 0.25rem 0.625rem; border-radius: var(--radius-full); background: var(--secondary-ghost); font-size: 11px; font-weight: 600; color: var(--secondary);">Bedtime Stories</span>
            </div>
          </div>

          <!-- Aoede -->
          <div class="card card--interactive stagger-reveal" style="padding: 1.75rem; cursor: pointer;" id="voice-aoede">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem;">
              <div style="width: 56px; height: 56px; border-radius: var(--radius-lg); background: linear-gradient(135deg, var(--tertiary-light), #fed7aa); display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0;">
                🧑‍✈️
              </div>
              <div>
                <div style="font-weight: 800; font-size: var(--text-lg); font-family: var(--font-display);">Aoede</div>
                <div style="font-size: 10px; font-weight: 700; color: var(--tertiary); text-transform: uppercase; letter-spacing: 0.5px;">Narrative Warmth</div>
              </div>
              <span class="material-symbols-outlined filled" style="margin-left: auto; color: var(--warning); font-size: 20px;">star</span>
            </div>
            <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.7; margin-bottom: 1rem;">Warm, engaging voice for travel guides, audiobooks, and brand storytelling. Builds a natural connection with every listener.</p>
            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text-ghost); margin-bottom: 0.5rem;">Best For</div>
            <div style="display: flex; gap: 0.375rem; flex-wrap: wrap;">
              <span style="padding: 0.25rem 0.625rem; border-radius: var(--radius-full); background: rgba(126, 48, 0, 0.06); font-size: 11px; font-weight: 600; color: var(--tertiary);">Travel Guide</span>
              <span style="padding: 0.25rem 0.625rem; border-radius: var(--radius-full); background: rgba(126, 48, 0, 0.06); font-size: 11px; font-weight: 600; color: var(--tertiary);">Audiobooks</span>
              <span style="padding: 0.25rem 0.625rem; border-radius: var(--radius-full); background: rgba(126, 48, 0, 0.06); font-size: 11px; font-weight: 600; color: var(--tertiary);">Brand Voice</span>
            </div>
          </div>

        </div>
      </section>

      <!-- Quick Start -->
      <section class="card stagger-reveal quickstart" style="border: 1px solid var(--border-light);">
        <div class="quickstart__content">
          <h3 class="quickstart__title">Start crafting your next sonic masterpiece</h3>
          <p class="quickstart__text">
            Whether it's a voiceover for a documentary or a unique brand voice, 
            our artisan engine is ready to refine your text into high-fidelity speech.
          </p>
        </div>
        <div class="quickstart__actions">
          <div class="quickstart__action" id="qs-from-script">
            <span class="material-symbols-outlined" style="color: var(--primary);">text_snippet</span>
            <span class="quickstart__action-label">From Script</span>
          </div>
          <div class="quickstart__action" id="qs-direct-studio">
            <span class="material-symbols-outlined" style="color: var(--secondary);">mic_external_on</span>
            <span class="quickstart__action-label">Direct Studio</span>
          </div>
        </div>
      </section>
    </div>
  `;

  // Event handlers
  container.querySelector('#overview-import-btn')?.addEventListener('click', () => navigate('enhance'));
  container.querySelector('#overview-new-btn')?.addEventListener('click', () => navigate('enhance'));
  container.querySelector('#qs-from-script')?.addEventListener('click', () => navigate('enhance'));
  container.querySelector('#qs-direct-studio')?.addEventListener('click', () => navigate('studio'));

  // Voice cards → navigate to studio with voice pre-selected
  const { store } = await import('../state.js');
  container.querySelector('#voice-puck')?.addEventListener('click', () => {
    store.set('selectedVoice', 'Puck');
    navigate('studio');
  });
  container.querySelector('#voice-kore')?.addEventListener('click', () => {
    store.set('selectedVoice', 'Kore');
    navigate('studio');
  });
  container.querySelector('#voice-aoede')?.addEventListener('click', () => {
    store.set('selectedVoice', 'Aoede');
    navigate('studio');
  });
}
