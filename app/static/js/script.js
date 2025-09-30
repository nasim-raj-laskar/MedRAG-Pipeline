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
    
    // Event listeners
    if (inputField) {
        inputField.addEventListener('input', autoResize);
        inputField.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                form.submit();
            }
        });
        
        // Initial resize
        autoResize();
    }
    
    // Initial scroll to bottom
    scrollToBottom();
    
    // Focus input field on load
    if (inputField) {
        inputField.focus();
    }
});