(function() {
    const textInput = document.getElementById('text-input');
    const btnProcess = document.getElementById('btn-process');
    const outputBox = document.getElementById('output-box');
    const popupMenu = document.getElementById('popup-menu');
    const popupWordDisplay = document.getElementById('popup-word-display');
    const menuPerseus = document.getElementById('menu-perseus');
    const menuLogeion = document.getElementById('menu-logeion');
    const statusSpan = document.getElementById('status-text');
    const radioGreek = document.getElementById('lang-greek');
    const radioLatin = document.getElementById('lang-latin');
    let activeWordSpan = null;
    let currentCleanWord = '';
    let currentMenuItemIndex = 0;
    const menuItems = [menuPerseus, menuLogeion];
    let processingLock = false;
    function getSelectedLanguage() {
        if (radioGreek && radioGreek.checked) return 'greek';
        if (radioLatin && radioLatin.checked) return 'latin';
        return 'greek';
    }
    function getPerseusURL(cleanWord) {
        const encoded = encodeURIComponent(cleanWord);
        const lang = getSelectedLanguage();
        return `https://www.perseus.tufts.edu/hopper/morph?l=${encoded}&la=${lang}`;
    }
    function getLogeionMorphoURL(cleanWord) {
        const encoded = encodeURIComponent(cleanWord);
        return `https://logeion.uchicago.edu/morpho/${encoded}`;
    }
    function cleanWordToken(token) {
        return token.replace(/^[^\p{L}\p{M}']+|[^\p{L}\p{M}']+$/gu, '');
    }
    function escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    function escapeAttr(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&#39;');
    }
    function processTextToHTML(rawText) {
        if (!rawText || rawText.trim().length === 0) {
            return '<em style="color:#9A6A3A;">No text provided.</em>';
        }
        rawText = rawText.normalize('NFC');
        const tokens = rawText.match(/\S+|\s+/g);
        if (!tokens) return escapeHTML(rawText);
    
        const parts = tokens.map(token => {
            if (/^\s+$/.test(token)) return token;
            const cleaned = cleanWordToken(token);
            if (cleaned.length === 0) return token;
    
            const safeDisplay = escapeHTML(token);
            const safeAttrValue = escapeAttr(cleaned);
            return `<span class="word-clickable" data-clean="${safeAttrValue}" title="Look up: «${escapeHTML(cleaned)}»">${safeDisplay}</span>`;
        });
        return parts.join('');
    }
    function updateMenuHighlight() {
        menuItems.forEach((item, idx) => {
            if (idx === currentMenuItemIndex) {
                item.classList.add('menu-highlight');
            } else {
                item.classList.remove('menu-highlight');
            }
        });
    }
    function resetMenuHighlight() {
        menuItems.forEach(item => item.classList.remove('menu-highlight'));
        currentMenuItemIndex = 0;
    }
    function renderOutput() {
        const rawText = textInput.value;
        const htmlContent = processTextToHTML(rawText);
        outputBox.innerHTML = htmlContent;
        hidePopup(true);
        const clickableWord = outputBox.querySelectorAll('.word-clickable').length;
        const langName = getSelectedLanguage() === 'greek' ? 'Greek' : 'Latin';
        if (clickableWord > 0) {
            const wordNoun = clickableWord === 1 ? 'word' : 'words';
            statusSpan.innerHTML = `<strong>${clickableWord}</strong> ${wordNoun} ${langName} processed — click on any one.`;
        } else if (rawText.trim().length > 0) {
            statusSpan.innerHTML = `No recognizable words — check your text.`;
        } else {
            statusSpan.innerHTML = 'Ready.';
        }
    }
    function showPopup(wordSpan, cleanWord) {
        hidePopup(false);
        if (activeWordSpan) activeWordSpan.classList.remove('active-word');
        activeWordSpan = wordSpan;
        activeWordSpan.classList.add('active-word');
        currentCleanWord = cleanWord;
        popupWordDisplay.textContent = `${cleanWord}`;
        menuPerseus.href = getPerseusURL(cleanWord);
        menuLogeion.href = getLogeionMorphoURL(cleanWord);
        const rect = wordSpan.getBoundingClientRect();
        const popupWidth = popupMenu.offsetWidth || 190;
        const popupHeight = popupMenu.offsetHeight || 98;
        let top = rect.bottom + 4;
        let left = rect.left;
        if (top + popupHeight > window.innerHeight - 12) {
           top = rect.top - popupHeight - 6;
        }
        if (left + popupWidth > window.innerWidth - 10) {
            left = window.innerWidth - popupWidth - 12;
        }
        if (left < 6) left = 6;
        if (top < 4) top = 4;
        popupMenu.style.top = top + 'px';
        popupMenu.style.left = left + 'px';
        popupMenu.classList.add('visible');
        currentMenuItemIndex = 0;
        updateMenuHighlight();
        const shortWord = cleanWord.length > 28 ? cleanWord.slice(0, 26) + '…' : cleanWord;
        statusSpan.innerHTML = `Searching for “${escapeHTML(shortWord)}” — choose a source (↑/↓, Enter).`;
    }
    function hidePopup(clearActive = true) {
        popupMenu.classList.remove('visible');
        resetMenuHighlight();
        if (clearActive && activeWordSpan) {
            activeWordSpan.classList.remove('active-word');
            activeWordSpan = null;
        }
        if (clearActive) {
            const wCount = outputBox.querySelectorAll('.word-clickable').length;
            const langName = getSelectedLanguage() === 'greek' ? 'Greek' : 'Latin';
            if (wCount > 0) {
                statusSpan.innerHTML = `<strong>${wCount}</strong> ${langName} words ready — click on any one.`;
            } else if (textInput.value.trim() !== '') {
                statusSpan.innerHTML = `No recognized words. Check your text.`;
            } else {
                statusSpan.innerHTML = 'Ready.';
            }
        }
    }
    function processWithIndicator() {
        if (processingLock) return;
        processingLock = true;
        hidePopup(true);
        const originalButtonText = btnProcess.textContent;
        btnProcess.disabled = true;
        btnProcess.textContent = 'Process';
        statusSpan.innerHTML = 'Processing...';
        setTimeout(() => {
            try {
                renderOutput();
            } catch (err) {
                console.warn('Processing error:', err);
                statusSpan.innerHTML = 'Processing error. Try again.';
            } finally {
                btnProcess.disabled = false;
                btnProcess.textContent = originalButtonText;
                processingLock = false;
            }
        }, 12);
    }
    if (outputBox) {
        outputBox.addEventListener('click', function(e) {
            const wordSpan = e.target.closest('.word-clickable');
            if (!wordSpan) {
                hidePopup(true);
                return;
            }
            e.stopPropagation();
            const cleanWord = wordSpan.getAttribute('data-clean') || '';
            if (activeWordSpan === wordSpan && popupMenu.classList.contains('visible')) {
                hidePopup(true);
                return;
            }
            showPopup(wordSpan, cleanWord);
        });
    }
    document.addEventListener('click', function(e) {
        if (!outputBox.contains(e.target) && !popupMenu.contains(e.target) && !btnProcess.contains(e.target)) {
            hidePopup(true);
        }
    });
    document.addEventListener('keydown', function(e) {
        const popupVisible = popupMenu.classList.contains('visible');
        if (popupVisible) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentMenuItemIndex = (currentMenuItemIndex + 1) % menuItems.length;
                updateMenuHighlight();
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentMenuItemIndex = (currentMenuItemIndex - 1 + menuItems.length) % menuItems.length;
                updateMenuHighlight();
                return;
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                const activeMenuItem = menuItems[currentMenuItemIndex];
                if (activeMenuItem) {
                    activeMenuItem.click();
                    hidePopup(true);
                }
                return;
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                hidePopup(true);
                return;
            }
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (!processingLock) {
                processWithIndicator();
            }
        }
    });
    btnProcess.addEventListener('click', function() {
        processWithIndicator();
        btnProcess.style.transform = 'scale(0.97)';
        setTimeout(() => { if(btnProcess) btnProcess.style.transform = ''; }, 80);
    });
    textInput.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (!processingLock) {
                processWithIndicator();
            }
        }
    });
    window.addEventListener('resize', function() {
        if (popupMenu.classList.contains('visible') && activeWordSpan) {
            const clean = activeWordSpan.getAttribute('data-clean') || currentCleanWord;
            if (clean && activeWordSpan) {
                const rect = activeWordSpan.getBoundingClientRect();
                const popWidth = popupMenu.offsetWidth || 190;
                const popHeight = popupMenu.offsetHeight || 98;
                let top = rect.bottom + 4;
                let left = rect.left;
                if (top + popHeight > window.innerHeight - 12) top = rect.top - popHeight - 6;
                if (left + popWidth > window.innerWidth - 10) left = window.innerWidth - popWidth - 12;
                if (left < 6) left = 6;
                if (top < 4) top = 4;
                popupMenu.style.top = top + 'px';
                popupMenu.style.left = left + 'px';
            }
        }
    });
    function addMenuClickHide(menuElement) {
        if (menuElement) {
            menuElement.addEventListener('click', function() {
                setTimeout(() => hidePopup(true), 10);
            });
        }
    }
    addMenuClickHide(menuPerseus);
    addMenuClickHide(menuLogeion);
    setTimeout(() => {
        if (textInput.value.trim() === '') {
            statusSpan.innerHTML = 'Ready.';
        }
    }, 20);
})();