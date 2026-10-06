"use strict";
const container = document.querySelector(".product_list_container");
const params = new URLSearchParams(location.search);
let selection = params.get("category") === "fragrances" ? "fragrances" : params.get("subcategory") === "natural" ? "natural" : "beauty";
let products = [];
let ascending = false;
const buttons = document.querySelectorAll("[data-category]");
function render() {
  document.querySelector("#category-title").textContent = selection === "natural" ? "Beauty / Natural" : selection === "fragrances" ? "Fragrances" : "Beauty";
  buttons.forEach(b => {
    b.classList.toggle("active", b.dataset.category === selection);
    b.setAttribute("aria-pressed", String(b.dataset.category === selection));
  });
  const selected = [...products, ...getNaturalProducts()].filter(p => selection === "natural" ? p.category === "beauty" && p.subcategory === "natural" : p.category === selection);
  if (ascending) selected.sort((a, b) => salePrice(a) - salePrice(b));
  container.replaceChildren();
  if (!selected.length) container.textContent = "Ingen produkter fundet.";
  for (const p of selected) {
    const card = element("article", undefined, `product${p.stock === 0 ? " soldout" : ""}${p.discountPercentage ? " discount" : ""}`);
    const img = element("img");
    img.src = p.thumbnail;
    img.alt = p.title;
    card.append(img, element("h3", p.title), element("p", `${p.brand || ""} – ${p.category}`));
    const prices = element("div", undefined, "product-price");
    prices.append(element("p", money(salePrice(p))));
    if (p.discountPercentage) prices.append(element("p", money(p.price), "old-price"));
    const link = element("a", "Se produkt", "btn");
    link.href = `product.html?id=${encodeURIComponent(p.id)}&category=${encodeURIComponent(p.category)}${selection === "natural" ? "&subcategory=natural" : ""}`;
    card.append(prices, link);
    if (p.discountPercentage) card.append(element("p", `-${p.discountPercentage}%`, "discount_tag"));
    if (p.stock === 0) card.append(element("p", "Udsolgt", "soldout_tag"));
    container.append(card);
  }
}
buttons.forEach(button => button.addEventListener("click", () => {
  selection = button.dataset.category;
  const url = new URL(location.href);
  url.searchParams.set("category", selection === "fragrances" ? "fragrances" : "beauty");
  url.searchParams.delete("brand");
  url.searchParams.delete("subcategory");
  if (selection === "natural") url.searchParams.set("subcategory", "natural");
  history.replaceState({}, "", url);
  render();
}));
document.querySelector(".sort_button").addEventListener("click", () => { ascending = true; render(); });
async function load() {
  buttons.forEach(b => { b.disabled = true; });
  container.textContent = "Henter produkter …";
  try {
    const categories = await Promise.all([getCategory("beauty"), getCategory("fragrances")]);
    products = categories.flat();
    render();
  }
  catch (error) { container.textContent = "Produkterne kunne ikke indlæses. Prøv at genindlæse siden."; console.error(error); }
  finally { buttons.forEach(b => { b.disabled = false; }); }
}
load();

const addButton = document.querySelector("#add-natural");
addButton.addEventListener("click", async () => {
  const status = document.querySelector("#natural-status");
  addButton.disabled = true;
  status.textContent = "Sender fem POST-forespørgsler …";
  try {
    await addNaturalProducts();
    status.textContent = "Fem Natural-demo-produkter er gemt i denne browser. DummyJSON har ikke gemt dem på serveren.";
    document.querySelector('[data-category="natural"]').click();
    render();
  } catch (error) {
    status.textContent = "Produkterne kunne ikke tilføjes. Kontrollér internet og browserens mulighed for lokal lagring, og prøv igen.";
    console.error(error);
  } finally { addButton.disabled = false; }
});
