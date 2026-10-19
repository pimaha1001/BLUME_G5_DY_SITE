"use strict";
// Forsidens kode: produktsektioner, kategorikort og favoritter.
const container = document.querySelector("#category");
const FAVORITES_KEY = "blume-favorites-v1";

// Læser favoritter fra browseren; ugyldige gemte data giver en tom samling.
function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return new Set(Array.isArray(saved) ? saved.map(String) : []);
  } catch {
    return new Set();
  }
}

const favorites = readFavorites();

// Bygger URL'en til et produkt, inklusive Natural-underkategorien.
function productHref(product) {
  return `product.html?id=${encodeURIComponent(product.id)}&category=${encodeURIComponent(product.category)}${product.subcategory === "natural" ? "&subcategory=natural" : ""}`;
}

// Opretter billedet, der bruges i en produktkort-knap.
function icon(type) {
  const img = document.createElement("img");
  img.src = `images/${type === "heart" ? "heart" : "basket"}.svg`;
  img.alt = "";
  img.setAttribute("aria-hidden", "true");
  return img;
}

// Tegner produktkort i en forside-sektion; som standard vises højst fire.
function renderProducts(target, products, limit = 4) {
  target.replaceChildren();
  for (const product of products.slice(0, limit)) {
    const card = element("article", undefined, `frontpage-product-card${product.discountPercentage ? " frontpage-sale-card" : ""}`);
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
    const bag = element("button", undefined, "frontpage-icon basket-button");
    bag.type = "button";
    bag.setAttribute("aria-label", `Læg i kurv: ${product.title}`);
    bag.title = "Læg i kurv";
    bag.append(icon("bag"));
    // Gemmer varen i kurven og viser en kort bekræftelse på siden.
    bag.addEventListener("click", () => {
      addToBasket(product);
      document.querySelector("#frontpage-action-status").textContent = `${product.title} er lagt i kurven.`;
    });

    const heart = element("button", undefined, "frontpage-icon favorite-button");
    heart.type = "button";
    heart.setAttribute("aria-label", `Favorit: ${product.title}`);
    heart.setAttribute("aria-pressed", String(favorites.has(String(product.id))));
    heart.append(icon("heart"));
    // Skifter favoritstatus og gemmer den opdaterede liste i browseren.
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
    if (product.discountPercentage) card.append(element("p", `-${product.discountPercentage}%`, "frontpage-sale-tag"));
    if (product.stock === 0) card.append(element("p", "Udsolgt", "frontpage-stock"));
    target.append(card);
  }
}

// Viser de lokale Natural-produkter på forsiden.
function renderNatural() {
  const target = document.querySelector("#natural-products");
  const products = getNaturalProducts();
  renderProducts(target, products);
  if (!products.length) {
    target.append(element("p", "Ingen Natural-produkter fundet.", "frontpage-grid-message"));
  }
}

// Henter API-produkter, viser tilbud og bygger kategorikortene nederst på siden.
async function showCategories() {
  container.textContent = "Henter produkter …";
  renderNatural();
  const choices = [
    { title: "Beauty", category: "beauty", target: "beauty-products", href: "productlist.html?category=beauty" },
    { title: "Fragrances", category: "fragrances", target: "fragrances-products", href: "productlist.html?category=fragrances" },
  ];
  const results = await Promise.allSettled(choices.map((choice) => getCategory(choice.category)));
  container.replaceChildren();

  // Tegner hver kategori, eller viser en fejlbesked for kategorier, der fejler.
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

  const saleTarget = document.querySelector("#sale-products-grid");
  // Samler tilbud fra de kategorier, der blev hentet korrekt.
  const saleProducts = results.flatMap((result) => (result.status === "fulfilled" ? result.value : [])).filter((product) => product.discountPercentage > 0);
  renderProducts(saleTarget, saleProducts, Infinity);
  if (!saleProducts.length) {
    saleTarget.textContent = results.some((result) => result.status === "rejected") ? "Tilbud kunne ikke indlæses. Prøv at genindlæse siden." : "Ingen produkter på tilbud lige nu.";
  } else if (results.some((result) => result.status === "rejected")) {
    saleTarget.append(element("p", "Nogle tilbud kunne ikke indlæses.", "frontpage-grid-message"));
  }

  // Opretter et kortlink for hver kategori på forsiden.
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

// Fælles statusfelt til beskeder om favorit og kurv-handlinger.
const actionStatus = element("p", undefined, "frontpage-action-status");
actionStatus.id = "frontpage-action-status";
actionStatus.setAttribute("role", "status");
document.querySelector(".frontpage-products").append(actionStatus);
// Opdaterer Natural-sektionen, når siden vises igen.
window.addEventListener("pageshow", renderNatural);

// Starter indlæsningen af forsiden.
showCategories();
