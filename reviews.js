"use strict";

// Holder variablerne i denne fil adskilt fra resten af sidens scripts.
(() => {
  // Finder anmeldelseslisten og de to knapper i index.html.
  const list = document.querySelector("#blume-reviews-list");
  const previous = document.querySelector("#reviews-prev");
  const next = document.querySelector("#reviews-next");

  // Stop, hvis anmeldelsessektionen ikke findes på siden.
  if (!list || !previous || !next) return;

  // Her gemmes alle anmeldelser, når de er hentet fra API'et.
  let reviews = [];
  // Nummeret på den anmeldelse, som vises først i listen.
  let current = 0;

  // Vis færre anmeldelser på små skærme.
  const visibleCount = () => (window.matchMedia("(max-width: 650px)").matches ? 1 : 3);

  // Bygger anmeldelseskortene igen ud fra current og skærmens størrelse.
  function render() {
    // Fjern de tidligere kort, før den aktuelle visning tegnes.
    list.replaceChildren();

    // Vis en besked og slå pilene fra, hvis API'et ikke gav anmeldelser.
    if (!reviews.length) {
      list.textContent = "Der er ingen anmeldelser at vise lige nu.";
      previous.disabled = true;
      next.disabled = true;
      return;
    }

    // Vælg det antal anmeldelser, der kan vises på den aktuelle skærm.
    const count = Math.min(visibleCount(), reviews.length);
    for (let offset = 0; offset < count; offset++) {
      // Gå videre gennem anmeldelserne, og start forfra ved listens slutning.
      let reviewIndex = current + offset;
      if (reviewIndex >= reviews.length) reviewIndex -= reviews.length;

      // Hver anmeldelse er gemt sammen med sit produkt.
      const { review, product } = reviews[reviewIndex];
      const card = element("article", undefined, "blume-review-card");

      // Vis en overskrift og anmelderens navn; brug "Anonym" hvis navnet mangler.
      card.append(element("h3", "ANMELDELSE"), element("p", review.reviewerName || "Anonym", "blume-review-name"));

      // Link til produktet, og kod værdierne så de fungerer sikkert i URL'en.
      const productLink = element("a", product.title, "blume-review-product");
      productLink.href = `product.html?id=${encodeURIComponent(product.id)}&category=${encodeURIComponent(product.category)}`;

      // Rund og begræns bedømmelsen til 0-5 stjerner, og vis den som tekst.
      const stars = element("div", undefined, "blume-review-stars");
      const rating = Math.max(0, Math.min(5, Math.round(Number(review.rating) || 0)));
      stars.textContent = "★".repeat(rating) + "☆".repeat(5 - rating);
      stars.setAttribute("aria-label", `${rating} ud af 5 stjerner`);

      // Vis anmeldelsens kommentar eller en besked, hvis den mangler.
      const comment = element("p", review.comment || "Ingen kommentar", "blume-review-comment");

      // Saml indholdet i kortet, og tilføj kortet til sektionen på siden.
      card.append(productLink, stars, comment);
      list.append(card);
    }

    // Pilene er kun aktive, hvis der er flere anmeldelser end synlige kort.
    previous.disabled = next.disabled = reviews.length <= count;
  }

  // Gå én anmeldelse tilbage; start ved den sidste, hvis vi er ved begyndelsen.
  previous.addEventListener("click", () => {
    current--;
    if (current < 0) current = reviews.length - 1;
    render();
  });

  // Gå én anmeldelse frem; start ved den første, hvis vi er ved slutningen.
  next.addEventListener("click", () => {
    current++;
    if (current >= reviews.length) current = 0;
    render();
  });

  // Tegn kortene igen, hvis skærmstørrelsen ændrer antallet af synlige anmeldelser.
  window.addEventListener("resize", render);

  // Henter produkter og anmeldelser fra API'et.
  async function loadReviews() {
    try {
      // Hent begge produktkategorier; await venter på svar fra API'et.
      const beautyProducts = await getCategory("beauty");
      const fragranceProducts = await getCategory("fragrances");

      // Gå gennem begge produktlister og gem hver anmeldelse sammen med produktet.
      for (const product of [...beautyProducts, ...fragranceProducts]) {
        // Fortsæt til næste produkt, hvis dette produkt ikke har anmeldelser.
        if (!product.reviews) continue;
        for (const review of product.reviews) {
          reviews.push({ product, review });
        }
      }

      // Vis anmeldelserne, efter alle produkter er gennemgået.
      render();
    } catch (error) {
      // Skriv fejlen i konsollen, vis en besked på siden, og slå pilene fra.
      console.error("Kunne ikke hente BLUME-anmeldelser:", error);
      list.textContent = "Anmeldelserne kunne ikke indlæses. Prøv igen senere.";
      previous.disabled = true;
      next.disabled = true;
    }
  }

  // Start indlæsningen, når scriptet bliver kørt.
  loadReviews();
})();
