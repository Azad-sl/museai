'use strict';
import { persistence } from './Persistence.js';

// --- INITIAL DATA ---
// This could be moved to a separate JSON file in a larger application.
export const characters = {
    'shakespeare': { id: 'shakespeare', name: 'William Shakespeare', title: 'The Bard of Avon', avatar: 'assets/images/shakespeare.png', bio: 'An English playwright, poet, and actor, widely regarded as the greatest writer in the English language and the world\'s pre-eminent dramatist.', greeting: 'Good day, friend. What thoughts stir within thy mind? Speak, and let thy words be the players upon this stage.' },
    'goethe': { id: 'goethe', name: 'Johann von Goethe', title: 'German Polymath', avatar: 'assets/images/goethe.png', bio: 'A German writer and statesman. His works include epic and lyric poetry, dramas, memoirs, an autobiography, and treatises on botany, anatomy, and colour.', greeting: 'Willkommen! Nature, art, science... the universe is full of wonders. What shall we explore together?' },
    'dante': { id: 'dante', name: 'Dante Alighieri', title: 'Supreme Poet', avatar: 'assets/images/dante.png', bio: 'An Italian poet, writer and philosopher. His Divine Comedy is widely considered one of the most important poems of the Middle Ages and the greatest literary work in the Italian language.', greeting: 'Greetings, traveler. You find me pondering the path to righteousness. What allegories does your journey present?' },
    'tolstoy': { id: 'tolstoy', name: 'Leo Tolstoy', title: 'Russian Novelist', avatar: 'assets/images/tolstoy.png', bio: 'A Russian writer who is regarded as one of the greatest authors of all time. He is best known for the novels War and Peace and Anna Karenina.', greeting: 'Hello. The simplest truth is often the most profound. Let us discuss life, faith, and the human condition.' },
    'austen': { id: 'austen', name: 'Jane Austen', title: 'English Novelist', avatar: 'assets/images/austen.png', bio: 'An English novelist known for her six major novels, which interpret, critique and comment upon the British landed gentry at the end of the 18th century.', greeting: 'It is a pleasure to make your acquaintance. Tell me, what observations of society and manners have you made of late?' },
    'hugo': { id: 'hugo', name: 'Victor Hugo', title: 'French Poet & Novelist', avatar: 'assets/images/hugo.png', bio: 'A French poet, novelist, and dramatist of the Romantic movement. He is considered to be one of the greatest and best-known French writers.', greeting: 'Bonjour! The human heart is a tempest of passion and pity. Let us speak of justice, love, and the struggles of the soul.' }
};

// --- DYNAMIC STATE ---

const defaultSettings = {
    provider: 'chatgpt',
    apiKey: '',
    customUrl: '',
    model: ''
};

const defaultState = {
    theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    currentCharacterId: null,
    isSidebarCollapsed: false,
};

// Application state is the single source of truth.
// It's initialized by merging defaults with any data saved in localStorage.
export const appState = {
    ...defaultState,
    ...persistence.loadState(),
    conversations: persistence.loadConversations() || {},
    apiSettings: {
        ...defaultSettings,
        ...persistence.loadSettings(),
    },
};

// --- STATE MANAGEMENT FUNCTIONS (Mutations) ---

/**
 * Sets the active character and initializes their conversation history.
 * @param {string} charId - The ID of the character.
 */
export function setCurrentCharacter(charId) {
    appState.currentCharacterId = charId;
    if (!appState.conversations[charId]) {
        appState.conversations[charId] = [
            { role: 'ai', content: characters[charId].greeting }
        ];
    }
    persistence.saveState(appState);
    persistence.saveConversations(appState.conversations);
}

/**
 * Adds a new message to the current character's conversation.
 * @param {'user' | 'ai'} role - The sender's role.
 * @param {string} content - The message content.
 */
export function addMessage(role, content) {
    if (!appState.currentCharacterId || !content) return;
    appState.conversations[appState.currentCharacterId].push({ role, content });
    persistence.saveConversations(appState.conversations);
}

/**
 * Resets the application to the character selection screen.
 */
export function resetToHome() {
    appState.currentCharacterId = null;
    persistence.saveState(appState);
}

/**
 * Updates the API settings and saves them.
 * @param {object} newSettings - The new settings object.
 */
export function updateSettings(newSettings) {
    Object.assign(appState.apiSettings, newSettings);
    persistence.saveSettings(appState.apiSettings);
}
