// Safe Socket Init
let socket;
try {
    socket = io();
} catch (e) {
    console.error('Socket.io not loaded', e);
}

// Get current user
const currentUser = JSON.parse(localStorage.getItem('user'));
if (!currentUser) {
    window.location.href = 'login.html';
}
const currentUserId = currentUser._id;
let selectedUserId = null;
let unreadMap = {}; // React State equivalent

// Initialisation "useEffect"
document.addEventListener('DOMContentLoaded', () => {
    loadSidebarData();
});

// Flux de chargement
async function loadSidebarData() {
    try {
        // Appelle unread-count au chargement
        const unreadRes = await fetch(`/api/messages/unread-count?currentUserId=${currentUserId}`);
        unreadMap = await unreadRes.json();
        
        // Ensuite charge les utilisateurs
        fetchUsers();
    } catch(err) {
        console.error("Erreur unread-count:", err);
        fetchUsers(); // Fallback
    }
}

// 1. Logique de la Liste des Contacts (Sidebar)
async function fetchUsers() {
    try {
        const res = await fetch('/api/users');
        const users = await res.json();
        
        const list = document.getElementById('conversations-list');
        list.innerHTML = '';
        
        // Ne pas s'afficher soi-même
        const filteredUsers = users.filter(u => u._id !== currentUserId);
        
        if (filteredUsers.length === 0) {
            list.innerHTML = '<div style="padding: 1rem; color: rgba(184,180,170,0.5);">Aucun contact trouvé</div>';
            return;
        }

        filteredUsers.forEach(user => {
            const initials = user.name.substring(0, 2).toUpperCase();
            const div = document.createElement('div');
            div.className = 'conversation-item';
            div.dataset.id = user._id; // Store ID on element
            
            // Cherche dans unreadMap au lieu du retour direct de user (/api/users)
            const count = unreadMap[user._id] || 0;
            
            // Construction du badge exactement selon les instructions
            const unreadBadge = count > 0 
                ? `<span class="unread-badge" style="width: 20px; height: 20px; background: #c48660; border-radius: 50%; color: white; font-size: 12px; display: flex; align-items: center; justify-content: center;">${count}</span>`
                : '';

            div.innerHTML = `
                <div class="avatar-small" style="background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: var(--c-off);">
                    <span style="font-weight: 400; font-size: 1rem;">${initials}</span>
                </div>
                <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                        <div class="conversation-name" style="${count > 0 ? 'color: var(--c-white); font-weight: 500;' : ''}">${user.name}</div>
                        <div class="badge-container" style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                            <span style="font-size: 0.75rem; color: ${count > 0 ? '#c48660' : 'rgba(184,180,170,0.5)'}; font-weight: ${count > 0 ? '600' : 'normal'};">${user.role === 'senior' ? 'Expert' : 'Apprenti'}</span>
                            ${unreadBadge}
                        </div>
                    </div>
                    <div class="conversation-last-msg" style="${count > 0 ? 'color: rgba(244,242,238,0.8);' : ''}">Cliquez pour discuter...</div>
                </div>
            `;
            
            // Ajoute la fonction handleSelectContact
            div.addEventListener('click', () => handleSelectContact(user, div, initials));
            
            list.appendChild(div);
        });
        
        // Auto select by query param
        const urlParams = new URLSearchParams(window.location.search);
        const autoReceiverId = urlParams.get('receiverId');
        if (autoReceiverId) {
            const el = document.querySelector(`.conversation-item[data-id="${autoReceiverId}"]`);
            if (el) el.click();
        }

    } catch(err) {
        console.error("Erreur de récupération des utilisateurs:", err);
    }
}

