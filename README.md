# Lettera — Releases & Installers

Questo repository ospita le release pubbliche e gli script di installazione per **Lettera**, un editor markdown premium per macOS (Apple Silicon).

## Installazione Rapida (macOS Arm64)

Puoi installare rapidamente l'applicazione eseguendo il seguente comando nel Terminale. Lo script si occuperà di scaricare il file DMG dall'ultima release pubblica, installarlo in `/Applications` e rimuovere l'attributo di quarantena di macOS per consentire l'esecuzione immediata dell'applicazione.

```bash
curl -fsSL https://github.com/ManoloZocco/lettera-releases/releases/latest/download/install-macos-aarch64.sh | bash
```

### Installare una Versione Specifica (es. Pre-release)

Se desideri installare una versione specifica (es. la pre-release `v0.1.1-test6`), puoi scaricare ed eseguire lo script passando il tag desiderato come argomento:

```bash
# Scarica lo script di installazione
curl -fsSL -o install.sh https://github.com/ManoloZocco/lettera-releases/releases/latest/download/install-macos-aarch64.sh

# Esegui per installare la versione specifica (sostituisci il tag con quello desiderato)
bash install.sh --tag v0.1.1-test6

# Pulisci il file temporaneo
rm install.sh
```

---

*Nota: Lo script richiede i privilegi di amministratore (`sudo`) per copiare l'app nella cartella `/Applications` e rimuovere i flag di quarantena di Gatekeeper (Gatekeeper blocca l'applicazione poiché si tratta di build beta non ancora notificate da Apple).*
