document.addEventListener("DOMContentLoaded", function () {

    // Global variable to keep track of the user's custom avatar color
    let selectedAvatarColor = '#ff758f';

    // ==========================================
    // 🚪 1. AUTHENTICATION & SESSION TRACKING
    // ==========================================
    
    // Check if there's already an active user session saved on this Chromebook
    const loggedInUser = localStorage.getItem('currentSessionUser');
    if (loggedInUser) {
        // Automatically close the gate and load their specific profile
        const authScreen = document.getElementById('authScreen');
        if (authScreen) authScreen.style.display = 'none';
        
        const activeProfileName = document.getElementById('activeProfileName');
        if (activeProfileName) activeProfileName.innerText = loggedInUser;
        
        loadSavedCustomizations(loggedInUser);
    }

    // Toggle between Sign-Up and Login Boxes inside the overlay frame
    const switchToLogin = document.getElementById('switchToLogin');
    const switchToSignup = document.getElementById('switchToSignup');
    const signupBox = document.getElementById('signupBox');
    const loginBox = document.getElementById('loginBox');

    if (switchToLogin && signupBox && loginBox) {
        switchToLogin.addEventListener('click', function() {
            signupBox.style.display = 'none';
            loginBox.style.display = 'block';
        });
    }

    if (switchToSignup && signupBox && loginBox) {
        switchToSignup.addEventListener('click', function() {
            loginBox.style.display = 'none';
            signupBox.style.display = 'block';
        });
    }

    // Handle LocalStorage User Account Registration (Sign-Up)
    const regSubmitBtn = document.getElementById('regSubmitBtn');
    if (regSubmitBtn) {
        regSubmitBtn.addEventListener('click', function() {
            const user = document.getElementById('regUser').value.trim();
            const pass = document.getElementById('regPass').value.trim();
            
            if (!user || !pass) return alert('Fill in all text fields! ✿');

            // Block duplicate usernames
            if (localStorage.getItem('user_' + user)) {
                return alert('That username is already taken! 💀');
            }

            // Save the account data locally on the Chromebook
            localStorage.setItem('user_' + user, pass);
            // Lock in the active session so it persists on page reload
            localStorage.setItem('currentSessionUser', user);
            
            alert('Account created! Entering beach club... 🎉');
            
            const authScreen = document.getElementById('authScreen');
            if (authScreen) authScreen.style.display = 'none';
            
            const activeProfileName = document.getElementById('activeProfileName');
            if (activeProfileName) activeProfileName.innerText = user;
            
            loadSavedCustomizations(user);
        });
    }

    // Handle LocalStorage Account Authentication (Login)
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener('click', function() {
            const user = document.getElementById('loginUser').value.trim();
            const pass = document.getElementById('loginPass').value.trim();
            
            const storedPass = localStorage.getItem('user_' + user);
            if (storedPass && storedPass === pass) {
                // Lock in the active session
                localStorage.setItem('currentSessionUser', user);
                
                const authScreen = document.getElementById('authScreen');
                if (authScreen) authScreen.style.display = 'none';
                
                const activeProfileName = document.getElementById('activeProfileName');
                if (activeProfileName) activeProfileName.innerText = user;
                
                loadSavedCustomizations(user);
            } else {
                alert('Invalid credentials! Try again or register! ❌');
            }
        });
    }


    // ==========================================
    // 💬 2. REAL-TIME CHAT FEED SYSTEM
    // ==========================================
    
    function sendNewMessage() {
        const textInput = document.getElementById('msgInput');
        const chatFeed = document.getElementById('chatStream');
        const user = document.getElementById('activeProfileName') ? document.getElementById('activeProfileName').innerText : 'GuestUser';
        
        if (!textInput || !chatFeed || textInput.value.trim() === '') return;

        const timeStamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const cardNode = document.createElement('div');
        cardNode.className = 'msg-card';
        
        // Render message data node with the active custom profile color
        cardNode.innerHTML = `
            <div class="msg-avatar" style="background: ${selectedAvatarColor}; border:2px solid white; border-radius:50%; width:38px; height:38px; flex-shrink:0;"></div>
            <div class="msg-details">
                <div class="msg-author" style="font-weight:700; color:#000;">${user} <span class="msg-time" style="font-size:11px; color:#1b5a63; font-weight:500; margin-left:6px;">Today at ${timeStamp}</span></div>
                <div class="msg-body" style="font-size:14px; color:#032b30; margin-top:3px; font-weight:500;">${escapeHTML(textInput.value)}</div>
            </div>
        `;
        
        chatFeed.appendChild(cardNode);
        textInput.value = '';
        chatFeed.scrollTop = chatFeed.scrollHeight; // Automatically scrolls to the bottom
    }

    // Attach event listeners to the message submission elements
    const sendMsgBtn = document.getElementById('sendMsgBtn');
    const msgInput = document.getElementById('msgInput');

    if (sendMsgBtn) sendMsgBtn.addEventListener('click', sendNewMessage);
    if (msgInput) {
        msgInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') sendNewMessage();
        });
    }

    // Safety function to parse incoming text strings and block code injection attempts
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[tag] || tag));
    }


    // ==========================================
    // 🖥️ 3. INTERACTIVE NAVIGATION (SERVERS & CHANNELS)
    // ==========================================
    
    // Switch between individual Text Channels inside the sidebar
    const channels = document.querySelectorAll('.channel-item');
    const currentChannelHeader = document.getElementById('currentChannelHeader');

    channels.forEach(item => {
        item.addEventListener('click', function() {
            channels.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            if (currentChannelHeader) {
                currentChannelHeader.innerText = this.innerText;
            }
        });
    });

    // Switch between Server Guilds (Emoji buttons on the far left)
    const servers = document.querySelectorAll('.server-icon');
    const chatStream = document.getElementById('chatStream');
    const serverTitle = document.querySelector('.server-title-bar');

    // Brainrot message data blocks mapped to each server bubble
    const serverMessages = {
        '🌺': `
            <div class="msg-card">
                <div class="msg-avatar pink"></div>
                <div class="msg-details">
                    <div class="msg-author">KaiCenatFan <span class="msg-time">9:02 PM</span></div>
                    <div class="msg-body">Chat, is it real? cdcord has 9000 aura right now, no cap 🤫🧏‍♂️</div>
                </div>
            </div>
            <div class="msg-card">
                <div class="msg-avatar green"></div>
                <div class="msg-details">
                    <div class="msg-author">SkibidiRizzer <span class="msg-time">9:03 PM</span></div>
                    <div class="msg-body">Fr, whoever coded this custom layout has infinite Ohio rizz. Absolute W 💀🔥</div>
                </div>
            </div>`,
        '🐬': `
            <div class="msg-card">
                <div class="msg-avatar blue" style="background:#00f2fe"></div>
                <div class="msg-details">
                    <div class="msg-author">DolphinSquad <span class="msg-time">10:15 AM</span></div>
                    <div class="msg-body">Welcome to the Dolphin Server! Cleanest Frutiger Aero water vibes here 🌊🐬</div>
                </div>
            </div>`,
        '🍉': `
            <div class="msg-card">
                <div class="msg-avatar green" style="background:#70e000"></div>
                <div class="msg-details">
                    <div class="msg-author">MelonBae <span class="msg-time">1:30 PM</span></div>
                    <div class="msg-body">Tropical Summer Server is officially live! Grab a slice 🍉🌴</div>
                </div>
            </div>`
    };

    const serverNames = {
        '🌺': 'Brainrot Beach Club',
        '🐬': 'Frutiger Aqua Zone',
        '🍉': 'Melon Summer Oasis'
    };

    servers.forEach(server => {
        server.addEventListener('click', function() {
            servers.forEach(s => s.classList.remove('active'));
            this.classList.add('active');

            const emoji = this.innerText;
            if (serverTitle) serverTitle.innerText = serverNames[emoji] || 'Custom Guild';
            if (chatStream) chatStream.innerHTML = serverMessages[emoji] || `<div class="msg-body" style="padding:20px; color:#aaa;">Empty channel...</div>`;
        });
    });


    // ==========================================
