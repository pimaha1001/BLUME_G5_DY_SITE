"use strict";
// Finder produktlisten og læser den valgte kategori fra URL'en.
const container = document.querySelector(".product_list_container");
const params = new URLSearchParams(location.search);
let selection = params.get("category") === "fragrances" ? "fragrances" : params.get("subcategory") === "natural" ? "natural" : "beauty";
let products = [];
let ascending = false;
const buttons = document.querySelectorAll("[data-category]");

// Opdaterer kategorioverskrift, filterknapper og de viste produktkort.
function render() {
  document.querySelector("#category-title").textContent = selection === "natural" ? "Beauty / Natural" : selection === "fragrances" ? "Fragrances" : "Beauty";
  buttons.forEach((b) => {
    b.classList.toggle("active", b.dataset.category === selection);
    b.setAttribute("aria-pressed", String(b.dataset.category === selection));
  });
  // Kombiner API- og Natural-produkter, og vælg kun dem fra det aktive filter.
  const selected = [...products, ...getNaturalProducts()].filter((p) => (selection === "natural" ? p.category === "beauty" && p.subcategory === "natural" : p.category === selection));
  if (ascending) selected.sort((a, b) => salePrice(a) - salePrice(b));
  container.replaceChildren();
  if (!selected.length) container.textContent = "Ingen produkter fundet.";
  // Bygger et kort med pris, produktlink og kurveknap for hver vare.
  for (const p of selected) {
    const card = element("article", undefined, `product${p.stock === 0 ? " soldout" : ""}${p.discountPercentage ? " discount" : ""}`);
    const img = element("img");
    img.src = p.thumbnail;
    img.alt = p.title;
    card.append(img, element("h3", p.title), element("p", `${p.brand || ""} – ${p.category}`));
    const prices = element("div", undefined, "product-price");
    prices.append(element("p", money(salePrice(p))));
    if (p.discountPercentage) prices.append(element("p", money(p.price), "old-price"));
    const actions = element("div", undefined, "product-actions");
    const link = element("a", "Se produkt", "btn");
    link.href = `product.html?id=${encodeURIComponent(p.id)}&category=${encodeURIComponent(p.category)}${selection === "natural" ? "&subcategory=natural" : ""}`;
    const addButton = element("button", "Læg i kurv", "btn add-to-basket");
    addButton.type = "button";
    addButton.addEventListener("click", () => {
      addToBasket(p);
      document.querySelector("#basket-action-status").textContent = `${p.title} er lagt i kurven.`;
    });
    actions.append(link, addButton);
    card.append(prices, actions);
    if (p.discountPercentage) card.append(element("p", `-${p.discountPercentage}%`, "discount_tag"));
    if (p.stock === 0) card.append(element("p", "Udsolgt", "soldout_tag"));
    container.append(card);
  }
}

// Opdaterer valgt kategori og URL, når en filterknap trykkes.
buttons.forEach((button) =>
  button.addEventListener("click", () => {
    selection = button.dataset.category;
    const url = new URL(location.href);
    url.searchParams.set("category", selection === "fragrances" ? "fragrances" : "beauty");
    url.searchParams.delete("brand");
    url.searchParams.delete("subcategory");
    if (selection === "natural") url.searchParams.set("subcategory", "natural");
    history.replaceState({}, "", url);
    render();
  }),
);

// Sorterer den viste kategori efter laveste pris.
document.querySelector(".sort_button").addEventListener("click", () => {
  ascending = true;
  render();
});

// Henter Beauty og Fragrances fra API'et; Natural-data ligger lokalt.
async function load() {
  buttons.forEach((b) => {
    b.disabled = true;
  });
  container.textContent = "Henter produkter …";
  try {
    const categories = await Promise.all([getCategory("beauty"), getCategory("fragrances")]);
    products = categories.flat();
    render();
  } catch (error) {
    container.textContent = "Produkterne kunne ikke indlæses. Prøv at genindlæse siden.";
    console.error(error);
  } finally {
    buttons.forEach((b) => {
      b.disabled = false;
    });
  }
}

// Starter hentningen, når produktlisten åbnes.
load();
