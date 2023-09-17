const butInstall = document.getElementById('buttonInstall');

let deferredPrompt; // Will hold the deferred prompt event

// Logic for installing the PWA
window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the default behavior of the prompt
  event.preventDefault();
  // Store the event so it can be used later
  deferredPrompt = event;
  // Show the "Install" button to the user
  butInstall.style.display = 'block';
});

// Click event handler for the "Install" button
butInstall.addEventListener('click', async () => {
  if (deferredPrompt) {
    // Show the installation prompt to the user
    deferredPrompt.prompt();
    // Wait for the user's response
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the PWA installation');
    } else {
      console.log('User declined the PWA installation');
    }

    // Clear the deferred prompt reference
    deferredPrompt = null;
    // Hide the "Install" button
    butInstall.style.display = 'none';
  }
});

// Handler for the "appinstalled" event
window.addEventListener('appinstalled', (event) => {
  console.log('PWA was installed');
});
