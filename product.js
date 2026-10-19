"use strict";

// Læser produktets id og kategori fra URL'en, fx product.html?id=1.
const params = new URLSearchParams(location.search);
const id = params.get("id");
const status = document.querySelector("#product-status");
const details = document.querySelector(".product-detail");
const back = document.querySelector(".back-link");
const image = document.querySelector(".detail-image");
const quantityValue = document.querySelector(".quantity-value");
const minusButton = document.querySelector(".quantity-minus");
const plusButton = document.querySelector(".quantity-plus");
const cartButton = document.querySelector("#add-product-to-basket");
const cartMessage = document.querySelector("#product-action-status");
const favoriteButton = document.querySelector("#product-favorite");
const FAVORITES_KEY = "blume-favorites-v1";

let currentProduct = null;
let quantity = 1;

// Opdaterer tekstindholdet i et element på produktsiden.
function set(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.textContent = text ?? "";
}

// Henter favorit-id'er, så produktsiden bruger samme favoritter som forsiden.
function getFavoriteIds() {
  try {
    const savedFavorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(savedFavorites) ? savedFavorites.map(String) : [];
  } catch {
    return [];
  }
}

// Opdaterer antalvisningen og slår knapper fra ved minimum og lagergrænse.
function updateQuantity() {
  quantityValue.textContent = quantity;
  minusButton.disabled = quantity <= 1;
  plusButton.disabled = currentProduct.stock != null && quantity >= currentProduct.stock;
}

// Viser om det aktuelle produkt allerede er gemt som favorit.
function updateFavoriteButton() {
  const isFavorite = getFavoriteIds().includes(String(currentProduct.id));
  favoriteButton.setAttribute("aria-pressed", String(isFavorite));
  favoriteButton.setAttribute("aria-label", isFavorite ? "Fjern fra favoritter" : "Tilføj til favoritter");
  favoriteButton.textContent = isFavorite ? "♥" : "♡";
}

// Henter produktdata og udfylder alle felter på detaljesiden.
async function load() {
  details.hidden = true;
  status.textContent = "Henter produkt …";
  try {
    if (!id || !/^(\d+|natural-[1-5])$/.test(id)) throw new Error("Ugyldigt produkt-id");
    // Natural-produkter ligger lokalt; øvrige produkter hentes fra API'et.
    const p = id.startsWith("natural-") ? getNaturalProducts().find((p) => p.id === id) : await fetchJSON(`${API}/${id}`);
    if (!p) throw new Error("Natural-produktet findes ikke i denne browser");
    if (!["beauty", "fragrances"].includes(p.category)) throw new Error("Produktet tilhører ikke Beauty eller Fragrances");
    currentProduct = p;

    // Sørger for at tilbage-linket går til produktets egen kategori.
    back.href = `productlist.html?category=${p.category}${p.subcategory === "natural" ? "&subcategory=natural" : ""}`;

    // Fylder produktbillede, beskrivelse, kategori og priser ind på siden.
    image.src = p.images?.[0] || p.thumbnail || "";
    image.alt = p.title || "Produktbillede";
    set(".detail-model", p.title);
    set(".detail-color", p.description);
    set(".detail-id", p.id);
    set(".detail-brand", p.brand || "");
    set(".detail-brand-text", p.brand || "");
    set(".detail-name", p.title);
    set(".detail-brand-category", p.brand || "");
    set(".detail-category", p.subcategory === "natural" ? "Beauty / Natural" : p.category === "fragrances" ? "Fragrances" : "Beauty");
    set(".detail-sale-price", money(salePrice(p)));
    set(".detail-original-price", p.discountPercentage ? money(p.price) : "");
    set(".detail-sale-tag", p.discountPercentage ? `-${Math.round(p.discountPercentage)}%` : "");
    set(".detail-soldout-tag", p.stock === 0 ? "Udsolgt" : p.stock == null ? "" : `På lager: ${p.stock}`);

    // Nulstiller antal og knapper, når et nyt produkt bliver vist.
    quantity = 1;
    updateQuantity();
    updateFavoriteButton();
    cartButton.disabled = p.stock === 0;
    cartMessage.textContent = "";

    status.textContent = "";
    details.hidden = false;
  } catch (error) {
    status.textContent = "Produktet kunne ikke indlæses. Kontrollér linket, eller prøv igen.";
    console.error(error);
  }
}

// Gør det muligt at vælge mindst én og højst så mange, som er på lager.
minusButton.addEventListener("click", () => {
  if (quantity > 1) {
    quantity--;
    updateQuantity();
  }
});

plusButton.addEventListener("click", () => {
  if (currentProduct.stock == null || quantity < currentProduct.stock) {
    quantity++;
    updateQuantity();
  }
});

// Gemmer favoritstatus under samme nøgle, som forsiden bruger.
favoriteButton.addEventListener("click", () => {
  if (!currentProduct) return;

  const favorites = getFavoriteIds();
  const productId = String(currentProduct.id);
  const favoriteIndex = favorites.indexOf(productId);
  if (favoriteIndex === -1) favorites.push(productId);
  else favorites.splice(favoriteIndex, 1);

  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    updateFavoriteButton();
  } catch {
    cartMessage.textContent = "Favoritten kunne ikke gemmes i browseren.";
  }
});

// Bruger den fælles kurvfunktion, så produktdata og valgt antal gemmes korrekt.
cartButton.addEventListener("click", () => {
  if (!currentProduct) return;

  try {
    addToBasket(currentProduct, quantity);
    cartMessage.textContent = `${currentProduct.title} er lagt i kurven.`;
  } catch (error) {
    cartMessage.textContent = "Kurven kunne ikke opdateres.";
    console.error(error);
  }
});

// Start indlæsningen, når produktsiden åbnes.
load();
