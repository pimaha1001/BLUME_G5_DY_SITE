"use strict";

// Felter på basket.html, der bliver udfyldt med kurvens aktuelle indhold.
const basketItems = document.querySelector("#basket-items");
const basketStatus = document.querySelector("#basket-status");
const basketSubtotal = document.querySelector("#basket-subtotal");
const basketCount = document.querySelector("#basket-count");

// Tegner kurvens varer, antal, priser og subtotal fra browserens gemte data.
function renderBasket() {
  const basket = getBasket();
  basketItems.replaceChildren();

  // Viser en tom besked og nulstiller summeringen, hvis kurven er tom.
  if (!basket.length) {
    basketItems.append(element("p", "Din kurv er tom.", "basket-empty"));
    basketCount.textContent = "0 varer";
    basketSubtotal.textContent = money(0);
    document.querySelector("#clear-basket").disabled = true;
    return;
  }

  let total = 0;
  let itemCount = 0;

  // Opretter en varelinje med billede, navn, antal og linjens totalpris.
  for (const item of basket) {
    const price = salePrice(item);
    total += price * item.quantity;
    itemCount += item.quantity;

    const row = element("article", undefined, "basket-item");
    const image = element("img");
    image.src = item.thumbnail;
    image.alt = item.title;

    const details = element("div", undefined, "basket-item-details");
    const title = element("h2", item.title);
    const priceText = element("p", money(price));
    details.append(title, priceText);

    const quantity = element("div", undefined, "basket-quantity");
    quantity.setAttribute("aria-label", `Antal ${item.title}`);
    const decrease = element("button", "−", "basket-quantity-button");
    decrease.type = "button";
    decrease.setAttribute("aria-label", `Fjern én ${item.title}`);
    decrease.addEventListener("click", () => changeQuantity(item.id, -1));
    const value = element("span", String(item.quantity));
    const increase = element("button", "+", "basket-quantity-button");
    increase.type = "button";
    increase.setAttribute("aria-label", `Tilføj én ${item.title}`);
    increase.addEventListener("click", () => changeQuantity(item.id, 1));
    quantity.append(decrease, value, increase);

    const remove = element("button", "Fjern", "basket-remove");
    remove.type = "button";
    remove.addEventListener("click", () => removeItem(item.id));

    const lineTotal = element("strong", money(price * item.quantity), "basket-line-total");
    row.append(image, details, quantity, lineTotal, remove);
    basketItems.append(row);
  }

  basketCount.textContent = `${itemCount} ${itemCount === 1 ? "vare" : "varer"}`;
  basketSubtotal.textContent = money(total);
  document.querySelector("#clear-basket").disabled = false;
}

// Ændrer antal; hvis det når nul, fjernes varen fra kurven.
function changeQuantity(id, change) {
  const basket = getBasket();
  const item = basket.find((entry) => String(entry.id) === String(id));
  if (!item) return;

  item.quantity += change;
  saveBasket(basket.filter((entry) => entry.quantity > 0));
  basketStatus.textContent = "Antallet er opdateret.";
  renderBasket();
}

// Fjerner den valgte vare helt, uanset hvor mange der ligger i kurven.
function removeItem(id) {
  const basket = getBasket().filter((item) => String(item.id) !== String(id));
  saveBasket(basket);
  basketStatus.textContent = "Varen er fjernet fra kurven.";
  renderBasket();
}

// Tømmer alle varer og viser en statusbesked.
document.querySelector("#clear-basket").addEventListener("click", () => {
  saveBasket([]);
  basketStatus.textContent = "Kurven er tømt.";
  renderBasket();
});

// Opdaterer visningen ved ændringer her eller fra en anden browserfane.
window.addEventListener("basketchange", renderBasket);
window.addEventListener("storage", renderBasket);

// Viser kurven med det samme, når basket-siden åbner.
renderBasket();
