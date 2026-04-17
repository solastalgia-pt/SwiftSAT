/**
 * Denver Alert
 * Sends a notification email whenever a visitor from Denver (or anywhere
 * in Colorado) loads the page. Uses Formspree — no API keys, no OAuth.
 */

(async function denverAlert() {
  // Only fire once per browser session
  if (sessionStorage.getItem('denver-alerted')) return;

  try {
    const geo = await fetch('https://ipapi.co/json/').then(r => r.json());

    const isDenver = geo.city === 'Denver' || geo.region_code === 'CO';
    if (!isDenver) return;

    sessionStorage.setItem('denver-alerted', '1');

    await fetch('https://formspree.io/f/meevgebl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject:  'SwiftSAT — Denver visitor!',
        ip:       geo.ip,
        city:     geo.city + ', ' + geo.region,
        page:     window.location.href,
        time:     new Date().toLocaleString('en-US', {
                    timeZone:  'America/Denver',
                    dateStyle: 'full',
                    timeStyle: 'short',
                  }),
      }),
    });
  } catch (_) {
    // Silent fail — never interrupts the game
  }
})();
