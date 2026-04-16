import { uploadDocument, enhanceScript, showToast } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.querySelector('.start-crafting-card') || document.body;
    const fileInput = document.getElementById('file-input');
    const scriptInput = document.getElementById('script-input');
    const enhanceBtn = document.getElementById('enhance-btn');
    const autoPacing = document.getElementById('auto-pacing');
    const toneMarkers = document.getElementById('tone-markers');

    // UI state updates
    const updateButtonState = () => {
        if(enhanceBtn) enhanceBtn.disabled = scriptInput.value.trim().length === 0;
    };

    scriptInput.addEventListener('input', updateButtonState);

    // File Drag & Drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
    });

    dropZone.addEventListener('drop', handleDrop, false);
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files), false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    async function handleFiles(files) {
        if (!files || files.length === 0) return;
        const file = files[0];
        
        // Simple client side validation
        if (!file.name.endsWith('.txt') && !file.name.endsWith('.docx')) {
            showToast('Please upload a .txt or .docx file', 'error');
            return;
        }

        dropZone.style.opacity = '0.5';
        try {
            const result = await uploadDocument(file);
            scriptInput.value = result.text;
            updateButtonState();
            showToast(`File uploaded successfully! Extracted ${result.word_count} words.`, 'success');
        } catch (error) {
            console.error(error);
        } finally {
            dropZone.style.opacity = '1';
            fileInput.value = '';
        }
    }

    // Enhance & Proceed
    enhanceBtn.addEventListener('click', async () => {
        const text = scriptInput.value.trim();
        if (!text) return;

        enhanceBtn.classList.add('loading');
        
        try {
            const result = await enhanceScript(text, autoPacing.checked, toneMarkers.checked);
            
            // Save the enhanced text logically for the next page
            sessionStorage.setItem('enhanced_script', result.enhanced_text);
            
            showToast('Script enhanced! Redirecting to Studio...', 'success');
            
            setTimeout(() => {
                window.location.href = 'studio.html';
            }, 1500);
            
        } catch (error) {
            console.error(error);
            enhanceBtn.classList.remove('loading');
        }
    });

    // Check if we came back from studio with saved text
    const saved = sessionStorage.getItem('raw_script');
    if (saved) {
        scriptInput.value = saved;
        updateButtonState();
    }
});
