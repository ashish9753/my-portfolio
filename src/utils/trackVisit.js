import axios from 'axios';

const ANALYTICS_API = 'https://dsa-sheet-backend-7r7i.onrender.com/api/analytics';

// The browser's own timezone stands in for location. It costs the visitor
// nothing, needs no consent banner, and never puts an IP address in the
// database — see backend/routes/analytics.router.js.
const currentTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch {
    return '';
  }
};

// Moving between our own pages isn't a referral worth reporting.
const externalReferrer = () => {
  try {
    if (!document.referrer) return '';
    return new URL(document.referrer).host === window.location.host ? '' : document.referrer;
  } catch {
    return '';
  }
};

// Records one page view. Fire-and-forget by design: a visitor should never wait
// for analytics or see it fail, so every error is swallowed on purpose.
export const trackVisit = (path) => {
  axios
    .post(`${ANALYTICS_API}/visit`, {
      path,
      timezone: currentTimezone(),
      referrer: externalReferrer()
    })
    .catch(() => {});
};
