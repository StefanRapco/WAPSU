# 🗂️ Webová aplikácia pre správu úloh

Moderná webová aplikácia na správu úloh určená pre jednotlivcov aj menšie tímy. Vznikla ako súčasť bakalárskej práce na Paneurópskej vysokej škole a zameriava sa na efektívne plánovanie, organizovanie a sledovanie úloh s podporou tímovej spolupráce a analytiky.

## 🚀 Funkcionality

- ✅ Kanban tabuľa na správu úloh
- 🔒 Prihlasovanie cez e-mail a heslo
- 👥 Tímová spolupráca, správa rolí a členov tímu
- 📊 Analytika úloh (trendy, priority, časové osy)
- 📝 Komentáre, checklisty, stavy a priority úloh
- 📧 Notifikácie cez e-mail
- ⚙️ Admin rozhranie pre správu používateľov

## 🛠️ Použité technológie

### Frontend
- **React** + **TypeScript**
- **Material UI (MUI)** – komponenty používateľského rozhrania
- **Apollo Client** – komunikácia s GraphQL API

### Backend
- **Node.js** – serverové prostredie
- **Apollo Server** – GraphQL server
- **Prisma ORM** – správa databázy a typová bezpečnosť
- **MySQL** – relačná databáza

### Vývojové nástroje
- **Git** – verzovanie kódu
- **Formik + yup** – formuláre a validácia
- **GraphQL Codegen** – typovanie dotazov a mutácií

## 📁 Štruktúra projektu

```plaintext
📦 root
┣ 📂 frontend               # Frontend aplikácie (React + TS)
┃ ┣ 📂 components           # Znovupoužiteľné UI komponenty
┃ ┣ 📂 pages                # Stránky aplikácie (Dashboard, Tímy, Úlohy, ...)
┃ ┗ 📜 App.tsx              # Vstupný bod klienta
┣ 📂 api                    # Backend (Node.js + Apollo Server)
┃ ┣ 📂 graphql              # Schémy, resolvery, validácie
┃ ┃ 📜 index.js             # Vstupný bod servera
┃ ┣ 📂 prisma               # Databázové modely a migrácie
┃ ┃ ┣ 📜 schema.prisma      # Databázová schéma
┃ ┃ ┗ 📜 seed.ts            # Seedovanie dát (voliteľné)
┣ 📜 schema.graphql         # GraphQL typy a dotazy
┗ 📜 README.md
```

## 🧪 Testovanie

- Backend testovaný jednotkovými testami (logika a GraphQL resolvery).
- Frontend komponenty testované renderovaním a správaním.

## 🎓 Bakalárska práca

Túto aplikáciu vyvinul **Štefan Rapčo** v rámci bakalárskej práce. Práca obsahuje analýzu technológií, návrh architektúry, implementáciu a testovanie v reálnych scenároch.

## ❗️ Upozornenie – Nekopírovať kód

Tento repozitár slúži výlučne na prezentačné a študijné účely ako súčasť bakalárskej práce.

🔐 **Bez výslovného súhlasu autora nie je dovolené:**
- kopírovať, sťahovať ani zverejňovať časti kódu
- používať kód v komerčných alebo nekomerčných projektoch
- upravovať alebo šíriť kód ako vlastné dielo

**Kód je chránený autorským zákonom. Jeho neoprávnené použitie môže byť právne postihnuteľné** v súlade so zákonom č. 185/2015 Z. z. (Autorský zákon Slovenskej republiky).
