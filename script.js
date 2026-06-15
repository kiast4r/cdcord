// Wait for the browser elements to completely load up safely
document.addEventListener("DOMContentLoaded", function () {

    // 🚪 AUTH SCREEN INTERFACE LISTENERS
    document.getElementById('switchToLogin').addEventListener('click', function() {
        document.getElementById('signupBox').style.display = 'none';
        document.getElementById('loginBox').style.display = 'block';
    });

    document.getElementById('switchToSignup').addEventListener('click', function() {
        document.getElementById('loginBox').style.display = 'none';
        document.getElementById('signupBox').style.display = 'block';
    });

    // Handle LocalStorage Sign-Up
    document.getElementById('regSubmitBtn').addEventListener('click', function() {
        const user = document.getElementById('regUser').value.trim();
        const pass = document.getElementById('regPass').value.trim();
        if(!user || !pass) return alert('Fill in all text fields! ✿');

        if(localStorage.getItem('user_' + user)) {
            return alert('That username is already taken! 💀');
        }

        localStorage.setItem('user_' + user, pass);
        alert('Account created! Logging you in now! 🎉');
        
        // Log in automatically after clicking register
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('activeProfileName').innerText = user;
    });

    // Handle LocalStorage Login
    document.getElementById('loginSubmitBtn').addEventListener('click', function() {
        const user = document.getElementById('loginUser').value.trim();
        const pass = document.getElementById('loginPass').value.trim();
        
        const storedPass = localStorage.getItem('user_' + user);
        if(storedPass && storedPass === pass) {
            document.getElementById('authScreen').style.display = 'none';
            document.getElementById('activeProfileName').innerText = user;
        } else {
            alert('Invalid credentials! Try again or register! ❌');
        }
    });

    // 💬 MESSAGING FEED MODULE
    function sendNewMessage() {
        const textInput = document.getElementById('msgInput');
        const chatFeed = document.getElementById('chatStream');
        const user = document.getElementById('activeProfileName').innerText;
        if (textInput.value.trim() === '') return;

        const timeStamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const cardNode = document.createElement('div');
        cardNode.className = 'msg-card';
        
        cardNode.innerHTML = `
            <div class="msg-avatar" style="background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%); border:2px solid white;"></div>
            <div class="msg-details">
                <div class="msg-author">${user} <span class="msg-time">${timeStamp}</span></div>
                <div class="msg-body">${escapeHTML(textInput.value)}</div>
            </div>
        `;
        chatFeed.appendChild(cardNode);
        textInput.value = '';
        chatFeed.scrollTop = chatFeed.scrollHeight;
    }

    document.getElementById('sendMsgBtn').addEventListener('click', sendNewMessage);
    document.getElementById('msgInput').addEventListener('keydown', function(event) {
        if(event.key === 'Enter') sendNewMessage();
    });

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[tag] || tag));
    }

    // 🚀 SAME-TAB PROXY SYSTEM PORTAL
    document.getElementById('proxyTestBtn').addEventListener('click', function() {
        const chosenProxy = document.getElementById('custom-node-url').value.trim();
        if (!chosenProxy) return alert('Please type a mirror node address first! ✿');
        window.location.href = chosenProxy + (chosenProxy.includes('?') ? '' : '?url=') + encodeURIComponent('https://discord.com');
    });

    // 🖥️ CHANNEL LISTS HOOKS
    const channels = document.querySelectorAll('.channel-item');
    channels.forEach(item => {
        item.addEventListener('click', function() {
            channels.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('currentChannelHeader').innerText = this.innerText;
        });
    });
});
