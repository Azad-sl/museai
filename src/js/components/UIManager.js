'use strict';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

// --- DOM Element Cache ---
const elements = {
    body: document.body,
    sidebar: document.getElementById('sidebar'),
    sendBtn: document.getElementById('send-btn'),
    characterSelectorView: document.getElementById('character-selector'),
    chatView: document.getElementById('chat-view'),
    chatHeaderAvatar: document.getElementById('chat-header-avatar'),
    chatCharacterName: document.getElementById('chat-character-name'),
    messageList: document.getElementById('message-list'),
    chatInput: document.getElementById('chat-input'),
    bioModalBackdrop: document.getElementById('bio-modal-backdrop'),
    bioModalTitle: document.getElementById('bio-modal-title'),
    bioModalContent: document.getElementById('bio-modal-content'),
    inputErrorMsg: document.getElementById('input-error-msg'),
};

// --- RENDER & UI MANIPULATION FUNCTIONS ---

/**
 * Sets the color theme for the entire application.
 * @param {'light' | 'dark'} theme - The theme to apply.
 */
export function setTheme(theme) {
    elements.body.dataset.theme = theme;
    document.getElementById('theme-toggle-btn').querySelector('i').className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
}

/**
 * Toggles the collapsed state of the sidebar.
 * @param {boolean} isCollapsed - The desired state.
 */
export function toggleSidebar(isCollapsed) {
    elements.sidebar.classList.toggle('collapsed', isCollapsed);
}

/**
 * Renders the character selection cards on the screen.
 * @param {object} characters - The character data object.
 * @param {HTMLElement} gridContainer - The container to render cards into.
 */
export function renderCharacterCards(characters, gridContainer) {
    gridContainer.innerHTML = '';
    for (const charId in characters) {
        const char = characters[charId];
        const card = document.createElement('div');
        card.className = 'character-card';
        card.dataset.characterId = char.id;
        card.innerHTML = `
            <img src="${char.avatar}" alt="${char.name}">
            <h3>${char.name}</h3>
            <p>${char.title}</p>
        `;
        gridContainer.appendChild(card);
    }
}

/**
 * Switches the main view from character selection to the chat interface.
 * @param {object} character - The character object to display in the header.
 */
export function switchToChatView(character) {
    elements.characterSelectorView.hidden = true;
    elements.chatView.hidden = false;
    elements.chatHeaderAvatar.src = character.avatar;
    elements.chatHeaderAvatar.alt = character.name;
    elements.chatCharacterName.textContent = character.name;
    elements.chatInput.focus();
}

/**
 * Switches the main view back to the character selection screen.
 */
export function switchToCharacterView() {
    elements.chatView.hidden = true;
    elements.characterSelectorView.hidden = false;
}

/**
 * Renders an entire conversation history into the message list.
 * @param {Array<object>} conversation - Array of message objects.
 */
export function renderConversation(conversation) {
    elements.messageList.innerHTML = '';
    conversation.forEach(message => renderMessage(message, false));
    scrollToBottom();
}

/**
 * Renders a single message bubble.
 * @param {object} message - { role: 'user' | 'ai', content: '...' }.
 * @param {boolean} shouldScroll - Whether to scroll to the bottom.
 * @returns {HTMLElement} The created message bubble element.
 */
export function renderMessage({ role, content }, shouldScroll = true) {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = `message ${role}`;
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    
    renderMessageContent(bubble, content);

    messageWrapper.appendChild(bubble);
    elements.messageList.appendChild(messageWrapper);
    if (shouldScroll) scrollToBottom();
    return bubble;
}

/**
 * Renders the content of a message bubble, applying markdown and code highlighting.
 * @param {HTMLElement} bubbleEl - The message bubble element.
 * @param {string} content - The raw text content.
 */
export function renderMessageContent(bubbleEl, content) {
    bubbleEl.innerHTML = marked.parse(content);
    bubbleEl.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
}

export function showTypingIndicator() {
    if (document.querySelector('.message.typing')) return;
    const typingIndicatorHTML = `<div class="message ai typing"><div class="message-bubble"><span></span><span></span><span></span></div></div>`;
    elements.messageList.insertAdjacentHTML('beforeend', typingIndicatorHTML);
    scrollToBottom();
}

export function removeTypingIndicator() {
    document.querySelector('.message.typing')?.remove();
}

export function clearChatInput() {
    elements.chatInput.value = '';
    handleInputGrowth();
}

/**
 * Makes the chat input textarea grow vertically with content.
 */
export function handleInputGrowth() {
    elements.chatInput.style.height = 'auto';
    elements.chatInput.style.height = `${Math.min(elements.chatInput.scrollHeight, 200)}px`;
}

export function toggleSendButton(enabled) {
    elements.sendBtn.disabled = !enabled;
}

export function showInputError(message) {
    elements.inputErrorMsg.textContent = message;
    elements.inputErrorMsg.hidden = false;
    setTimeout(() => {
        elements.inputErrorMsg.hidden = true;
    }, 3000);
}

/**
 * Toggles the visibility of the biography modal.
 * @param {boolean} show - Whether to show or hide the modal.
 */
export function toggleBioModal(show) {
    elements.bioModalBackdrop.hidden = !show;
}


/**
 * Updates the content of the biography modal.
 * @param {object} character - The character data to display.
 */
export function updateBioModalContent(character) {
    elements.bioModalTitle.textContent = `Biography: ${character.name}`;
    elements.bioModalContent.textContent = character.bio;
}

function scrollToBottom() {
    elements.messageList.scrollTop = elements.messageList.scrollHeight;
}
