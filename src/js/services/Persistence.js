'use strict';

const STORAGE_KEY_PREFIX = 'museAI_';
const KEYS = {
    STATE: `${STORAGE_KEY_PREFIX}appState`,
    SETTINGS: `${STORAGE_KEY_PREFIX}apiSettings`,
    CONVERSATIONS: `${STORAGE_KEY_PREFIX}conversations`,
};

/**
 * Saves a JavaScript object to localStorage as a JSON string.
 * @param {string} key - The key under which to store the data.
 * @param {object} data - The data to store.
 */
function save(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error("Error saving to localStorage", e);
    }
}

/**
 * Loads and parses a JSON string from localStorage.
 * @param {string} key - The key of the data to retrieve.
 * @returns {object|null} The parsed object, or null if not found or on error.
 */
function load(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error("Error loading from localStorage", e);
        return null;
    }
}

/**
 * A singleton object for managing persistence, abstracting away localStorage implementation details.
 */
export const persistence = {
    // Saves only non-sensitive parts of the main state
    saveState: (state) => save(KEYS.STATE, { 
        theme: state.theme, 
        currentCharacterId: state.currentCharacterId, 
        isSidebarCollapsed: state.isSidebarCollapsed 
    }),
    loadState: () => load(KEYS.STATE),
    
    saveSettings: (settings) => save(KEYS.SETTINGS, settings),
    loadSettings: () => load(KEYS.SETTINGS),
    
    saveConversations: (conversations) => save(KEYS.CONVERSATIONS, conversations),
    loadConversations: () => load(KEYS.CONVERSATIONS),
};
