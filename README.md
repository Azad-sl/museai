# Muse AI - Foreign Classical Literature Masters Dialogue System

This is a pure front-end web application that allows users to engage in conversations with AI-powered personas of famous classical literature masters. The project is built with a focus on high-quality UI/UX, adhering to Apple's Human Interface Guidelines principles.

## Features

- **Multi-Character Dialogue**: Converse with six distinct literary figures: Shakespeare, Goethe, Dante, Tolstoy, Austen, and Hugo.
- **Contextual Conversations**: The AI remembers the context of the conversation for each character.
- **Role Switching**: Seamlessly switch between characters without losing individual chat histories.
- **Flexible AI Provider**: Supports OpenAI (ChatGPT) and any OpenAI-compatible custom API endpoint.
- **Modern UI/UX**:
    - Smooth sidebar animations.
    - iMessage-like chat bubbles.
    - Dark/Light mode support.
    - Responsive design for mobile and desktop.
- **Local Persistence**: All chat history and settings are saved in your browser's `localStorage`, ensuring privacy and data persistence across sessions.
- **Code Highlighting**: Code blocks in AI responses are automatically detected and styled.

## Project Structure
muse-ai/
├── index.html                # Main HTML file
├── README.md                 # Project documentation
├── assets/                   # Images and other static assets
├── lib/                      # Third-party libraries (highlight.js)
└── src/
├── css/                  # CSS files for styling
└── js/                   # JavaScript source code


## How to Run

1.  **Prerequisites**: You need a modern web browser. No server is required as this is a pure front-end application.
2.  **Launching**:
    - Clone or download the repository.
    - Simply open the `index.html` file in your web browser.
    - For best performance and to avoid CORS issues with potential future API integrations, it's recommended to serve the files using a local server (e.g., Python's `http.server`, or the "Live Server" extension in VS Code).
3.  **Configuration**:
    - Click the settings cog icon (<i class="fas fa-cog"></i>) to open the settings panel.
    - Select your AI provider (e.g., ChatGPT).
    - Enter your valid API Key.
    - Optionally specify a model name (e.g., `gpt-4`).
    - Click "Save and Apply".
    - You are now ready to start a conversation!

## Technical Stack

- **HTML5**: Semantic and accessible markup.
- **CSS3**: Custom Properties (Variables), Flexbox, Grid, and smooth animations.
- **JavaScript (ES6+)**: Modular, modern JavaScript without any frameworks.
- **highlight.js**: For syntax highlighting of code blocks.

