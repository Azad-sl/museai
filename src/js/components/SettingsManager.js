'use strict';
import { appState, updateSettings } from '../services/state.js';

const elements = {
    backdrop: document.getElementById('settings-modal-backdrop'),
    modal: document.getElementById('settings-modal'),
    closeBtn: document.getElementById('close-settings-modal-btn'),
    openBtn: document.getElementById('settings-btn'),
    saveBtn: document.getElementById('save-settings-btn'),
    providerSelect: document.getElementById('api-provider-select'),
    customUrlGroup: document.getElementById('custom-api-url-group'),
    customUrlInput: document.getElementById('custom-api-url'),
    apiKeyInput: document.getElementById('api-key-input'),
    modelNameInput: document.getElementById('model-name-input'),
};

function openModal() {
    // Load current settings into the form each time it's opened
    elements.providerSelect.value = appState.apiSettings.provider;
    elements.customUrlInput.value = appState.apiSettings.customUrl;
    elements.apiKeyInput.value = appState.apiSettings.apiKey;
    elements.modelNameInput.value = appState.apiSettings.model;
    toggleCustomUrlVisibility();
    elements.backdrop.hidden = false;
    elements.modal.querySelector('input, select').focus(); // Accessibility improvement
}

function closeModal() {
    elements.backdrop.hidden = true;
}

function saveSettings() {
    const newSettings = {
        provider: elements.providerSelect.value,
        customUrl: elements.customUrlInput.value.trim(),
        apiKey: elements.apiKeyInput.value.trim(),
        model: elements.modelNameInput.value.trim(),
    };
    updateSettings(newSettings);
    closeModal();
    // Simple feedback, a more elegant toast/notification could be implemented
    alert("Settings saved!");
}

function toggleCustomUrlVisibility() {
    elements.customUrlGroup.hidden = elements.providerSelect.value !== 'custom';
}

/**
 * Initializes the settings panel, binding all necessary event listeners.
 */
export function initializeSettings() {
    elements.openBtn.addEventListener('click', openModal);
    elements.closeBtn.addEventListener('click', closeModal);
    elements.backdrop.addEventListener('click', (e) => {
        if (e.target === elements.backdrop) closeModal();
    });
    elements.saveBtn.addEventListener('click', saveSettings);
    elements.providerSelect.addEventListener('change', toggleCustomUrlVisibility);
}
