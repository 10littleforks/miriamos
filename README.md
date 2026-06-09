# MiriamOS

Un falso OS sinestetico nel browser. 100% client-side, offline.

## Sviluppo
- `npm install`
- `npm run dev` — avvia l'app
- `npm test` — esegue i test (Vitest)
- `npm run build` — build di produzione

## Comandi rituali
- `bonjour` / `bonsoir` — accendi
- `merci au revoir` — spegni
- `volumus maxima` / `volumus minima` — luminosità
- `alò mora [nome]` — "apri" (crea un tassello); `alò mora virus` → easter egg

## Idea
Il file system è una treemap-quadro: ogni tassello è un file, la grandezza è la dimensione,
il motivo grafico è il tipo (documenti=righe, musica=onde, immagini=campi di colore…),
e ogni file ha una variante unica. Creare/cancellare file ri-compone il quadro.
