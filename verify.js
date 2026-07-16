document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('verifyForm');
  const captchaImage = document.getElementById('captcha-image');
  const captchaRefresh = document.getElementById('captcha-refresh');
  const captchaInput = document.getElementById('captcha-input');
  const verifyError = document.getElementById('verify-error');
  const verifySubmit = document.getElementById('verifySubmit');

  function refreshCaptcha() {
    captchaImage.src = `captcha.php?t=${Date.now()}`;
    captchaInput.value = '';
  }

  captchaRefresh.addEventListener('click', refreshCaptcha);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (captchaInput.value.trim() === '') {
      verifyError.hidden = false;
      return;
    }

    verifyError.hidden = true;
    verifySubmit.disabled = true;
    verifySubmit.textContent = 'Verifying...';

    fetch('verify.php', {
      method: 'POST',
      credentials: 'same-origin',
      body: new FormData(form)
    })
      .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
      .then(({ ok, data }) => {
        if (ok && data.ok) {
          window.location.href = 'index.html';
          return;
        }

        verifyError.hidden = false;
        refreshCaptcha();
        verifySubmit.disabled = false;
        verifySubmit.textContent = 'Verify Code';
      })
      .catch(() => {
        verifyError.hidden = false;
        refreshCaptcha();
        verifySubmit.disabled = false;
        verifySubmit.textContent = 'Verify Code';
      });
  });
});
