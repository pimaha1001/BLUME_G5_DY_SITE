"use strict";

// Fælles funktioner til produktdata, priser og den lokale kurv.
const API = "https://dummyjson.com/products";
// API'et angiver ikke valuta i produktdata. USD er denne demos visningsvalg.
const money = (value) => new Intl.NumberFormat("da-DK", { style: "currency", currency: "USD" }).format(value);
// Beregner produktets pris efter en eventuel procentvis rabat.
const salePrice = (p) => p.price * (1 - (p.discountPercentage || 0) / 100);

// Henter JSON fra en adresse og gør netværksfejl tydelige for kaldende kode.
async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API-fejl: ${response.status}`);
  return response.json();
}

// Opretter HTML-elementer og sætter tekst sikkert som almindelig tekst.
function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

const categoryRequests = new Map();

// Henter alle produkter fra en af de kategorier, som API'et understøtter.
async function getCategory(category) {
  if (!["beauty", "fragrances"].includes(category)) throw new Error("Ukendt kategori");
  // limit=0 henter alle produkter i kategorien.
  // Genbrug samme igangværende/afsluttede anmodning på tværs af forside og anmeldelser.
  if (!categoryRequests.has(category)) {
    const request = fetchJSON(`${API}/category/${category}?limit=0`)
      .then(data => data.products)
      .catch(error => {
        categoryRequests.delete(category); // Tillad nyt forsøg efter netværksfejl.
        throw error;
      });
    categoryRequests.set(category, request);
  }
  return categoryRequests.get(category);
}

// Natural-demoen er midlertidigt deaktiveret. Dataene er bevaret som kommentar.
/*
const naturalExamples = [
  { title: "Natural Aloe Vera Gel", description: "Fiktivt demo-produkt: aloe vera-gel til hudpleje.", price: 12.99, stock: 30, image: "images/NaturalAloeVeraGel.webp" },
  { title: "Natural Jojoba Face Oil", description: "Fiktivt demo-produkt: ansigtsolie med jojoba.", price: 18.99, stock: 25, image: "images/NaturalJojobaFaceOil.webp" },
  { title: "Natural Shea Body Butter", description: "Fiktivt demo-produkt: body butter med sheasmør.", price: 15.99, stock: 20, image: "images/NaturalSheaBodyButter.webp" },
  { title: "Natural Coconut Lip Balm", description: "Fiktivt demo-produkt: læbepomade med kokosolie.", price: 4.99, stock: 50, image: "images/NaturalCoconutLipBalm.webp" },
  { title: "Natural Oat Face Cleanser", description: "Fiktivt demo-produkt: ansigtsrens med havre.", price: 11.99, stock: 35, image: "images/OatFaceCleanser.webp" },
].map(({ image, ...product }, index) => ({ ...product, id: `natural-${index + 1}`, category: "beauty", subcategory: "natural", brand: "Natural Demo", tags: ["beauty", "natural"], discountPercentage: 0, thumbnail: image, images: [image] }));

function getNaturalProducts() {
  return naturalExamples;
}
*/

// Navnet på browserlagerets felt, hvor kurven gemmes.
const BASKET_KEY = "blume-basket-v1";

// Læser kurven fra browseren; en tom eller ugyldig værdi giver en tom liste.
function getBasket() {
  try {
    const savedBasket = JSON.parse(localStorage.getItem(BASKET_KEY) || "[]");
    return Array.isArray(savedBasket) ? savedBasket : [];
  } catch {
    return [];
  }
}

// Gemmer kurven og fortæller åbne sider, at indholdet er ændret.
function saveBasket(basket) {
  localStorage.setItem(BASKET_KEY, JSON.stringify(basket));
  window.dispatchEvent(new Event("basketchange"));
}

// Tilføjer et valgt antal eller øger antallet, hvis varen allerede ligger i kurven.
function addToBasket(product, quantity = 1) {
  const basket = getBasket();
  let productFound = false;

  for (const item of basket) {
    if (String(item.id) === String(product.id)) {
      item.quantity += quantity;
      productFound = true;
      break;
    }
  }

  if (!productFound) {
    basket.push({
      id: product.id,
      title: product.title,
      price: product.price,
      discountPercentage: product.discountPercentage || 0,
      thumbnail: product.thumbnail || product.images?.[0],
      category: product.category,
      subcategory: product.subcategory || "",
      quantity,
    });
  }

  saveBasket(basket);
}
