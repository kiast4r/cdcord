// 🔄 cdcord Automatic Session Preservation Layer
(function () {
    // This runs immediately before the rest of the page paints to stop screen flickering
    const savedUser = localStorage.getItem('currentSessionUser');
    
    if (savedUser) {
        // Create a style block to hide the login wrapper right away
        const style = document.createElement('style');
        style.innerHTML = `
            #authScreen { display: none !important; }
        `;
        document.head.appendChild(style);

        // Wait for the HTML structure to be ready to swap the username labels
        document.addEventListener("DOMContentLoaded", function () {
            const activeProfileName = document.getElementById('activeProfileName');
            if (activeProfileName) {
                activeProfileName.innerText = savedUser;
            }
            
            // If the user lands on the profile editing tab, sync that name too
            const previewUsername = document.getElementById('previewUsername');
            if (previewUsername) {
                previewUsername.innerText = savedUser;
            }
        });
    }
})();
