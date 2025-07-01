   document.addEventListener('DOMContentLoaded', () => {
       const userInput = document.getElementById('user-input');
       const sendButton = document.getElementById('send-button');
       const chatMessages = document.getElementById('chat-messages');


       // --- IMPORTANT: Backend URL ---
       // This is the URL of your Glitch project's backend endpoint.
       // Replace with your actual Glitch project URL (e.g., https://your-glitch-project.glitch.me/chat)
       const BACKEND_CHAT_URL = "https://flagchrome-ai-assistant.onrender.com/chat"; // REPLACE THIS LATER!


       // Function to add a message to the chat display
       function addMessage(text, sender) {
           const messageDiv = document.createElement('div');
           messageDiv.classList.add('message-bubble', sender === 'user' ? 'user-message' : 'bot-message');
           messageDiv.innerHTML = `<p>${text}</p>`;
           chatMessages.appendChild(messageDiv);
           chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to the latest message
       }


       // Function to simulate typing indicator
       function showTypingIndicator() {
           const typingDiv = document.createElement('div');
           typingDiv.classList.add('message-bubble', 'bot-message', 'typing-indicator', 'animate-pulse');
           typingDiv.innerHTML = `<p>...</p>`; // Simple dots for typing
           typingDiv.id = 'typing-indicator';
           chatMessages.appendChild(typingDiv);
           chatMessages.scrollTop = chatMessages.scrollHeight;
       }


       // Function to remove typing indicator
       function removeTypingIndicator() {
           const typingIndicator = document.getElementById('typing-indicator');
           if (typingIndicator) {
               typingIndicator.remove();
           }
       }


       // Function to send message to the AI and get a response via backend
       async function sendMessageToAI(message) {
           showTypingIndicator(); // Show typing indicator


           try {
               const response = await fetch(BACKEND_CHAT_URL, {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json'
                   },
                   body: JSON.stringify({ message: message }) // Send message to your backend
               });


               if (!response.ok) {
                   const errorData = await response.json();
                   console.error("Backend Error:", errorData);
                   addMessage("Oops! My backend encountered an error. Please try again later.", 'bot');
                   return;
               }


               const result = await response.json();
               let aiResponseText = result.reply || "I couldn't generate a response for that.";


               addMessage(aiResponseText, 'bot');


           } catch (error) {
               console.error("Error communicating with backend:", error);
               addMessage("I'm having trouble connecting to my brain right now. Please check your internet or try again later.", 'bot');
           } finally {
               removeTypingIndicator(); // Always remove typing indicator
           }
       }


       // Event handler for sending messages
       async function handleSendMessage() {
           const message = userInput.value.trim();
           if (message) {
               addMessage(message, 'user');
               userInput.value = ''; // Clear input field
               await sendMessageToAI(message);
           }
       }


       // Attach event listeners
       sendButton.addEventListener('click', handleSendMessage);
       userInput.addEventListener('keypress', (event) => {
           if (event.key === 'Enter') {
               handleSendMessage();
           }
       });
   });
