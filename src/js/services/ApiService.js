'use strict';
import { appState } from './state.js';

// Currently, only OpenAI and OpenAI-compatible endpoints are implemented.
// Other providers would require their own request/response handling logic.
const PROVIDER_ENDPOINTS = {
    chatgpt: 'https://api.openai.com/v1/chat/completions',
};

/**
 * Fetches a real, streaming reply from an AI model.
 * @param {function(string)} onStreamChunk - Callback for each piece of text received.
 * @param {function} onStreamEnd - Callback when the stream is finished.
 */
export async function fetchAiReplyStream(onStreamChunk, onStreamEnd) {
    const { provider, apiKey, customUrl, model } = appState.apiSettings;
    const { currentCharacterId, conversations } = appState;

    const endpoint = provider === 'custom' ? customUrl : PROVIDER_ENDPOINTS.chatgpt; // Simplified for now
    
    // Construct the request body according to OpenAI's specification
    const requestBody = {
        model: model || 'gpt-3.5-turbo', // Provide a sensible default
        messages: [
            // Add a system prompt to guide the AI's personality
            { role: 'system', content: `You are ${characters[currentCharacterId].name}. You must speak and act in their persona. Be concise, eloquent, and stay in character.` },
            ...conversations[currentCharacterId]
        ],
        stream: true,
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error (${response.status}): ${errorData.error?.message || 'Unknown error'}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim().startsWith('data: '));
            
            for (const line of lines) {
                const jsonStr = line.replace('data: ', '');
                if (jsonStr === '[DONE]') continue;
                try {
                    const parsed = JSON.parse(jsonStr);
                    const content = parsed.choices[0]?.delta?.content || '';
                    if (content) onStreamChunk(content);
                } catch (e) {
                    console.error('Error parsing stream chunk:', line, e);
                }
            }
        }
    } catch (error) {
        console.error("Fetch stream error:", error);
        onStreamChunk(`\n\n**An error occurred:** *${error.message}*`);
    } finally {
        onStreamEnd();
    }
}
