"use strict";
const params = new URLSearchParams(location.search);
const id = params.get("id");
const status = document.querySelector("#product-status");
const details = document.querySelector(".product-detail");
const back = document.querySelector(".back-link");
const category = params.get("category") === "fragrances" ? "fragrances" : "beauty";
back.href = `productlist.html?category=${category}${params.get("subcategory") === "natural" || id?.startsWith("natural-") ? "&subcategory=natural" : ""}`;
function set(selector, text) { document.querySelector(selector).textContent = text; }
async function load() {
  details.hidden = true;
  status.textContent = "Henter produkt …";
  try {
    if (!id || !/^(\d+|natural-[1-5])$/.test(id)) throw new Error("Ugyldigt produkt-id");
    const p = id.startsWith("natural-") ? getNaturalProducts().find(p => p.id === id) : await fetchJSON(`${API}/${id}`);
    if (!p) throw new Error("Natural-produktet findes ikke i denne browser");
    if (!["beauty", "fragrances"].includes(p.category)) throw new Error("Produktet tilhører ikke Beauty eller Fragrances");
    back.href = `productlist.html?category=${p.category}${p.subcategory === "natural" ? "&subcategory=natural" : ""}`;
    const img = document.querySelector(".detail-image");
    img.src = p.images?.[0] || p.thumbnail;
    img.alt = p.title;
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
    set(".detail-sale-tag", p.discountPercentage ? `-${p.discountPercentage}%` : "");
    set(".detail-soldout-tag", p.stock === 0 ? "Udsolgt" : `På lager: ${p.stock}`);
    status.textContent = "";
    details.hidden = false;
  } catch (error) { status.textContent = "Produktet kunne ikke indlæses. Kontrollér linket, eller prøv igen."; console.error(error); }
}
load();
