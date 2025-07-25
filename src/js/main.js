'use strict';

// Import all required modules
import { characters, appState, setCurrentCharacter, addMessage, resetToHome } from './services/state.js';
import * as UIManager from './components/UIManager.js';
import { initializeSettings } from './components/SettingsManager.js';
import { fetchAiReplyStream } from './services/ApiService.js';
import { persistence } from './services/Persistence.js';

/**
 * Encapsulates the main application logic.
 * Follows the revealing module pattern.
 */
function App() {
    // Cache of DOM elements for performance
    const elements = {
        sidebar: document.getElementById('sidebar'),
        sidebarToggleClose: document.getElementById('sidebar-toggle-close'),
        sidebarToggleOpen: document.getElementById('sidebar-toggle-open'),
        themeToggle: document.getElementById('theme-toggle-btn'),
        newChatBtn: document.getElementById('new-chat-btn'),
        characterGrid: document.getElementById('character-grid'),
        sendBtn: document.getElementById('send-btn'),
        chatInput: document.getElementById('chat-input'),
        bioBtn: document.getElementById('bio-btn'),
        closeBioModalBtn: document.getElementById('close-bio-modal-btn'),
        bioModalBackdrop: document.getElementById('bio-modal-backdrop'),
    };

    let isSending = false;

    // --- Event Handlers ---

    function handleThemeToggle() {
        appState.theme = appState.theme === 'light' ? 'dark' : 'light';
        UIManager.setTheme(appState.theme);
        persistence.saveState(appState);
    }

    function handleSidebarToggle() {
        appState.isSidebarCollapsed = !appState.isSidebarCollapsed;
        UIManager.toggleSidebar(appState.isSidebarCollapsed);
        if (window.innerWidth <= 768) { // On mobile, a different class toggles
            elements.sidebar.classList.toggle('open', !appState.isSidebarCollapsed);
        }
        persistence.saveState(appState);
    }

    function handleCharacterSelect(event, charId = null) {
        if (!charId) {
            const card = event.target.closest('.character-card');
            if (!card) return;
            charId = card.dataset.characterId;
        }

        setCurrentCharacter(charId);
        
        const characterData = characters[charId];
        UIManager.switchToChatView(characterData);
        UIManager.renderConversation(appState.conversations[charId]);

        if (window.innerWidth <= 768 && elements.sidebar.classList.contains('open')) {
            handleSidebarToggle();
        }
    }

    function handleNewChat() {
        resetToHome();
        UIManager.switchToCharacterView();
        if (window.innerWidth <= 768 && elements.sidebar.classList.contains('open')) {
            handleSidebarToggle();
        }
    }

    async function handleSendMessage() {
        if (isSending) return;
        
        const userInput = elements.chatInput.value.trim();
        if (!userInput) return;
        
        if (!appState.apiSettings.apiKey) {
            UIManager.showInputError('API Key is required.');
            return;
        }

        isSending = true;
        UIManager.toggleSendButton(false);
        
        addMessage('user', userInput);
        UIManager.renderMessage({ role: 'user', content: userInput });
        UIManager.clearChatInput();
        UIManager.showTypingIndicator();

        let fullResponse = '';
        let aiBubble;

        const onStreamChunk = (chunk) => {
            UIManager.removeTypingIndicator();
            fullResponse += chunk;
            if (!aiBubble) {
                aiBubble = UIManager.renderMessage({ role: 'ai', content: fullResponse });
            } else {
                aiBubble.textContent = fullResponse; // For performance, just update text content during stream
            }
        };

        const onStreamEnd = () => {
            if (fullResponse) {
                addMessage('ai', fullResponse);
                UIManager.renderMessageContent(aiBubble, fullResponse); // Re-render with Markdown and code highlighting
            }
            isSending = false;
            UIManager.toggleSendButton(true);
        };

        await fetchAiReplyStream(onStreamChunk, onStreamEnd);
    }

    function handleBioButtonClick(event) {
        let charId;
        if (event.currentTarget.id === 'bio-btn') {
            charId = appState.currentCharacterId;
        } else {
             const card = event.target.closest('.character-card');
            if (card) charId = card.dataset.characterId;
        }
        
        if (charId && characters[charId]) {
            UIManager.updateBioModalContent(characters[charId]);
            UIManager.toggleBioModal(true);
        }
    }

    function closeBioModal() {
        UIManager.toggleBioModal(false);
    }

    // --- Initialization ---

    function bindEventListeners() {
        elements.themeToggle.addEventListener('click', handleThemeToggle);
        elements.sidebarToggleClose.addEventListener('click', handleSidebarToggle);
        elements.sidebarToggleOpen.addEventListener('click', handleSidebarToggle);
        elements.newChatBtn.addEventListener('click', handleNewChat);
        elements.characterGrid.addEventListener('click', handleCharacterSelect);
        elements.sendBtn.addEventListener('click', handleSendMessage);
        elements.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });
        elements.chatInput.addEventListener('input', UIManager.handleInputGrowth);
        elements.bioBtn.addEventListener('click', handleBioButtonClick);
        elements.closeBioModalBtn.addEventListener('click', closeBioModal);
        elements.bioModalBackdrop.addEventListener('click', (e) => {
            if (e.target === elements.bioModalBackdrop) closeBioModal();
        });
    }

    function init() {
        console.log("Muse AI Initializing...");
        UIManager.setTheme(appState.theme);
        UIManager.renderCharacterCards(characters, elements.characterGrid);
        initializeSettings();
        bindEventListeners();

        // Restore last session if available
        if (appState.currentCharacterId) {
            handleCharacterSelect(null, appState.currentCharacterId);
        }
        
        console.log("Application is ready.");
    }

    return { init };
}

// Start the application once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = App();
    app.init();
});
