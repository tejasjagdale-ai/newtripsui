import { generateTTS, showToast } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // Voices List based on Backend allowed voices
    const allowedVoices = [
        "Puck", "Charon", "Kore", "Fenrir", "Aoede",
        "Leda", "Orus", "Zephyr", "Callirrhoe", "Autonoe",
        "Enceladus", "Iapetus", "Umbriel", "Algieba",
        "Despina", "Erinome", "Algenib"
    ];

    const enhancedScriptInput = document.getElementById('enhanced-script-input');
    const voiceListEl = document.getElementById('voice-list');
    const generateBtn = document.getElementById('generate-btn');
    
    // Player DOM
    const nativeAudio = document.getElementById('native-audio');
    const playBtn = document.getElementById('play-btn');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');
    const progressContainer = document.getElementById('progress-container');
    const progressFill = document.getElementById('progress-fill');
    const timeDisplay = document.getElementById('time-display');
    const downloadBtn = document.getElementById('download-btn');

    let currentVoice = "Puck"; // Default voice
    let currentAudioBlobUrl = null;

    // Load payload from Session Storage
    const savedScript = sessionStorage.getItem('enhanced_script');
    if (savedScript) {
        enhancedScriptInput.value = savedScript;
    }

    // Save changes back to raw if they edit heavily here
    enhancedScriptInput.addEventListener('input', () => {
        sessionStorage.setItem('raw_script', enhancedScriptInput.value);
    });

    // Voice Mapping for Descriptions to match Mockup
    const voiceDescriptions = {
        "Aoede": "NARRATIVE WARMTH",
        "Puck": "DEEP AUTHORITATIVE",
        "Charon": "CRISP PROFESSIONAL",
        "Fenrir": "DYNAMIC STORYTELLER",
        "Kore": "SOOTHING CALM"
    };

    // Populate Voices
    allowedVoices.sort().forEach((voice, index) => {
        // Just show max 5 for a clean look, or show all but give them a description
        const desc = voiceDescriptions[voice] || "STANDARD NEUTRAL";
        
        const div = document.createElement('div');
        div.className = `voice-item ${voice === currentVoice ? 'active' : ''}`;
        
        div.innerHTML = `
            <div class="voice-avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div class="voice-info">
                <span class="voice-name">${voice}</span>
                <span class="voice-desc">${desc}</span>
            </div>
            <div class="voice-check" style="${voice === currentVoice ? 'display:block' : 'display:none'}">
                <svg class="icon-check" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/></svg>
            </div>
        `;
        
        div.addEventListener('click', () => {
            // Remove active from all
            document.querySelectorAll('.voice-item').forEach(el => {
                el.classList.remove('active');
                el.querySelector('.voice-check').style.display = 'none';
            });
            // Set active
            div.classList.add('active');
            div.querySelector('.voice-check').style.display = 'block';
            currentVoice = voice;
        });
        
        voiceListEl.appendChild(div);
    });

    // Generate Audio Process
    generateBtn.addEventListener('click', async () => {
        const textToGenerate = enhancedScriptInput.value.trim();
        if (!textToGenerate) {
            showToast('Please provide a script to generate.', 'error');
            return;
        }

        const originalText = generateBtn.innerHTML;
        generateBtn.innerHTML = `<div class="spinner" style="display:inline-block; border-top-color:#fff;"></div>`;
        generateBtn.classList.add('loading');
        
        try {
            // Call API
            const blob = await generateTTS(textToGenerate, currentVoice);
            
            // Re-voke old url
            if (currentAudioBlobUrl) {
                URL.revokeObjectURL(currentAudioBlobUrl);
            }

            // Bind blob to audio element
            currentAudioBlobUrl = URL.createObjectURL(blob);
            nativeAudio.src = currentAudioBlobUrl;
            
            // Setup Download
            downloadBtn.onclick = () => {
                const a = document.createElement('a');
                a.href = currentAudioBlobUrl;
                a.download = `tts_output_${currentVoice.toLowerCase()}.wav`;
                a.click();
            };
            
            // Enable controls and SHOW player
            document.querySelector('.player-container').style.display = 'block';
            playBtn.disabled = false;
            downloadBtn.disabled = false;
            progressFill.style.width = '0%';
            timeDisplay.textContent = '0:00 / 0:00';
            
            showToast('Audio generated successfully!', 'success');
            
            // Auto play
            nativeAudio.play();

        } catch (error) {
            console.error(error);
        } finally {
            generateBtn.innerHTML = originalText;
            generateBtn.classList.remove('loading');
        }
    });

    // Custom Audio Player Logic
    function formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    playBtn.addEventListener('click', () => {
        if (nativeAudio.paused) {
            nativeAudio.play();
        } else {
            nativeAudio.pause();
        }
    });

    nativeAudio.addEventListener('play', () => {
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
    });

    nativeAudio.addEventListener('pause', () => {
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
    });

    nativeAudio.addEventListener('timeupdate', () => {
        const current = nativeAudio.currentTime;
        const dur = nativeAudio.duration;
        if (dur > 0) {
            progressFill.style.width = `${(current / dur) * 100}%`;
            timeDisplay.textContent = `${formatTime(current)} / ${formatTime(dur)}`;
        }
    });

    nativeAudio.addEventListener('loadedmetadata', () => {
        timeDisplay.textContent = `0:00 / ${formatTime(nativeAudio.duration)}`;
    });

    nativeAudio.addEventListener('ended', () => {
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
        progressFill.style.width = '100%';
        nativeAudio.currentTime = 0;
    });

    progressContainer.addEventListener('click', (e) => {
        if (!nativeAudio.duration) return;
        const rect = progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        nativeAudio.currentTime = pos * nativeAudio.duration;
    });

});
