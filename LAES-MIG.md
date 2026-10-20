Teknisk dokumentation – BLUME

Om projektet
Dette projekt er lavet som en del af Tema 8. Vi har udviklet en dynamisk webshop med HTML, CSS og JavaScript, hvor produktindhold hentes fra et REST API (DummyJSON). Websitet har en forside, produktliste, produktdetaljeside og indkøbskurv.

Brugeren kan se Beauty- og Fragrances-produkter, filtrere efter kategori, sortere efter laveste tilbudspris, åbne produktdetaljer, vælge antal, tilføje varer til kurven og gemme favoritter. Forsiden viser også produktanmeldelser. Profilikonet kan åbne en login-popup, men der er endnu ikke rigtig brugerautentificering. Hjerte ikonet i headeren leder hen til en favorit side der ikke er lavet endnu og ligeledes er der et forstørrelses glas der leder hen til en ikke eksisterende side.

Links

- GitHub repository: https://github.com/pimaha1001/BLUME_G5_DY_SITE.git
- GitHub Pages: https://pimaha1001.github.io/BLUME_G5_DY_SITE/index.html
- Figma: https://www.figma.com/board/OvM2W1mYOo0c0lsLQ5Hv0Z/BLUME?node-id=141-251&t=pbSFhemepSVrKg4i-0

Projektstruktur
Projektet er opdelt i HTML, CSS, JavaScript og billedfiler.
DE centrale filer ligger i samme mappe:
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

Felter vi bruger:

- id identificerer produktet;
- title er produktnavnet;
- brand er mærket;
- category bruges til filtrering;
- price og discountPercentage bruges til prisberegning;
- stock viser lagerstatus;
- thumbnail bruges som produktbillede.
- Produktdata kan også indeholde description, images og reviews.

API-adresser:

- https://dummyjson.com/products/category/beauty?limit=0
- https://dummyjson.com/products/category/fragrances?limit=0
- https://dummyjson.com/products/{id}

Prisen efter rabat beregnes med price \* (1 - discountPercentage / 100). USD bruges som visningsvaluta i projektet.

Formular og validering
Vi har en login-popup med felter til e-mail og adgangskode. Formularen bruger HTML-inputtyperne email og password samt autocomplete. Den aktuelle formular har ikke required på felterne, og den sender ikke data til en server. Den er derfor en demonstration af login-grænsefladen og ikke et færdigt login-system.

Git og branches
Da vi hovedesageligt har arbejdet udfra en kode fra den side, som vi har lavet tidligere i forløbet, så har vi først lavet ændringer i den gamle side og så senere oprettet dette projekt og lagt den op på git, derefter har vi i starten brugt branches, men efterfølgende har vi ikke benyttet det så meget, mest fordi nogle af gruppens medlemmer ikke var så stærke i det og hellere ville lave koden på deres egen computer til deres enkelte sider og så senere samle hele kode i fælleskab. Derfor har vi også lavet ændringer undervejs når vi har samlet koden. For at sikre at vi kan gå tilbage i koden, hvis der skete en fejl, så har vi gemt et kopi at koden manuelt, så vi har alle flere versioner liggende lokalt. Vi har skiftet mellem at lave commits ved små ændringer og ved større ændringer, men der har ikke været en fast strategi.

Bæredygtighed

Vi har arbejdet med digital bæredygtighed ved at gøre vores hjemmeside hurtigere og mindske mængden af data, der skal indlæses.

Vi har lavet hjemmesiden med HTML, CSS og JavaScript uden at bruge større frameworks som React eller Vue. Vi har også genbrugt JavaScript-funktioner på flere sider og brugt DummyJSON API'et til at hente produkter, så vi ikke skal skrive hvert produkt ind manuelt i HTML.

Vores tiltag:

- Genbrug af kode: Vi har samlet funktioner til at hente produkter i `api.js`, så vi kan bruge dem på flere sider uden at skrive den samme kode igen.
- Optimerede billeder: Vi har ændret store billeder som `hero.svg` og `goodiebox.svg` til WebP-format, så billederne fylder mindre og kan indlæses hurtigere.
- Optimering af JavaScript: Vi har brugt `defer`, så JavaScript ikke stopper indlæsningen af HTML. Vi har også brugt `Promise.all()` til at hente flere produktkategorier på samme tid og en `Map` til at undgå at hente de samme data flere gange.
- Hurtigere indlæsning: Vi har tilføjet `fetchpriority="high"` til hero-billedet, så det bliver indlæst først. Vi har også brugt `preconnect` til at gøre forbindelsen til vores API hurtigere.
- Enkel navigation: Vi har gjort hjemmesiden nem at finde rundt på og opdelt produkterne i Beauty og Fragrances, så brugeren hurtigt kan finde det, de leder efter.

