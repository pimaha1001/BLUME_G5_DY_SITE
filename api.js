"use strict";
const API = "https://dummyjson.com/products";
// API'et angiver ikke valuta i produktdata. USD er denne demos visningsvalg.
const money = value => new Intl.NumberFormat("da-DK", {style: "currency", currency: "USD"}).format(value);
const salePrice = p => p.price * (1 - (p.discountPercentage || 0) / 100);
async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API-fejl: ${response.status}`);
  return response.json();
}
function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
async function getCategory(category) {
  if (!["beauty", "fragrances"].includes(category)) throw new Error("Ukendt kategori");
  // limit=0 henter alle produkter i kategorien.
  const data = await fetchJSON(`${API}/category/${category}?limit=0`);
  return data.products;
}

// Natural er vores egen underkategori; DummyJSON opretter ikke kategorier.
const NATURAL_KEY = "beauty-natural-products-v1";
const naturalExamples = [
  {title: "Natural Aloe Vera Gel", description: "Fiktivt demo-produkt: aloe vera-gel til hudpleje.", price: 12.99, stock: 30},
  {title: "Natural Jojoba Face Oil", description: "Fiktivt demo-produkt: ansigtsolie med jojoba.", price: 18.99, stock: 25},
  {title: "Natural Shea Body Butter", description: "Fiktivt demo-produkt: body butter med sheasmør.", price: 15.99, stock: 20},
  {title: "Natural Coconut Lip Balm", description: "Fiktivt demo-produkt: læbepomade med kokosolie.", price: 4.99, stock: 50},
  {title: "Natural Oat Face Cleanser", description: "Fiktivt demo-produkt: ansigtsrens med havre.", price: 11.99, stock: 35}
].map((p, i) => ({...p, localId: `natural-${i + 1}`, category: "beauty", subcategory: "natural", brand: "Natural Demo", tags: ["beauty", "natural"], discountPercentage: 0, thumbnail: "images/natural-placeholder.svg", images: ["images/natural-placeholder.svg"]}));
function getNaturalProducts() {
  try {
    const data = JSON.parse(localStorage.getItem(NATURAL_KEY) || "[]");
    return Array.isArray(data) ? data.filter(p => p.category === "beauty" && p.subcategory === "natural" && /^natural-[1-5]$/.test(p.id)) : [];
  } catch { return []; }
}
async function addNaturalProducts() {
  const saved = [];
  for (const product of naturalExamples) {
    const {localId, ...body} = product;
    const response = await fetch(`${API}/add`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error(`POST-fejl: ${response.status}`);
    const result = await response.json();
    // Serverens simulerede id kan gentages; lokale id'er giver sikre detaljelinks.
    saved.push({...body, apiId: result.id, id: localId});
  }
  // Gem først, når alle fem POST-kald er lykkedes. Genoprettelse giver ikke dubletter.
  localStorage.setItem(NATURAL_KEY, JSON.stringify(saved));
  return saved;
}
