/**
 * Denver Alert
 * Sends an email to the site owner whenever a visitor from Denver (or
 * anywhere in Colorado) loads the page.
 *
 * Requires EmailJS — see setup instructions in README or below:
 *   1. Sign up free at https://www.emailjs.com/
 *   2. Add a Gmail service → copy the Service ID
 *   3. Create an email template → copy the Template ID
 *   4. Go to Account → copy your Public Key
 *   5. Replace the three REPLACE_ME values below
 */

(async function denverAlert() {
  const EMAILJS_PUBLIC_KEY  = 'REPLACE_ME_PUBLIC_KEY';   // e.g. 'user_abc123XYZ'
  const EMAILJS_SERVICE_ID  = 'REPLACE_ME_SERVICE_ID';   // e.g. 'service_abc123'
  const EMAILJS_TEMPLATE_ID = 'REPLACE_ME_TEMPLATE_ID';  // e.g. 'template_abc123'

  // Only fire once per browser session (avoids repeat alerts on SPA nav)
  if (sessionStorage.getItem('denver-alerted')) return;

  // Skip if credentials haven't been filled in yet
  if (EMAILJS_PUBLIC_KEY.startsWith('REPLACE_ME')) return;

  try {
    // 1. Get visitor location (free, up to 1 000 req/day, no API key needed)
    const geo = await fetch('https://ipapi.co/json/').then(r => r.json());

    // 2. Check for Denver specifically, or broaden to all of Colorado
    const isDenver = geo.city === 'Denver' || geo.region_code === 'CO';
    if (!isDenver) return;

    // 3. Mark as alerted so we don't spam on the same visit
    sessionStorage.setItem('denver-alerted', '1');

    // 4. Send the email via EmailJS
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        visitor_ip:     geo.ip,
        visitor_city:   geo.city,
        visitor_region: geo.region,
        page_url:       window.location.href,
        page_title:     document.title,
        visit_time:     new Date().toLocaleString('en-US', {
                          timeZone: 'America/Denver',
                          dateStyle: 'full',
                          timeStyle: 'short',
                        }),
      },
      EMAILJS_PUBLIC_KEY
    );
  } catch (_) {
    // Silent fail — never interrupt the game
  }
})();
