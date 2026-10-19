Teknisk dokumentation – BLUME

Om projektet
Dette projekt er lavet som en del af Tema 8. Vi har udviklet en dynamisk webshop med HTML, CSS og JavaScript, hvor produktindhold hentes fra et REST API (DummyJSON). Websitet har en forside, produktliste, produktdetaljeside og indkøbskurv.

Brugeren kan se Beauty- og Fragrances-produkter, filtrere efter kategori, sortere efter laveste tilbudspris, åbne produktdetaljer, vælge antal, tilføje varer til kurven og gemme favoritter. Forsiden viser også produktanmeldelser. Profilikonet kan åbne en login-popup, men der er endnu ikke rigtig brugerautentificering.

Links

- GitHub repository: [indsæt link]
- GitHub Pages: [indsæt link]
- Figma: [indsæt link]
- Trello: [indsæt link]

Projektstruktur
Projektet er opdelt i HTML, CSS, JavaScript og billedfiler. I den senest gennemgåede projekt-ZIP ligger de centrale filer i samme mappe:
BLUME_G5_DY_SITE/
├── index.html
├── productlist.html
├── product.html
├── basket.html
├── style.css
├── script.js
├── api.js
├── index.js
├── productlist.js
├── product.js
├── basket.js
├── reviews.js
├── login.js
├── images/
└── LAES-MIG.md

Filbeskrivelser

- index.html – forsiden med produktsektioner og anmeldelser.
- productlist.html – produktoversigt med kategori- og prisfiltrering.
- product.html – detaljer om et produkt valgt via URL'en.
- basket.html – viser og opdaterer indkøbskurven.
- style.css – styrer design, farver, layout og responsive tilpasninger.
- script.js – fælles interaktioner på websitet.
- api.js – fælles API-kald, prisberegning, DOM-hjælpere og kurvefunktioner.
- index.js – dynamiske produktkort og favoritter på forsiden.
- productlist.js – hentning, filtrering, sortering og visning af produktkort.
- product.js – produktdetaljer, antal, favoritter og tilføjelse til kurv.
- basket.js – visning af kurvens varer, antal og subtotal.
- reviews.js – henter og viser produktanmeldelser på forsiden.
- login.js – åbner og lukker login-popup'en.

Hvordan koden fungerer
Vi har opdelt JavaScript, så hver side har sin egen fil, mens fælles funktioner samles i api.js og script.js.

index.js
Henter og viser produkter på forsiden. Produktkortene har billeder, navne, priser og mulighed for at lægge i kurv eller gemme favoritter. Favoritter gemmes i browserens localStorage.

productlist.js
Henter Beauty og Fragrances via getCategory() fra api.js. Kategorien læses fra URL'en med URLSearchParams. Funktionen render() filtrerer produkterne, sorterer efter pris ved behov og bygger produktkort i DOM'en.

Flow:

1. Siden indlæses.
2. JavaScript læser kategori fra URL'en.
3. Produktdata hentes fra REST API'et.
4. Data filtreres efter den valgte kategori.
5. Produktkort oprettes og indsættes i DOM'en.
6. Brugeren kan åbne en detaljeside eller lægge en vare i kurven.

Natural er stadig en filtermulighed, men de lokale Natural-demo-produkter er udkommenteret i api.js. Derfor er Natural-listen normalt tom i den aktuelle version.

product.js
Læser produktets id fra URL'en med URLSearchParams og henter det tilsvarende produkt fra DummyJSON. Samme HTML-side kan derfor vise forskellige produkter. Siden viser blandt andet billede, titel, beskrivelse, pris, rabat, lagerstatus og antalvælger.

basket.js
Henter kurvens gemte varer fra localStorage, viser dem og beregner subtotalen. Brugeren kan ændre antal og fjerne varer.

reviews.js
Gennemgår produkternes anmeldelser fra API'et og viser dem i en sektion på forsiden med frem- og tilbageknapper.

login.js
Når brugeren klikker på profil-linket i headeren, vises en login-popup. Den kan lukkes med luk-knappen, klik uden for boksen eller Escape. Formularens indsendelse stoppes med preventDefault() og logger ikke brugeren ind. Der er ikke implementeret backend eller autentificering.

