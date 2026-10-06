# Beauty, Fragrances og Natural med DummyJSON

## Start hjemmesiden
Pak ZIP-filen ud. Åbn mappen i VS Code, og åbn index.html med Live Server.
Alternativt: kør `python -m http.server 8000` i mappen og åbn http://localhost:8000.
Internet er nødvendigt for at hente produkter og billeder.

## Kategorier og underkategori
Beauty hentes fra https://dummyjson.com/products/category/beauty?limit=0.
Fragrances (parfumer) hentes fra https://dummyjson.com/products/category/fragrances?limit=0.
Natural er vores lokale underkategori under Beauty. Essence-kategorifilteret er fjernet.
Et produkt fra Essence kan stadig vises under Beauty, som en del af API'ets data.

## Filerne
- api.js: fælles fetch, DOM-hjælpere og prisberegning. Indlæses før sidens eget script.
- index.js: bygger tre kort med links til Beauty, Fragrances og Natural.
- productlist.js: læser `data.products`, filtrerer kategori og underkategori og sorterer efter pris efter rabat.
- product.js: læser id fra sidens URL og henter `/products/{id}`.
- HTML/CSS: den oprindelige skabelons layout med filtre tilpasset Beauty.

## Ændringer i datafelter
| Oprindeligt | DummyJSON |
| --- | --- |
| productdisplayname | title |
| brandname | brand |
| discount | discountPercentage |
| soldout | stock === 0 |
| Billedadresse bygget af id | thumbnail eller images[0] |
| Produktliste direkte i svaret | data.products |
| basecolour | Findes ikke; feltet viser description i stedet |

## Eksempel: hent og filtrér
```js
const response = await fetch("https://dummyjson.com/products/category/beauty?limit=0");
if (!response.ok) throw new Error(`API-fejl: ${response.status}`);
const data = await response.json();
const beautyProducts = data.products;
```
`fetch()` sender en GET-forespørgsel. `response.json()` omdanner svaret til JavaScript-data.
Svaret er et objekt med products, total, skip og limit. Derfor bruges data.products.
limit=0 henter alle produkter i kategorien, så filteret ikke kun bruger første side.

## Produktdetaljer
Linket `product.html?id=1` giver id=1. product.js henter derefter
https://dummyjson.com/products/1 og fylder HTML-elementerne med produktets felter.
API-tekst indsættes med textContent, og kort bygges med createElement.

## Pris og funktioner
Pris efter rabat beregnes som price * (1 - discountPercentage / 100).
Beløbene vises med to decimaler. Produktdata indeholder ingen valuta; USD er valgt
som demo-visning, uden omregning til danske kroner. Ret currency i api.js, hvis I
har en anden valuta-aftale. En ændret valutasymbol er ikke en valutaomregning.

Køns-, sæson- og størrelsesvalg er fjernet, da de felter ikke findes på disse produkter.
Demoen viser produkter, kategorifilter, pris-sortering, lager og fejlbeskeder.
Indkøbskurv og betaling er ikke implementeret. DummyJSON er et test-API.
Layoutet bygger på den oprindelige skabelon. Farverne er tilpasset jeres palette; forsiden bruger en rosa/creme/lavendel-gradient.

Dokumentation: https://dummyjson.com/docs/products

## Kontrol
JavaScript-filerne er syntakskontrolleret med node --check.
API-svarets struktur og felter er kontrolleret via det offentlige endpoint.
En fuld browserkontrol er ikke udført.


## Ny underkategori: Beauty / Natural
Åbn produktlisten, og tryk på "Tilføj 5 Natural-demo-produkter".
Knappen sender ét POST-kald til /products/add for hvert af fem fiktive produkter.
Produkterne har category: "beauty" og vores eget felt subcategory: "natural".
Det er en underkategori i hjemmesiden, ikke en ny kategori på DummyJSON-serveren.

DummyJSON simulerer POST og gemmer ikke produkterne. Efter fem vellykkede svar
gemmes demo-data i localStorage i den aktuelle browser. De føjes til produktlisten,
kan filtreres med Natural og har lokale detaljesider. Illustrationerne er pladsholdere.
Lokale id'er natural-1 til natural-5 bruges, fordi simulerede server-id'er ikke
kan bruges til at hente disse produkter igen. Server-id'et beholdes i apiId.

Genoprettelse erstatter de samme fem produkter uden dubletter. Ved fejl gemmes
ingen ny liste; en tidligere liste bevares. localStorage er knyttet til browser og
webadresse: produkterne deles ikke med andre brugere og forsvinder ved rydning af
webstedsdata. Et fælles, permanent katalog kræver en backend/database.
Der sendes ingen POST ved almindelig indlæsning af en side.


## Farvepalette
Alle otte farver er defineret som CSS-variabler øverst i style.css.
| Farve | Hex | Brug |
| --- | --- | --- |
| Petal Pink | #F3C6D5 | Header, footer, Beauty-kort og hero |
| Powder Blush | #E9AFC2 | Knapper og kategorilabels |
| Porcelain | #FFF9F4 | Baggrund og lys tekst på mørke knapper |
| Matcha Cream | #D8DEC2 | Natural og lagerstatus |
| Lavender Mist | #DCD3E8 | Fragrances og produktets informationsboks |
| Cherry Lacquer | #8E2940 | Aktive knapper, CTA, rabat og overskrift |
| Warm Cocoa | #4A3432 | Tekst og knapkanter |
| Champagne Gold | #C9A66B | Fine kanter og detaljer |

Mørk kakao bruges til tekst på pastelfarver; creme bruges på kirsebærrøde knapper.
Produktbilleder og eksisterende logoer er billedfiler med deres egne farver.


## BLUME-logo
Jeres originale logo er gemt som images/blume-logo.png og bruges i header og footer
på alle tre sider. Header-logoet linker til forsiden. Brandnavn og sidetitler er
opdateret til BLUME. Logoets format og farver bevares, og størrelsen tilpasses mobil.