// Fonction de sélection de contact et Mark-Read
function handleSelectContact(user, div, initials) {
    document.querySelectorAll('.conversation-item').forEach(el => el.classList.remove('active'));
    div.classList.add('active');
    
    selectedUserId = user._id;
    
    // Mettre à jour le Header
    document.getElementById('chat-header-name').textContent = user.name;
    const headerAvatar = document.querySelector('.chat-user-info .avatar-small');
    if (headerAvatar) {
        headerAvatar.innerHTML = `<span style="font-weight:bold; font-size:1.1rem; color:var(--c-warm, #c8855a);">${initials}</span>`;
    }

    // Remettre le compteur à zéro immédiatement (Mise à jour état local)
    unreadMap[user._id] = 0;
    
    // Effacer le style "non lu" de la DOM
    const badgeEl = div.querySelector('.unread-badge');
    if (badgeEl) badgeEl.remove();
    div.querySelector('.conversation-name').style.color = '';
    div.querySelector('.conversation-name').style.fontWeight = '';
    div.querySelector('.conversation-last-msg').style.color = '';
    const roleSpan = div.querySelector('span[style*="font-size: 0.75rem"]');
    if (roleSpan) {
        roleSpan.style.color = 'rgba(184,180,170,0.5)';
        roleSpan.style.fontWeight = 'normal';
    }
    
    // Requête PUT pour passer tous les messages de isRead:false à isRead:true
    fetch(`/api/messages/mark-read/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUserId: currentUserId })
    }).catch(err => console.error("Erreur mark-read", err));

    // Rejoindre la room (Realtime)
    const roomId = [currentUserId, selectedUserId].sort().join('-');
    if (socket) socket.emit('join-room', roomId);
    
    // Charger l'historique de la conversation
    fetchMessages(selectedUserId);
    
    // Mobile
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) chatContainer.classList.add('show-chat');
}

// 2. Chargement des Messages (Flux de données)
async function fetchMessages(recipientId) {
    const messagesArea = document.getElementById('messages-area');
    messagesArea.innerHTML = '<div class="text-center" style="color:var(--c-muted);margin-top:2rem;">Synchronisation... <i class="fas fa-circle-notch fa-spin"></i></div>';
    
    try {
        const res = await fetch(`/api/messages/${recipientId}?currentUserId=${currentUserId}`);
        const messages = await res.json();
        
        messagesArea.innerHTML = '';
        
        if (messages.length === 0) {
            messagesArea.innerHTML = `
                <div class="text-center" style="color: rgba(184,180,170,0.4); margin-top:2rem; font-family: var(--font-ui); font-size: 0.88rem;">
                    Début de la conversation
                </div>
            `;
            return;
        }
        
        messages.forEach(msg => appendMessage(msg));
    } catch(err) {
        console.error("Erreur de récupération des messages:", err);
        messagesArea.innerHTML = '<div class="text-center" style="color:#c48660;margin-top:2rem;">Erreur de connexion.</div>';
    }
}

// 3. Fonction pour ajouter un message à l'interface
function appendMessage(msg) {
    const isMe = msg.senderId === currentUserId;
    const div = document.createElement('div');
    
    div.className = `message ${isMe ? 'message-sent' : 'message-received'}`;
    div.innerHTML = `
        <div class="message-content">${msg.text}</div>
        <div class="message-time">
            ${new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
    `;
    
    const messagesArea = document.getElementById('messages-area');
    messagesArea.appendChild(div);
    messagesArea.scrollTop = messagesArea.scrollHeight; // Auto-scroll
}

// 4. Envoi Réel (POST)
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!selectedUserId) {
        alert("Sélectionnez un contact dans la liste pour commencer à discuter.");
        return;
    }
    
    const text = messageInput.value.trim();
    if (!text) return;
    
    try {
        const res = await fetch('/api/messages/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                senderId: currentUserId,
                receiverId: selectedUserId,
                content: text
            })
        });
        
        const storedMsg = await res.json();
        messageInput.value = ''; // Vide le champ après envoi
        
        appendMessage(storedMsg);
        
        const roomId = [currentUserId, selectedUserId].sort().join('-');
        if (socket) {
            // Emulate backend broadcast for prototype purpose if needed
        }
        
    } catch(err) {
        console.error("Erreur d'envoi", err);
    }
});

// Temps Réel (Socket.io)
if (socket) {
    socket.on('receive-message', (data) => {
        // Si la discussion est ouverte
        if (selectedUserId === data.userId || currentUserId === data.userId) {
            appendMessage({
                senderId: data.userId,
                text: data.text,
                timestamp: data.timestamp
            });
            
            if (selectedUserId === data.userId) {
                fetch(`/api/messages/mark-read/${data.userId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ currentUserId: currentUserId })
                }).catch(err => console.log('background mark-read fail', err));
            }
        } 
        // Si nouveau message arrive alors que la discussion n'est pas ouverte
        else {
            const contactDiv = document.querySelector(`.conversation-item[data-id="${data.userId}"]`);
            if (contactDiv) {
                // Incrémente dynamiquement le state
                unreadMap[data.userId] = (unreadMap[data.userId] || 0) + 1;
                
                // Mettre à jour l'UI dynamiquement
                const nameEl = contactDiv.querySelector('.conversation-name');
                if (nameEl) {
                    nameEl.style.color = 'var(--c-white)';
                    nameEl.style.fontWeight = '500';
                }
                
                const msgEl = contactDiv.querySelector('.conversation-last-msg');
                if (msgEl) msgEl.style.color = 'rgba(244,242,238,0.8)';

                const roleEl = contactDiv.querySelector('span[style*="font-size: 0.75rem"]');
                if (roleEl) {
                    roleEl.style.color = '#c48660';
                    roleEl.style.fontWeight = '600';
                }

                const badgeContainer = contactDiv.querySelector('.badge-container');
                if (badgeContainer) {
                    let badgeEl = badgeContainer.querySelector('.unread-badge');
                    if (!badgeEl) {
                        badgeEl = document.createElement('span');
                        badgeEl.className = 'unread-badge';
                        // Style exact demandé
                        badgeEl.style.cssText = 'width: 20px; height: 20px; background: #c48660; border-radius: 50%; color: white; font-size: 12px; display: flex; align-items: center; justify-content: center;';
                        badgeContainer.appendChild(badgeEl);
                    }
                    badgeEl.textContent = unreadMap[data.userId];
                }
            }
        }
    });
}

// Mobile Back
document.getElementById('back-to-list').addEventListener('click', () => {
    document.querySelector('.chat-container').classList.remove('show-chat');
    document.querySelector('.chat-container').classList.add('show-list');
});
