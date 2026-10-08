"use strict";
const container = document.querySelector("#category");
const FAVORITES_KEY = "blume-favorites-v1";

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return new Set(Array.isArray(saved) ? saved.map(String) : []);
  } catch {
    return new Set();
  }
}

const favorites = readFavorites();

function productHref(product) {
  return `product.html?id=${encodeURIComponent(product.id)}&category=${encodeURIComponent(product.category)}${product.subcategory === "natural" ? "&subcategory=natural" : ""}`;
}

function icon(type) {
  const img = document.createElement("img");
  img.src = `images/${type === "heart" ? "heart" : "basket"}.svg`;
  img.alt = "";
  img.setAttribute("aria-hidden", "true");
  return img;
}

function renderProducts(target, products) {
  target.replaceChildren();
  for (const product of products.slice(0, 4)) {
    const card = element("article", undefined, "frontpage-product-card");
    const link = element("a", undefined, "frontpage-product-link");
    link.href = productHref(product);
    const img = element("img");
    img.src = product.thumbnail;
    img.alt = product.title;
    img.loading = "lazy";
    link.append(img, element("h3", product.title));

    const bottom = element("div", undefined, "frontpage-product-bottom");
    const prices = element("div", undefined, "frontpage-product-prices");
    prices.append(element("p", money(salePrice(product))));
    if (product.discountPercentage) prices.append(element("p", money(product.price), "old-price"));

    const actions = element("div", undefined, "frontpage-product-actions");
    const bag = element("a", undefined, "frontpage-icon");
    bag.href = link.href;
    bag.setAttribute("aria-label", `Se produkt: ${product.title}`);
    bag.title = "Se produkt";
    bag.append(icon("bag"));

    const heart = element("button", undefined, "frontpage-icon favorite-button");
    heart.type = "button";
    heart.setAttribute("aria-label", `Favorit: ${product.title}`);
    heart.setAttribute("aria-pressed", String(favorites.has(String(product.id))));
    heart.append(icon("heart"));
    heart.addEventListener("click", () => {
      const id = String(product.id);
      const next = new Set(favorites);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]));
        favorites.clear();
        next.forEach((value) => favorites.add(value));
        heart.setAttribute("aria-pressed", String(favorites.has(id)));
      } catch {
        document.querySelector("#frontpage-action-status").textContent = "Favoritten kunne ikke gemmes. Tillad lokal lagring i browseren, og prøv igen.";
      }
    });

    actions.append(bag, heart);
    bottom.append(prices, actions);
    card.append(link, bottom);
    if (product.stock === 0) card.append(element("p", "Udsolgt", "frontpage-stock"));
    target.append(card);
  }
}

function renderNatural() {
  const target = document.querySelector("#natural-products");
  const products = getNaturalProducts();
  renderProducts(target, products);
  if (!products.length) {
    const message = element("p", "Der er endnu ingen Natural-demo-produkter i denne browser. ", "frontpage-grid-message");
    const link = element("a", "Tilføj dem på produktlisten.");
    link.href = "productlist.html?category=beauty&subcategory=natural";
    message.append(link);
    target.append(message);
  }
}

async function showCategories() {
  container.textContent = "Henter produkter …";
  renderNatural();
  const choices = [
    { title: "Beauty", category: "beauty", target: "beauty-products", href: "productlist.html?category=beauty" },
    { title: "Fragrances", category: "fragrances", target: "fragrances-products", href: "productlist.html?category=fragrances" },
  ];
  const results = await Promise.allSettled(choices.map((choice) => getCategory(choice.category)));
  container.replaceChildren();

  choices.forEach((choice, index) => {
    const result = results[index];
    const target = document.querySelector(`#${choice.target}`);
    if (result.status === "fulfilled") {
      choice.product = result.value[0];
      renderProducts(target, result.value);
      if (!result.value.length) target.textContent = "Ingen produkter fundet.";
    } else {
      target.textContent = "Produkterne kunne ikke indlæses. Prøv at genindlæse siden.";
      console.error(result.reason);
    }
  });

  choices.push({ title: "Natural", href: "productlist.html?category=beauty&subcategory=natural", product: { thumbnail: "images/natural-placeholder.svg" } });
  for (const choice of choices) {
    const link = element("a", undefined, "category-card");
    link.href = choice.href;
    if (choice.product) {
      const img = element("img");
      img.src = choice.product.thumbnail;
      img.alt = choice.title;
      link.append(img);
    }
    link.append(element("span", choice.title, "category-button"));
    container.append(link);
  }
}

const actionStatus = element("p", undefined, "frontpage-action-status");
actionStatus.id = "frontpage-action-status";
actionStatus.setAttribute("role", "status");
document.querySelector(".frontpage-products").append(actionStatus);
window.addEventListener("pageshow", renderNatural);
window.addEventListener("storage", (event) => {
  if (event.key === NATURAL_KEY || event.key === null) renderNatural();
});

showCategories();
