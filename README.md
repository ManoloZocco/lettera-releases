# Lettera — Releases & Installers

Qui ci sono le release pubbliche di **Lettera**, un editor di testo per chi scrive, per macOS (chip Apple e Intel), Windows e Linux.

**Per scaricarla: [manolozocco.github.io/lettera-releases](https://manolozocco.github.io/lettera-releases/).** La pagina sceglie il file giusto per il tuo sistema e spiega come aprire Lettera la prima volta.

## Dal Terminale

Lo script scarica dall'ultima release il `.dmg` adatto al tuo Mac (chip Apple o Intel), copia Lettera nella cartella Applicazioni, le toglie l'etichetta di quarantena e la apre. Usa solo gli strumenti che macOS ha già e non cambia le impostazioni di sicurezza del Mac.

```bash
curl -fsSL https://github.com/ManoloZocco/lettera-releases/releases/latest/download/install-macos-aarch64.sh | bash
```

Per installare una versione precisa, per esempio una pre-release:

```bash
curl -fsSL -o install.sh https://github.com/ManoloZocco/lettera-releases/releases/latest/download/install-macos-aarch64.sh
bash install.sh --tag v0.1.1-test6
rm install.sh
```

Con un account amministratore, il tipo predefinito su un Mac personale, lo script non chiede la password: la chiede solo per sostituire una copia di Lettera installata come amministratore dalle versioni precedenti dello script. Con un account standard installa Lettera nella cartella Applicazioni dell'utente (`~/Applications`).
