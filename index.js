"use strict";
const container = document.querySelector("#category");
async function showCategories() {
  container.textContent = "Henter produkter …";
  try {
    const [beauty, fragrances] = await Promise.all([getCategory("beauty"), getCategory("fragrances")]);
    container.replaceChildren();
    const choices = [
      {title: "Beauty", href: "productlist.html?category=beauty", product: beauty[0]},
      {title: "Fragrances", href: "productlist.html?category=fragrances", product: fragrances[0]},
      {title: "Natural", href: "productlist.html?category=beauty&subcategory=natural", product: {thumbnail: "images/natural-placeholder.svg"}}
    ];
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
  } catch (error) {
    container.textContent = "Produkterne kunne ikke indlæses. Prøv at genindlæse siden.";
    console.error(error);
  }
}
showCategories();
