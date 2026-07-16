const form = document.querySelector("#login-form");
const message = document.querySelector("#demo-message");
const email = document.querySelector("#email");
const nameInput = document.querySelector("#name");
const emailLabel = document.querySelector("#email-label");
const nameLabel = document.querySelector("#name-label");
const submitButton = document.querySelector("#submit-button");
let isVerifying = false;
let savedEmail = "";
let savedName = "";

const providerUrls = {
  "gmail.com": "https://gmail.com",
  "googlemail.com": "https://gmail.com",
  "yahoo.com": "https://mail.yahoo.com",
  "ymail.com": "https://mail.yahoo.com",
  "outlook.com": "https://outlook.live.com/mail",
  "hotmail.com": "https://outlook.live.com/mail",
  "live.com": "https://outlook.live.com/mail",
  "msn.com": "https://outlook.live.com/mail",
  "icloud.com": "https://www.icloud.com/mail",
  "me.com": "https://www.icloud.com/mail",
  "mac.com": "https://www.icloud.com/mail",
  "zoho.com": "https://mail.zoho.com",
  "proton.me": "https://mail.proton.me",
  "protonmail.com": "https://mail.proton.me",
  "aol.com": "https://mail.aol.com"
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const emailValue = email.value.trim().toLowerCase();
  const nameValue = nameInput.value.trim().toLowerCase();
  const domain = emailValue.split("@").pop();

  if (!domain || domain === emailValue) {
    message.textContent = "Enter a valid email address so we can find the correct provider.";
    message.classList.add("is-visible");
    email.focus();
    return;
  }

  if (!nameInput.value.trim()) {
    message.textContent = "Enter your name to continue.";
    message.classList.add("is-visible");
    nameInput.focus();
    return;
  }

  if (!isVerifying) {
    isVerifying = true;
    savedEmail = emailValue;
    savedName = nameValue;
    email.value = "";
    nameInput.value = "";
    emailLabel.textContent = "Verify Email Address";
    nameLabel.textContent = "Verify Name";
    email.placeholder = "Re-enter your email";
    nameInput.placeholder = "Re-enter your name";
    email.autocomplete = "off";
    nameInput.autocomplete = "off";
    submitButton.textContent = "Verify & Continue";
    message.textContent = "Please verify your email address and name to continue.";
    message.classList.add("is-visible");
    email.focus();
    return;
  }

  if (emailValue !== savedEmail) {
    message.textContent = "The email addresses do not match. Please verify your email and enter it again.";
    message.classList.add("is-visible");
    email.value = "";
    email.focus();
    return;
  }

  if (nameValue !== savedName) {
    message.textContent = "The names do not match. Please verify your name and enter it again.";
    message.classList.add("is-visible");
    nameInput.value = "";
    nameInput.focus();
    return;
  }

  const savedDomain = savedEmail.split("@").pop();
  const redirectUrl = providerUrls[savedDomain] || `https://${savedDomain}`;
  message.textContent = `Redirecting to ${savedDomain}...`;
  message.classList.add("is-visible");

  window.location.href = redirectUrl;
});
