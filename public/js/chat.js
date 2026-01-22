// Safe Socket Init
let socket;
try {
    socket = io();
} catch (e) {
    console.error('Socket.io not loaded', e);
    // alert('Erreur: Socket.io non chargé. Le serveur est-il lancé ?');
}

// Get query params
const urlParams = new URLSearchParams(window.location.search);
const receiverName = urlParams.get('receiverName');
// Uncomment this to debug if needed
// alert('Nom reçu: ' + receiverName); 

const receiverId = urlParams.get('receiverId') || 'default-room';

// Get current user
const currentUser = JSON.parse(localStorage.getItem('user'));

if (!currentUser) {
    window.location.href = 'login.html';
}

// Update UI with receiver info
document.addEventListener('DOMContentLoaded', () => {
    // Get query params again inside to be safe or reuse top level scoped
    // But since elements are needed, we run this here.

    if (receiverName) {
        const partnerNameEl = document.getElementById('chat-partner-name');
        const headerNameEl = document.getElementById('chat-header-name');

        if (partnerNameEl) partnerNameEl.textContent = receiverName;
        if (headerNameEl) headerNameEl.textContent = receiverName;

        // Generate Initials
        const initials = receiverName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

        // Update Sidebar Avatar
        const sidebarAvatar = document.querySelector('.conversation-item.active .avatar-small');
        if (sidebarAvatar) {
            sidebarAvatar.innerHTML = `<span style="font-weight:bold; font-size:1rem; color:white;">${initials}</span>`;
            sidebarAvatar.style.backgroundColor = 'var(--primary-color)';
            sidebarAvatar.style.display = 'flex';
            sidebarAvatar.style.alignItems = 'center';
            sidebarAvatar.style.justifyContent = 'center';
        }

        // Update Header Avatar
        const headerAvatar = document.querySelector('.chat-user-info .avatar-small');
        if (headerAvatar) {
            headerAvatar.innerHTML = `<span style="font-weight:bold; font-size:1.2rem; color:white;">${initials}</span>`;
            headerAvatar.style.backgroundColor = 'var(--primary-color)';
            headerAvatar.style.display = 'flex';
            headerAvatar.style.alignItems = 'center';
            headerAvatar.style.justifyContent = 'center';
        }

        // Mobile: Show chat view
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) chatContainer.classList.add('show-chat');
    } else {
        // Mobile: Show list view
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) chatContainer.classList.add('show-list');
    }
});

// Mobile Back Button
document.getElementById('back-to-list').addEventListener('click', () => {
    document.querySelector('.chat-container').classList.remove('show-chat');
    document.querySelector('.chat-container').classList.add('show-list');
});

// Join room
// Proper room ID logic would be sorted IDs of both users: [uid1, uid2].sort().join('-')
// For prototype, we use a simple logic or just the receiverId if it's a direct link
const roomId = [currentUser.id || 'u1', receiverId].sort().join('-');

socket.emit('join-room', roomId);
console.log(`Joined room: ${roomId}`);

// Fetch history
fetch(`http://localhost:5001/api/chat/history/${roomId}`)
    .then(res => res.json())
    .then(messages => {
        messages.forEach(msg => {
            appendMessage({
                userId: msg.senderId, // Map senderId to userId for appendMessage
                text: msg.text,
                timestamp: msg.timestamp
            });
        });
    })
    .catch(err => console.error('Error fetching history:', err));

// Listen for messages
const messagesArea = document.getElementById('messages-area');

socket.on('receive-message', (message) => {
    appendMessage(message);
});

// Send message
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();

    if (text) {
        socket.emit('send-message', {
            roomId,
            userId: currentUser.id || 'u1', // Fallback for dev without proper ID
            text
        });
        messageInput.value = '';
    }
});

function appendMessage(message) {
    const div = document.createElement('div');
    const isMe = message.userId === (currentUser.id || 'u1');

    div.className = `message ${isMe ? 'message-sent' : 'message-received'}`;
    div.innerHTML = `
        <div class="message-content">
            ${message.text}
        </div>
        <div class="message-time">
            ${new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
    `;

    messagesArea.appendChild(div);
    messagesArea.scrollTop = messagesArea.scrollHeight;
}
