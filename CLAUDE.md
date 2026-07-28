# Packhelp Redesign — instrukcje projektu

Przed zbudowaniem lub edycją jakiejkolwiek strony/sekcji w tym repo przeczytaj
[`PAGE_BUILDING_GUIDELINE.md`](PAGE_BUILDING_GUIDELINE.md). Mapuje on intencję
("chcę sekcję X", "potrzebuję kroku konfiguratora do wyboru Y") na konkretny
komponent, wariant przycisku, wzorzec karty i odstęp między sekcjami — na
podstawie analizy `index.html`, `build-your-box.html`, `packaging.html` i
`sample-packs.html`.

Trzymaj się kanonicznych rekomendacji z tego pliku (m.in. sekcja 8 — znane
niespójności prototypu i ich zalecane rozwiązanie, np. rozmiar H2 czy domyślna
widoczność `.section-badge`) zamiast bezrefleksyjnie kopiować niespójności ze
starych sekcji do nowych.

To static HTML/CSS/JS prototype — bez build toolingu. `tokens.css`, `base.css`,
`components.css` to warstwa design tokenów/atomów wspólna dla wszystkich stron;
layout specyficzny dla sekcji zostaje inline w `<style>` danej strony, dopóki nie
powtórzy się na więcej niż jednej stronie (wtedy dopiero awansuje do
`components.css`).

**Nawigacja to jeden komponent — `nav-header.js` — nigdy nie buduj jej od nowa
inline na stronie.** Każda strona, która potrzebuje topbara, dostaje wyłącznie
placeholder(y) + `<script src="nav-header.js"></script>`; markup i style
nawigacji edytujesz tylko w `nav-header.js` / `components.css` (sekcja "Top
nav"), zmiana propaguje się automatycznie wszędzie. Ma dwa warianty:

- **Pełna** (sticky bar + nav-wrapper z megamenu, search, CTA) — na
  `index.html`, `packaging.html`, `build-your-box.html`, `sample-packs.html`.
  Placeholdery: `<div id="ph-sticky-bar"></div>` i `<div id="ph-nav-wrapper"></div>`.
- **Uproszczona** (samo wycentrowane logo, bez linków/megamenu) — na stronach
  typu "flow"/checkout, gdzie nawigacja ma nie rozpraszać, np. `get-a-quote.html`.
  Placeholder: `<div id="ph-nav-simple"></div>`.

Nowa strona dostaje jeden z tych wariantów (nigdy oba naraz, nigdy własny,
ręcznie sklejony header) — wybór zależy od tego, czy strona jest
marketingowa/katalogowa (pełna) czy zadaniowa/flow (uproszczona).

**Pułapka `.sticky-bar` (pointer-events):** `.sticky-bar` (pełna nawigacja)
jest zawsze wyrenderowany i JS-em pozycjonowany dokładnie na wysokości
prawdziwego `.nav-row1` — nawet zanim użytkownik zescrolluje — tak żeby mógł
płynnie "wtopić się" w widoczny sticky pasek po scrollu (`.is-pinned`).
Dopóki nie jest przypięty, jest niewidoczny (`opacity: 0`), ale jego dzieci
(`.sticky-links`, `.sticky-cta`) MUSZĄ mieć `pointer-events: none` w stanie
bazowym i dopiero `.sticky-bar.is-pinned .sticky-links/.sticky-cta` włącza
`pointer-events: auto` — inaczej niewidoczny link w `.sticky-links` (np.
"Packaging") nakłada się na prawdziwe logo w `.nav-row1` i po cichu
przechwytuje w nie kliknięcia (błąd znaleziony 2026-07-27: klik w logo na
`packaging.html` nic nie robił). Każdy nowy element dodany do
`STICKY_BAR_HTML` w `nav-header.js` musi trzymać się tego samego wzorca.
