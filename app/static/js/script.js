// Medical RAG Bot - Enhanced JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const inputField = document.getElementById('prompt');
    const sendButton = document.getElementById('send-button');
    const form = document.getElementById('chat-form');
    
    // Auto-scroll to bottom of chat
    function scrollToBottom() {
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    // Auto-resize textarea
    function autoResize() {
        inputField.style.height = 'auto';
        inputField.style.height = Math.min(inputField.scrollHeight, 120) + 'px';
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="message-header">
                    🏥 Medical Assistant
                </div>
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <span style="margin-left: 10px;">Thinking...</span>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Show toast notification
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
    
    // Copy text to clipboard
    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(() => {
            button.textContent = '✓ Copied';
            button.classList.add('copied');
            showToast('Message copied to clipboard!');
            
            setTimeout(() => {
                button.textContent = '📋 Copy';
                button.classList.remove('copied');
            }, 2000);
        }).catch(() => {
            showToast('Failed to copy message', 'error');
        });
    }
    
    // Add timestamps to existing messages
    function addTimestamps() {
        const messages = document.querySelectorAll('.message');
        messages.forEach(message => {
            if (!message.querySelector('.message-timestamp')) {
                const timestamp = document.createElement('div');
                timestamp.className = 'message-timestamp';
                timestamp.textContent = new Date().toLocaleTimeString();
                message.querySelector('.message-content').appendChild(timestamp);
            }
        });
    }
    
    // Add copy buttons to assistant messages
    function addCopyButtons() {
        const assistantMessages = document.querySelectorAll('.message.assistant');
        assistantMessages.forEach(message => {
            if (!message.querySelector('.copy-button')) {
                const messageText = message.querySelector('.message-text').textContent;
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'message-actions';
                
                const copyButton = document.createElement('button');
                copyButton.className = 'copy-button';
                copyButton.textContent = '📋 Copy';
                copyButton.onclick = () => copyToClipboard(messageText, copyButton);
                
                const timestamp = message.querySelector('.message-timestamp');
                actionsDiv.appendChild(copyButton);
                
                if (timestamp) {
                    message.querySelector('.message-content').insertBefore(actionsDiv, timestamp);
                } else {
                    message.querySelector('.message-content').appendChild(actionsDiv);
                }
            }
        });
    }
    
    // Export conversation
    function exportConversation() {
        const messages = document.querySelectorAll('.message');
        if (messages.length === 0) {
            showToast('No messages to export', 'error');
            return;
        }
        
        let conversation = 'Medical RAG Bot Conversation\n';
        conversation += '================================\n';
        conversation += `Exported on: ${new Date().toLocaleString()}\n\n`;
        
        messages.forEach((message, index) => {
            const role = message.classList.contains('user') ? 'You' : 'Medical Assistant';
            const messageText = message.querySelector('.message-text');
            const content = messageText ? messageText.textContent.trim() : 'No content';
            
            conversation += `${index + 1}. ${role}:\n${content}\n\n`;
        });
        
        try {
            const blob = new Blob([conversation], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `medical-chat-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showToast('Conversation exported successfully!');
        } catch (error) {
            showToast('Failed to export conversation', 'error');
            console.error('Export error:', error);
        }
    }
    
    // Set loading state
    function setLoadingState(loading) {
        if (loading) {
            sendButton.classList.add('loading');
            sendButton.disabled = true;
            inputField.disabled = true;
            showTypingIndicator();
        } else {
            sendButton.classList.remove('loading');
            sendButton.disabled = false;
            inputField.disabled = false;
            hideTypingIndicator();
        }
    }
    
    // Event listeners
    if (inputField) {
        inputField.addEventListener('input', autoResize);
        inputField.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!sendButton.disabled && inputField.value.trim().length >= 3) {
                    form.submit();
                }
            }
        });
        
        // Initial resize
        autoResize();
    }
    
    // Form submission with loading state
    if (form) {
        form.addEventListener('submit', function(e) {
            const inputValue = inputField.value.trim();
            if (inputValue.length < 3) {
                e.preventDefault();
                showToast('Please enter a more detailed question (at least 3 characters)', 'error');
                return false;
            }
            if (inputValue.length > 500) {
                e.preventDefault();
                showToast('Question too long. Please keep it under 500 characters', 'error');
                return false;
            }
            setLoadingState(true);
        });
    }
    
    // Connect export button
    const exportButton = document.getElementById('export-button');
    if (exportButton) {
        exportButton.addEventListener('click', exportConversation);
    }
    
    // Initialize features
    addTimestamps();
    addCopyButtons();
    scrollToBottom();
    
    // Focus input field on load
    if (inputField) {
        inputField.focus();
    }
    
    // Auto-refresh features for new messages
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                addTimestamps();
                addCopyButtons();
                scrollToBottom();
            }
        });
    });
    
    if (chatMessages) {
        observer.observe(chatMessages, { childList: true, subtree: true });
    }
});