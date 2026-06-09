# MiriamOS — Documento di Design

**Data:** 2026-06-09
**Stato:** approvato in brainstorming, in attesa di revisione spec

## Cos'è

MiriamOS è un **falso sistema operativo che vive nel browser**: un oggetto-arte giocabile, surreale e sinestetico. Non si comanda con la logica (cartelle ad albero, click, barre di caricamento) ma con la **sensazione, la grafica e il rito vocale scritto**. Tutte le idee nate dalla chat (accensione in francese, test di francese che personalizza il sistema, file system-quadro, antivirus che canta l'opera, suoni al posto delle barre di caricamento) sono lo **stesso scherzo portato avanti con serietà totale**.

Non è un OS vero: è un'esperienza web completa, **client-side, offline, senza account, senza backend**.

## Principi di design

1. **Astratto ma parlante.** La grafica è astratta, ma leggibile: capisci *cosa* contiene una regione (documenti? musica? un misto?) guardando i motivi, senza etichette.
2. **Serietà totale nello scherzo.** Tutto è curato esteticamente come fosse vero. Il bello è che funziona davvero ed è bello davvero.
3. **Deterministico.** Niente vera IA, niente vera voce, niente rete. Tutto è scriptato e riproducibile → affidabile in demo, gira ovunque.
4. **Sinestesia.** Grafica + colore + suono insieme. Ogni elemento visivo ha una controparte sonora.

## Decisioni chiave (dal brainstorming)

| Tema | Decisione |
|------|-----------|
| Piattaforma | App browser, 100% client-side, offline |
| Lingua UI | Italiano (i comandi rituali sono in "franco-maccheronico") |
| Parti "intelligenti" | **Finte ma credibili**: comandi scritti, personalizzazione a regole |
| Audio | **Tutto sintetizzato** con Web Audio API, zero file audio |
| Anima visiva | **Treemap-quadro** stile WinDirStat, palette Bauhaus piatta |
| Tasselli | Ognuno è una **mini-opera astratta** con un motivo grafico |
| Vocabolario motivi | Il *tipo* di contenuto → famiglia di motivo; mix = patchwork (annidamento) |
| Variazione | Ogni file ha un **seme deterministico** → variante unica dentro la sua famiglia |
| Scope v1 | **Arco completo**: accensione → test → personalizzazione → desktop → spegnimento |

## Stack tecnico

- **Vite + TypeScript**, nessun framework UI (DOM vanilla con moduli mirati).
- **Treemap renderizzata in DOM** (div posizionati in assoluto), così la ri-composizione quando i file cambiano è una semplice transizione CSS su `left/top/width/height` → morphing animato "gratis".
- **Web Audio API** per tutto l'audio (sintesi procedurale).
- **localStorage** per la persistenza del file system tra le sessioni.
- Nessun backend, nessuna dipendenza a runtime oltre a ciò che si compila staticamente. Deploy = file statici.

Motivazione: l'app è un toy auto-contenuto. Vite dà dev server, moduli e build statica senza lock-in di framework; il DOM+CSS è la scelta giusta perché il morphing della treemap è l'effetto centrale e con le transizioni CSS viene naturale.

## Architettura a moduli

Ogni modulo ha uno scopo unico e un'interfaccia chiara.

### 1. `session` — macchina a stati
Gestisce le fasi: `OFF → BOOTING → TEST → PERSONALIZING → DESKTOP → SHUTTING_DOWN → OFF`.
- Espone lo stato corrente e gli eventi di transizione.
- È l'unico modulo che decide "in che schermata siamo".
- Input: comandi dal `command parser` ed eventi interni (es. test completato).

### 2. `commands` — parser dei comandi rituali
Una barra di input in stile riga di comando da videogioco. Mappa frasi → azioni.
- `bonjour` / `bonsoir` → accendi (da `OFF`)
- `merci au revoir` → spegni (da `DESKTOP`)
- `volumus maxima` / `volumus minima` → luminosità schermo
- `alò mora [nome]` → "apri" un tassello/app
- frasi non riconosciute → risposta surreale dell'OS
- Il set di comandi è una tabella dati estendibile (frase → handler).

### 3. `fs` — modello del file system
Albero in memoria di nodi `{ id, name, type, size, children? }`.
- `type ∈ { documento, musica, immagine, codice, video, archivio, cartella }`
- Operazioni: `create(node, parentId)`, `delete(id)`, `list(parentId)`.
- Emette eventi su ogni mutazione (per far ri-comporre la treemap e suonare).
- Persistito in `localStorage`; al primo avvio viene seminato con un set iniziale (anche in base al profilo del test).

### 4. `treemap` — layout (funzione pura)
Algoritmo **squarified treemap**: `(nodi, rettangolo) → rettangoli`.
- Funzione pura e testabile in isolamento (input deterministico → output deterministico).
- L'annidamento delle cartelle è ricorsivo: una cartella è un rettangolo che contiene i rettangoli dei figli → il "misto" emerge visivamente.

### 5. `motifs` — vocabolario grafico
Mappa `(file) → stile visivo` del tassello.
- Ogni `type` definisce una **famiglia di motivo** + gamma di palette:
  - documento → righe orizzontali fitte ("testo"), inchiostri freddi
  - musica → onde/cerchi concentrici, gamma calda
  - immagine → campi di colore / gradienti, multicolore
  - codice → matrice di punti, verdi/teal
  - video → bande orizzontali spesse ("fotogrammi"), neutri
  - archivio → strati diagonali compressi, giallo/nero
- **Variazione deterministica**: un seme derivato da `name`+`size` genera i parametri (tonalità nella gamma, densità del motivo, rotazione, posizione del centro) → ogni file è una variante unica ma riconoscibile come la sua famiglia.
- Output: stringhe CSS (background/gradient) applicabili al tassello.

### 6. `renderer` — disegno della treemap-quadro
Prende i rettangoli da `treemap` e gli stili da `motifs` e produce i div.
- Transizioni CSS su posizione/dimensione → quando il `fs` cambia, il quadro si ri-compone animato.
- Hover/selezione: illumina il tassello e chiede all'`audio` di suonare la sua nota.

### 7. `audio` — motore sonoro (Web Audio)
- `playTile(file)`: nota la cui **altezza dipende dalla dimensione** (grosso=grave, piccolo=acuto) e il cui **timbro dipende dal tipo**.
- `playEvent(name)`: `boot`, `create`, `delete`, `error`, `loading-loop`, `opera`, `shutdown`.
- L'**opera dell'antivirus** è un motivo sintetico melodrammatico (sequenza di note + vibrato), non un campione.
- Il **suono di caricamento** rimpiazza la barra di progresso durante `PERSONALIZING`.

### 8. `test` — test di francese + profilo
- 4–5 domande surreali a scelta multipla (in stile, non vere domande di francese serie).
- Le risposte costruiscono un **profilo di gusto** (es. ama-musica, ama-immagini, ordinato/caotico...).

### 9. `personalize` — "l'IA" finta
- Dal profilo del test: sceglie l'**accento colore** del sistema e **semina il file system** con app/file a tema (es. profilo "ama la musica" → installa "MiriamSon" e crea una cartella Musica piena).
- Mostrato durante `PERSONALIZING` con il suono di caricamento assurdo al posto della barra.

### 10. `easter-eggs`
- Antivirus che "becca un virus" → parte l'opera (triggerabile da comando o evento scriptato).
- Risposte surreali a comandi sconosciuti.
- (Spazio per aggiungerne altri in seguito.)

## Flusso dell'esperienza (v1)

1. **SPENTO** — schermo nero. Scrivi `bonjour`/`bonsoir`.
2. **ACCENSIONE** — jingle sintetico, logo Bauhaus che si compone.
3. **TEST DI FRANCESE** — 4–5 domande surreali → profilo di gusto.
4. **PERSONALIZZAZIONE** — "l'IA" installa app a tema e sceglie l'accento colore; suono di caricamento al posto della barra.
5. **DESKTOP — la treemap-quadro**:
   - hover/click su un tassello → suono + illuminazione
   - crea/cancella un file → il quadro si ri-compone animato
   - `volumus maxima` → luminosità · `alò mora [x]` → apri
   - easter egg antivirus → opera sintetica
6. **SPEGNIMENTO** — `merci au revoir` → il quadro si dissolve.

## Persistenza

- Il file system è salvato in `localStorage` e sopravvive tra le sessioni.
- Il test di francese viene rifatto a ogni accensione (è parte del rito), ma non distrugge il file system esistente: la personalizzazione *aggiunge* accenti/app, non resetta.

## Fasi successive (post-v1, non in questo spec)

- Più easter egg e comandi.
- Motivi animati più ricchi / reattivi al suono.
- "App" davvero aperibili (mini-finestre).
- Eventuale modalità con microfono/IA vera (oggi esplicitamente esclusa).

## Strategia di test

- `treemap` (funzione pura): test unitari su layout deterministico, somma aree, annidamento.
- `motifs`: stesso seme → stesso output (determinismo); tipi diversi → famiglie diverse.
- `fs`: create/delete/list e persistenza localStorage (mock).
- `commands`: parsing frasi → azioni corrette, comandi sconosciuti gestiti.
- `session`: transizioni valide/invalide della macchina a stati.
- L'audio e il rendering visivo si verificano manualmente nel browser.

## Questioni aperte (da rifinire in implementazione)

- Testo e tono esatti delle domande del test di francese.
- Set iniziale di file/app per ogni profilo di gusto.
- Mapping preciso dimensione→altezza nota e tipo→timbro.
- Set completo dei comandi rituali oltre a quelli elencati.
