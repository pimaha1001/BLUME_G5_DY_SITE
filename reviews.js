"use strict";

// Holder variablerne i denne fil adskilt fra resten af sidens scripts.
(() => {
  const list = document.querySelector("#blume-reviews-list");
  const previous = document.querySelector("#reviews-prev");
  const next = document.querySelector("#reviews-next");

  // Stop, hvis anmeldelsessektionen ikke findes på siden.
  if (!list || !previous || !next) return;

  let reviews = [];
  let current = 0;

  // Vis færre anmeldelser på små skærme.
  const visibleCount = () => (window.matchMedia("(max-width: 650px)").matches ? 1 : 3);

  function render() {
    list.replaceChildren();

    if (!reviews.length) {
      list.textContent = "Der er ingen anmeldelser at vise lige nu.";
      previous.disabled = true;
      next.disabled = true;
      return;
    }

    const count = Math.min(visibleCount(), reviews.length);
    for (let offset = 0; offset < count; offset++) {
      // Gå videre gennem anmeldelserne, og start forfra ved listens slutning.
      let reviewIndex = current + offset;
      if (reviewIndex >= reviews.length) reviewIndex -= reviews.length;

      const { review, product } = reviews[reviewIndex];
      const card = element("article", undefined, "blume-review-card");
      card.append(element("h3", "ANMELDELSE"), element("p", review.reviewerName || "Anonym", "blume-review-name"));

      const productLink = element("a", product.title, "blume-review-product");
      productLink.href = `product.html?id=${encodeURIComponent(product.id)}&category=${encodeURIComponent(product.category)}`;

      const stars = element("div", undefined, "blume-review-stars");
      const rating = Math.max(0, Math.min(5, Math.round(Number(review.rating) || 0)));
      stars.textContent = "★".repeat(rating) + "☆".repeat(5 - rating);
      stars.setAttribute("aria-label", `${rating} ud af 5 stjerner`);

      const comment = element("p", review.comment || "Ingen kommentar", "blume-review-comment");

      card.append(productLink, stars, comment);
      list.append(card);
    }

    previous.disabled = next.disabled = reviews.length <= count;
  }

  previous.addEventListener("click", () => {
    current--;
    if (current < 0) current = reviews.length - 1;
    render();
  });
  next.addEventListener("click", () => {
    current++;
    if (current >= reviews.length) current = 0;
    render();
  });

  // Tegn kortene igen, hvis skærmstørrelsen ændrer antallet af synlige anmeldelser.
  window.addEventListener("resize", render);

  async function loadReviews() {
    try {
      const beautyProducts = await getCategory("beauty");
      const fragranceProducts = await getCategory("fragrances");

      // Gem hver anmeldelse sammen med det produkt, den hører til.
      for (const product of [...beautyProducts, ...fragranceProducts]) {
        if (!product.reviews) continue;
        for (const review of product.reviews) {
          reviews.push({ product, review });
        }
      }

      render();
    } catch (error) {
      console.error("Kunne ikke hente BLUME-anmeldelser:", error);
      list.textContent = "Anmeldelserne kunne ikke indlæses. Prøv igen senere.";
      previous.disabled = true;
      next.disabled = true;
    }
  }

  loadReviews();
})();