Navngivning
Vi har brugt beskrivende filnavne og primært camelCase til JavaScript-variabler og funktioner.

Eksempler på variabler: products, selection, currentProduct, quantity.

Eksempler på funktioner: getCategory(), fetchJSON(), salePrice(), renderBasket() og openLogin().

Kommentarer i koden

Vi har tilføjet kommentarer ved API-kald, filtrering, DOM-manipulation og funktioner, hvor det hjælper forståelsen. Eksempel fra api.js:
// Henter alle produkter fra en af de kategorier, som API'et understøtter.
async function getCategory(category) {
if (!["beauty", "fragrances"].includes(category)) throw new Error("Ukendt kategori");
const data = await fetchJSON(`${API}/category/${category}?limit=0`);
return data.products;
}

Data og JSON-struktur
Vi bruger DummyJSON, som leverer produktdata i JSON-format. Et forenklet eksempel på de felter, vi bruger:
{
"id": 1,
"title": "Produktnavn",
"brand": "Brand",
"category": "beauty",
"price": 12.99,
"discountPercentage": 10,
"stock": 25,
"thumbnail": "https://example.com/product.jpg"
}

Felter vi bruger: id identificerer produktet; title er produktnavnet; brand er mærket; category bruges til filtrering; price og discountPercentage bruges til prisberegning; stock viser lagerstatus; thumbnail bruges som produktbillede. Produktdata kan også indeholde description, images og reviews.

API-adresser:

- https://dummyjson.com/products/category/beauty?limit=0
- https://dummyjson.com/products/category/fragrances?limit=0
- https://dummyjson.com/products/{id}

Prisen efter rabat beregnes med price \* (1 - discountPercentage / 100). USD bruges som visningsvaluta i projektet.

Formular og validering
Vi har en login-popup med felter til e-mail og adgangskode. Formularen bruger HTML-inputtyperne email og password samt autocomplete. Den aktuelle formular har ikke required på felterne, og den sender ikke data til en server. Den er derfor en demonstration af login-grænsefladen og ikke et færdigt login-system.

Git og branches
Dette afsnit udfyldes med gruppens faktiske Git-arbejde. Beskriv, hvilke branches I har brugt, hvordan I har fordelt opgaver, lavet commits, pushet til GitHub og flettet ændringer ind i main.

Eksempler på branch-navne (udfyld med jeres egne): feature-forside-navn, feature-produktliste-navn, feature-kurv-navn.

Bæredygtighed
Projektet bruger HTML, CSS og JavaScript uden et tungt frontend-framework. Genbrug af fælles JavaScript-funktioner og brug af API-data reducerer behovet for at vedligeholde gentaget indhold. Billeder og andre ressourcer bør optimeres. Page weight under 250 KB er ikke dokumenteret som målt, så det bør testes, før I skriver, at kravet er opfyldt.

Udfordringer undervejs

- At hente produktdata korrekt og vise dem på produktlisten.
- At sende produkt-id videre via URL'en til detaljesiden.
- At undgå JavaScript-fejl efter udkommentering af getNaturalProducts().
- At placere login-popup og indlæsning af login.js i den rigtige rækkefølge på siderne.
- At tilpasse produktkortenes afstande, rabat-tags og afrundede knapper i CSS.

Løsninger: Vi har brugt console.log()/browserkonsollen ved fejlfinding, URLSearchParams til URL-data, try/catch omkring asynkrone kald og CSS Grid til produktlayoutet. Natural-kaldet blev fjernet fra produktlistens aktive filtrering.

Mulige forbedringer

- Ægte login og kontooprettelse med sikker autentificering.
- Søgefunktion til produkter.
- Flere forbedringer af fejlbeskeder, loading states og tilgængelighed.
- Aktivere eller erstatte Natural-demo-produkterne med en reel datakilde.
- Måle og optimere sidernes page weight.
- Gennemgå afstande mellem produkttekst og pris samt styling af produktknapper og discount-tags på tværs af skærmstørrelser.

Gruppemedlemmer

- [Navn 1]
- [Navn 2]
- [Navn 3]
- [Navn 4]

Sådan startes projektet
Åbn projektmappen i VS Code, og start index.html med Live Server. Internetforbindelse er nødvendig for at hente produktdata og billeder fra API'et.
