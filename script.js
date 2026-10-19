// Henter menuens knap og navigation, som skal åbnes og lukkes på små skærme.
const burger = document.querySelector(".burger");
const navbar = document.querySelector(".navbar");

// Skifter begge klassers tilstand, så CSS viser menuen og ændrer burgerikonet.
burger.addEventListener("click", () => {
  burger.classList.toggle("active");
  navbar.classList.toggle("active");
});
