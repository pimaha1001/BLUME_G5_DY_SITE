const loginOpen = document.querySelector("#login-open");
const loginOverlay = document.querySelector("#login-overlay");
const loginClose = document.querySelector("#login-close");
const loginForm = document.querySelector("#login-form");
const loginMail = document.querySelector("#login-mail");

function openLogin(event) {
  event.preventDefault();
  loginOverlay.hidden = false;
  loginMail.focus();
}

function closeLogin() {
  loginOverlay.hidden = true;
  loginOpen.focus();
}

loginOpen.addEventListener("click", openLogin);
loginClose.addEventListener("click", closeLogin);

// Luk når man klikker uden for popup-vinduet
loginOverlay.addEventListener("click", (event) => {
  if (event.target === loginOverlay) {
    closeLogin();
  }
});

// Luk med Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !loginOverlay.hidden) {
    closeLogin();
  }
});

// Demo: formularen sender ikke noget endnu
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
});
