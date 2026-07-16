fetch('verify-status.php', { credentials: 'same-origin' })
  .then((response) => {
    if (!response.ok) {
      window.location.replace('verify.html');
      return;
    }
    document.body.style.visibility = 'visible';
  })
  .catch(() => {
    window.location.replace('verify.html');
  });

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('subscribeForm');
  const stepDetails = document.getElementById('step-details');
  const stepConfirm = document.getElementById('step-confirm');
  const continueBtn = document.getElementById('continueBtn');
  const backBtn = document.getElementById('backBtn');
  const confirmSubmit = document.getElementById('confirmSubmit');
  const emailInput = document.getElementById('email');
  const nameInput = document.getElementById('name');
  const confirmEmail = document.getElementById('confirm-email');
  const confirmName = document.getElementById('confirm-name');  
  const confirmError = document.getElementById('confirm-error');
  const submitError = document.getElementById('submit-error');

  const INBOX_URL_BY_DOMAIN = {
    'gmail.com': 'https://mail.google.com/mail/',
    'googlemail.com': 'https://mail.google.com/mail/',
    'outlook.com': 'https://outlook.live.com/mail/',
    'hotmail.com': 'https://outlook.live.com/mail/',
    'live.com': 'https://outlook.live.com/mail/',
    'msn.com': 'https://outlook.live.com/mail/',
    'yahoo.com': 'https://mail.yahoo.com/',
    'ymail.com': 'https://mail.yahoo.com/',
    'rocketmail.com': 'https://mail.yahoo.com/',
    'icloud.com': 'https://www.icloud.com/mail',
    'me.com': 'https://www.icloud.com/mail',
    'mac.com': 'https://www.icloud.com/mail',
    'aol.com': 'https://mail.aol.com/',
    'zoho.com': 'https://mail.zoho.com/',
    'protonmail.com': 'https://mail.proton.me/',
    'proton.me': 'https://mail.proton.me/',
    'yandex.com': 'https://mail.yandex.com/',
    'yandex.ru': 'https://mail.yandex.com/'
  };

  function inboxUrlForEmail(email) {
    const domain = email.split('@')[1]?.trim().toLowerCase();
    if (!domain) {
      return null;
    }
    return INBOX_URL_BY_DOMAIN[domain] || `https://${domain}`;
  }

  continueBtn.addEventListener('click', () => {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    stepDetails.hidden = true;
    stepConfirm.hidden = false;
    confirmEmail.value = '';
    confirmName.value = '';    
    confirmError.hidden = true;
    submitError.hidden = true;
    confirmName.focus();
  });

  backBtn.addEventListener('click', () => {
    stepConfirm.hidden = true;
    stepDetails.hidden = false;
    nameInput.focus();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (stepConfirm.hidden) {
      return;
    }

    const emailMatches = confirmEmail.value.trim().toLowerCase() === emailInput.value.trim().toLowerCase();

    const nameMatches = confirmName.value.trim() === nameInput.value.trim();
    
    if ( !emailMatches || !nameMatches) {
      confirmError.hidden = false;
      return;
    }

    confirmError.hidden = true;
    submitError.hidden = true;
    confirmSubmit.disabled = true;
    confirmSubmit.textContent = 'Sending...';

    fetch(form.action, {
      method: 'POST',
      credentials: 'same-origin',
      body: new FormData(form)
    })
      .then((response) => {
        if (response.status === 403) {
          window.location.href = 'verify.html';
          return;
        }

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const inboxUrl = inboxUrlForEmail(emailInput.value.trim());
        if (inboxUrl) {
          window.location.href = inboxUrl;
        }
      })
      .catch(() => {
        submitError.hidden = false;
        confirmSubmit.disabled = false;
        confirmSubmit.textContent = 'Verify & Continue';
      });
  });
});
