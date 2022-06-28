// Listen event 'beforeinstallprompt' when PWA ready
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // Prevent the mini-infobar from appearing on mobile
  deferredPrompt = e; // Stash the event so it can be triggered later.
});

// Customize install buttons
buttonInstall = document.getElementById('install-pwa-app')
buttonInstall.addEventListener('click', (e) => {
  // Cannot init PWA
  if (deferredPrompt == null)
    return;

  deferredPrompt.prompt(); // Show the install prompt
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
  });
});
