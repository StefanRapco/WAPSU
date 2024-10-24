# Webová aplikácia pre správu úloh – Navrhovaná štruktúra a harmonogram

## Úvod

Témou tejto bakalárskej práce je vývoj webovej aplikácie pre správu úloh (Task Manager), ktorá umožní používateľom efektívne organizovať a spravovať úlohy. Systém bude zahŕňať funkcionality ako kategorizácia úloh podľa priority, termínov a projektov, a poskytne analytické nástroje pre sledovanie času stráveného na jednotlivých úlohách. Cieľom je navrhnúť a implementovať riešenie, ktoré bude intuitívne, bezpečné a poskytne flexibilné možnosti spolupráce medzi používateľmi.

## Teória

Správa úloh a organizácia práce sú dôležitými oblasťami výskumu v rámci softvérového inžinierstva, kde sa zameriavame na zefektívnenie pracovných procesov. Konkurencia v tejto oblasti je značná, s existenciou aplikácií ako Trello, Asana či Jira, ktoré poskytujú rôzne úrovne správy projektov a tímovej spolupráce. Tieto systémy využívajú rôzne technológie ako Kanban a Scrum, ktoré umožňujú flexibilné plánovanie a sledovanie úloh. Na základe vedeckých publikácií a konferenčných článkov sa ukazuje, že využitie agilných metodík pri vývoji softvéru prispieva k efektívnejšiemu riadeniu projektov, čo je aj jadrom tejto práce.

## Návrh softvéru

Pre vývoj tejto aplikácie bude využitá kombinácia frontendových technológií ako React a Apollo GraphQL a backendových technológií ako Node.js a Prisma ORM. Dôležitým aspektom návrhu bude bezpečnosť používateľských účtov. Bude sa klásť dôraz aj na intuitívne užívateľské rozhranie. Návrh softvéru bude postupovať podľa agilnej metodológie, kde budú iterácie prebiehať v rámci vývoja frontend a backend komponentov.

## Implementácia

Implementácia bude pozostávať z viacerých častí. V prvej fáze bude vytvorený základný model používateľských účtov a správy úloh, ktorý bude následne rozšírený o kolaboračné funkcionality ako zdieľanie a prideľovanie úloh medzi používateľmi. Backendová časť bude zahŕňať databázové riešenia pomocou MySQL, ktoré bude slúžiť na ukladanie úloh, používateľských údajov a projektov. Frontendová časť bude využívať React pre dynamické vykresľovanie obsahu a interakciu používateľov s úlohami v reálnom čase.

## Testovanie

Testovanie aplikácie bude prebiehať pomocou definovaných use cases, kde sa bude testovať najmä funkcionalita vytvárania, úpravy a zdieľania úloh. Používatelia budú musieť prejsť procesmi registrácie, správy úloh, prideľovania úloh v rámci tímu, a sledovania času stráveného na úlohách. Tieto testy budú analyzované z pohľadu UX, kde sa bude merať efektivita používateľských interakcií a jednoduchosti ovládania.

## Záver

V závere práce bude zhodnotený proces vývoja a výzvy, ktoré sa objavili počas implementácie. Cieľom tejto práce bolo vytvoriť webovú aplikáciu, ktorá bude slúžiť ako efektívny nástroj pre organizáciu a správu úloh v tímoch. Prínosy aplikácie spočívajú v jej flexibilite, intuitívnom rozhraní a možnosti pre detailnú analýzu pracovnej efektivity používateľov.

## Kľúčové funkcie a harmonogram (spolu 12 týždňov – zimný semester)

### 1. Setup projektu (2 týždne)

- Vytvorenie projektu ✓
- Vytvorenie repozitára a prepojenie projektu s GitHub ✓
- Setup FE ✓
- Setup BE ✓
- Komunikácia medzi BE a FE ✓
- Pridanie typovania (Typescript)
- Návrh databázy (BE)
  - Návrh modelov a roli
- Návrh React komponentov (FE)
  - Pridanie základného behu stránky pre používateľa

### 2. Overenie používateľa (1 týždeň)

- Bezpečné a overené prihlasovanie a registrácia
- Obnovenie hesla a overenie e-mailu

### 3. Správa úloh (4 týždne)

- Vytvárať, upravovať a odstraňovať úlohy
- Stanoviť priority a termíny pre úlohu
- Usporiadať úlohy do prispôsobiteľných kategórií
- Filtrovanie a vyhľadávanie úloh na základe rôznych kritérií (meno, kategória, stav – dokončená, nezačatá, začatá)

### 4. Spolupráca (2 týždne)

- Zdieľanie úloh s ostatnými používateľmi
- Prideľovanie úloh iným registrovaným používateľom v rovnakom projekte
- Možnosť pridať komentár k úlohe

### 5. Analytická časť (2 týždne)

- Prehľad úloh / Kalendár úloh
- Vizuálne správy o dokončení úloh a čakajúcich úlohách
- Zobrazenie grafov a tabuliek, zhrnutie času, koľko používateľ strávil na daných úlohách (možné filtrovanie)

### 6. Testovanie (1 týždeň)

- Testovanie funkcionalít
- Testovanie use cases

## Zatiaľ použité zdroje / dokumentácie:

- https://mui.com/material-ui/getting-started/installation/
- https://react.dev/learn
- https://www.prisma.io/
- https://graphql.org/
- https://argondigital.com/resource/tools-templates/rml-people-models/roles-and-permissions-matrices/