Vi har forsøgt at holde hjemmesidens page weight omkring 250 KB. Vi har målt den med Chrome DevTools, hvor resultatet var cirka 261 KB. Det betyder, at vi er tæt på vores mål, selvom målingen også kan indeholde data fra browserudvidelser.

Med disse ændringer har vi forsøgt at gøre hjemmesiden hurtigere og mindske unødvendigt dataforbrug. På den måde har vi taget hensyn til digital bæredygtighed i vores projekt.

Udfordringer undervejs

- At hente produktdata korrekt og vise dem på produktlisten.
- At sende produkt-id videre via URL'en til detaljesiden.
- At undgå JavaScript-fejl efter udkommentering af getNaturalProducts().
- At placere login-popup og indlæsning af login.js i den rigtige rækkefølge på siderne.
- At tilpasse produktkortenes afstande, rabat-tags og afrundede knapper i CSS.
- Hero-billedet: Det var svært at få billedet til at fylde hele bredden uden hvide kanter.
- Tilbudsbjælken: Det var svært at få bjælken placeret korrekt og tilpasse teksten.
- Centrering: Svært at centrere overskriften, mens linket stod til højre. Løst med CSS Grid.
- Ikoner: Svært at få ikonerne lige store. Løst med SVG og CSS.
- API: Det var en udfordring at hente anmeldelserne og vise dem med de rigtige produkter.
- Design: Det var svært at få anmeldelse - sektionen til at passe til hjemmesidens design og fungere på mobil.
- At få flere koder til at forbindes, når vi arbejdede seperat lokalt.
- At hoppe ned til på siden og stadig kunne se heading fra sektionen, så den ikke var gemt bag ved headermenuen.

Løsninger på vores udfordringer

- Produktdata: Vi brugte fetch() og async/await til at hente produkter fra API'et og vise dem dynamisk på produktlisten.
- Produkt-id: Vi brugte URLSearchParams til at hente produktets id fra URL'en, så det rigtige produkt blev vist på detaljesiden.
- JavaScript-fejl: Vi fjernede kald til getNaturalProducts(), efter funktionen blev udkommenteret, så koden ikke længere forsøgte at kalde en inaktiv funktion.
- Login-popup: Vi placerede login-popup'en korrekt i HTML og sørgede for, at login.js blev indlæst i den rigtige rækkefølge.
- Produktkort: Vi brugte CSS Grid, gap, border-radius og padding til at justere afstande, rabat-tags og knapper.
- Hero-billede: Vi brugte CSS med width: 100% og object-fit: cover, så billedet fyldte hele bredden uden hvide kanter.
- Tilbudsbjælke: Vi justerede placering, tekststørrelse og afstande med CSS, så bjælken passede til designet.
- Centrering: Vi brugte CSS Grid til at centrere overskriften, samtidig med at linket blev placeret til højre.
- Ikoner: Vi brugte SVG-ikoner og CSS til at sikre ensartede størrelser og placeringer.
- Anmeldelser fra API: Vi brugte produkt-id'er til at knytte anmeldelser til de rigtige produkter og async/await til at håndtere data.
- Anmeldelsesdesign: Vi brugte CSS Grid, Flexbox og media queries til at tilpasse sektionen til både desktop og mobil.
- Samarbejde: Vi samlede vores kode og kontrollerede filnavne, stier og forbindelser mellem HTML, CSS og JavaScript, når vi havde arbejdet separat lokalt.
- Navigation til sektioner: Vi brugte scroll-margin-top i CSS, så overskrifterne ikke blev skjult bag headeren, når man klikkede på et ankerlink.

Generel fejlfinding
Vi brugte især console.log() og browserens konsol til at finde JavaScript-fejl. Derudover brugte vi try/catch til at håndtere fejl ved API-kald og testede løbende hjemmesiden for at sikre, at funktionerne virkede efter ændringerne.

Mulige forbedringer

- Ægte login og kontooprettelse med sikker autentificering.
- Søgefunktion til produkter.
- Flere forbedringer af fejlbeskeder, loading states og tilgængelighed.
- Aktivere eller erstatte Natural-demo-produkterne med en reel datakilde.
- Måle og optimere sidernes page weight.
- Gennemgå afstande mellem produkttekst og pris samt styling af produktknapper og discount-tags på tværs af skærmstørrelser.
- Styling af productlist siden, da det er den vi har brugt mindst tid på at ændre styling på og derved kunne den godt bruge lidt kærlighed.
- Lave de to manglende sider: søgesiden og favoritsiden.

Gruppemedlemmer

- Pia Maagaard Hansen
- Freya Borch-Carnevale
- Husna Khan

Sådan startes projektet
Åbn projektmappen i VS Code, og start index.html med Live Server. Internetforbindelse er nødvendig for at hente produktdata og billeder fra API'et.
