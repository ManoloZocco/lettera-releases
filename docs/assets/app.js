// Lettera — pagina di download.
//
// Senza JavaScript la pagina funziona lo stesso: il pulsante principale porta
// alla scelta del sistema, ogni pulsante di download apre la pagina
// dell'ultima release su GitHub (con il nome del file da prendere) e le
// istruzioni dei tre sistemi sono tutte visibili. Lo script aggiunge:
// - il sistema del visitatore, per il pulsante principale e la scheda giusta;
// - i link diretti ai file dell'ultima release, chiesti all'API di GitHub;
// - le istruzioni giuste per la versione (vedi SIGNED_SINCE);
// - il promemoria che compare quando parte il download;
// - le schede del primo avvio, con i link diretti (#primo-avvio-windows) e
//   le domande che si aprono da sole quando un link porta lì (#cestino).

(function () {
  "use strict";

  var REPO = "ManoloZocco/lettera-releases";
  var API = "https://api.github.com/repos/" + REPO + "/releases/latest";
  // Il numero nella chiave cambia quando cambia la forma dei dati salvati.
  var CACHE_KEY = "lettera-latest-release-v2";
  var CACHE_MS = 10 * 60 * 1000;

  // Prima versione con il bundle macOS firmato per intero (firma ad hoc).
  // Quelle precedenti, scaricate dal browser, macOS le dice «danneggiate» e
  // non offre «Apri comunque»: per loro la pagina mostra la strada con il
  // Terminale. Va aggiornata se la firma esce in un'altra versione.
  var SIGNED_SINCE = "0.2.48";

  // I nomi dei file cambiano a ogni versione (Lettera_0.2.47_aarch64.dmg):
  // si riconoscono dalla fine del nome.
  var ASSETS = {
    mac: /_aarch64\.dmg$/,
    win: /_x64-setup\.exe$/,
    appimage: /_amd64\.AppImage$/,
    deb: /_amd64\.deb$/,
    rpm: /\.x86_64\.rpm$/,
  };
  var ASSET_PLATFORM = { mac: "mac", win: "win", appimage: "linux", deb: "linux", rpm: "linux" };
  var PLATFORM_LABEL = { mac: "Mac", win: "Windows", linux: "Linux" };
  var PLATFORM_REQ = {
    mac: "Mac con chip Apple",
    win: "Windows 10 e 11, 64 bit",
    linux: "Ubuntu 24.04, Debian 13, Fedora 40 o successive",
  };

  var root = document.documentElement;
  root.classList.add("js");

  // arch: "arm", "x86" o "ignota" (Safari e Firefox non la dicono); null finché non si sa.
  var state = { platform: "other", release: null, macFlow: "firmata", intel: false, arch: null };
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Annunci per i lettori di schermo ─────────────────────

  var announcer = document.getElementById("annunci");
  function announce(text) {
    if (!announcer) return;
    // Svuotare prima fa ripetere l'annuncio anche quando il testo è lo stesso.
    announcer.textContent = "";
    setTimeout(function () {
      announcer.textContent = text;
    }, 50);
  }

  // ── Che sistema ha il visitatore ─────────────────────────

  function detectPlatform() {
    var ua = navigator.userAgent || "";
    var uaData = navigator.userAgentData;
    var platform = (uaData && uaData.platform) || navigator.platform || "";
    if (/Android|iPhone|iPod/i.test(ua)) return "mobile";
    // Safari su iPad si presenta come un Mac: lo tradisce il touch.
    if (/iPad/.test(ua) || (/Mac/i.test(platform) && navigator.maxTouchPoints > 1)) return "mobile";
    if (/Mac/i.test(platform)) return "mac";
    if (/Win/i.test(platform)) return "win";
    if (/CrOS/i.test(ua)) return "other";
    if (/Linux|X11/i.test(platform) || /Linux/i.test(ua)) return "linux";
    return "other";
  }

  // Solo Chrome ed Edge dicono l'architettura; Safari e Firefox scrivono
  // «Intel Mac OS X» anche sui Mac con chip Apple, quindi lì non si sa.
  function detectMacArchitecture() {
    var uaData = navigator.userAgentData;
    if (!uaData || typeof uaData.getHighEntropyValues !== "function") {
      return Promise.resolve(null);
    }
    return uaData
      .getHighEntropyValues(["architecture"])
      .then(function (values) {
        return values && values.architecture ? values.architecture : null;
      })
      .catch(function () {
        return null;
      });
  }

  // ── L'ultima release ─────────────────────────────────────

  function isRelease(value) {
    return !!(value && typeof value.tag === "string" && value.assets && typeof value.assets === "object");
  }

  function readCache() {
    try {
      var raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var cached = JSON.parse(raw);
      if (!cached || Date.now() - cached.at > CACHE_MS || !isRelease(cached.release)) {
        sessionStorage.removeItem(CACHE_KEY);
        return null;
      }
      return cached.release;
    } catch (e) {
      return null;
    }
  }

  function writeCache(release) {
    // Una release a cui manca un file (la CI lo sta ancora caricando) non
    // si tiene: alla prossima visita si richiede.
    if (Object.keys(ASSETS).some(function (key) { return !release.assets[key]; })) return;
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), release: release }));
    } catch (e) {
      /* sessionStorage può mancare (navigazione privata): non serve */
    }
  }

  function fetchLatest() {
    var cached = readCache();
    if (cached) return Promise.resolve(cached);
    if (!window.fetch) return Promise.reject(new Error("fetch non disponibile"));

    var controller = window.AbortController ? new AbortController() : null;
    var timer = controller
      ? setTimeout(function () {
          controller.abort();
        }, 8000)
      : null;

    return fetch(API, {
      headers: { Accept: "application/vnd.github+json" },
      signal: controller ? controller.signal : undefined,
    })
      .then(function (response) {
        // 403 e 429: finite le 60 richieste all'ora per indirizzo.
        if (!response.ok) throw new Error("GitHub ha risposto " + response.status);
        return response.json();
      })
      .then(function (data) {
        var release = {
          tag: String(data.tag_name || ""),
          date: data.published_at,
          assets: {},
        };
        (data.assets || []).forEach(function (asset) {
          Object.keys(ASSETS).forEach(function (key) {
            if (!release.assets[key] && ASSETS[key].test(asset.name)) {
              release.assets[key] = {
                name: asset.name,
                size: asset.size,
                url: asset.browser_download_url,
              };
            }
          });
        });
        writeCache(release);
        return release;
      })
      .finally(function () {
        if (timer) clearTimeout(timer);
      });
  }

  // «v0.2.48» → «0.2.48»; un tag senza numero di versione dà "".
  function versionOf(release) {
    var match = /(\d+(?:\.\d+)+)/.exec((release && release.tag) || "");
    return match ? match[1] : "";
  }

  // Confronta due versioni "x.y.z"; una parte mancante vale 0.
  function compareVersions(a, b) {
    var pa = a.split(".").map(function (n) {
      return parseInt(n, 10) || 0;
    });
    var pb = b.split(".").map(function (n) {
      return parseInt(n, 10) || 0;
    });
    for (var i = 0; i < Math.max(pa.length, pb.length); i++) {
      var diff = (pa[i] || 0) - (pb[i] || 0);
      if (diff !== 0) return diff;
    }
    return 0;
  }

  function formatSize(bytes) {
    if (!bytes) return "";
    var mb = bytes / (1024 * 1024);
    return (mb < 10 ? mb.toFixed(1) : Math.round(mb)).toString().replace(".", ",") + " MB";
  }

  function formatDate(iso) {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
    } catch (e) {
      return "";
    }
  }

  function applyRelease(release) {
    state.release = release;
    var version = versionOf(release);

    document.querySelectorAll("[data-asset]").forEach(function (link) {
      var asset = release.assets[link.getAttribute("data-asset")];
      if (asset) link.href = asset.url;
    });

    // Il suggerimento «si apre la pagina di GitHub» sparisce solo dove tutti
    // i link sono diretti.
    document.querySelectorAll("[data-platform-card]").forEach(function (card) {
      var links = card.querySelectorAll("[data-asset]");
      var direct = Array.prototype.every.call(links, function (link) {
        return !!release.assets[link.getAttribute("data-asset")];
      });
      card.classList.toggle("has-direct", links.length > 0 && direct);
    });

    document.querySelectorAll("[data-size]").forEach(function (el) {
      var asset = release.assets[el.getAttribute("data-size")];
      if (asset && asset.size) {
        el.textContent = formatSize(asset.size);
        el.hidden = false;
      }
    });

    // Nei comandi Linux il nome vero del file invece di Lettera_*.
    document.querySelectorAll("[data-filename]").forEach(function (el) {
      var asset = release.assets[el.getAttribute("data-filename")];
      if (asset) el.textContent = asset.name;
    });

    var date = formatDate(release.date);
    document.querySelectorAll("[data-version]").forEach(function (el) {
      el.textContent = version;
    });
    document.querySelectorAll("[data-release-date]").forEach(function (el) {
      el.textContent = date;
    });
    if (version && date) {
      document.querySelectorAll("[data-release-meta]").forEach(function (el) {
        el.hidden = false;
      });
    }

    document.querySelectorAll("[data-versione-ignota]").forEach(function (el) {
      el.hidden = true;
    });
    if (version && compareVersions(version, SIGNED_SINCE) < 0) setMacFlow("vecchia");
    setupHero();
  }

  function setMacFlow(flow) {
    state.macFlow = flow;
    document.querySelectorAll("[data-mac-flow]").forEach(function (el) {
      el.hidden = el.getAttribute("data-mac-flow") !== flow;
    });
    // Arrivati da un link a una domanda dell'altro flusso: si resta sulla scheda.
    var id = idFromHash(location.hash);
    var target = id ? document.getElementById(id) : null;
    if (target && target.closest("[data-mac-flow][hidden]")) {
      var shown = reveal(id);
      if (shown) shown.scrollIntoView();
    }
  }

  // ── Il pulsante principale ───────────────────────────────

  function setupHero() {
    var platform = state.platform;
    var button = document.getElementById("hero-download");
    var label = document.getElementById("hero-download-label");
    var share = document.getElementById("hero-share");
    var meta = document.getElementById("hero-meta");
    if (!button || !label) return;

    var current = platform === "mac" && state.intel ? null : platform;
    document.querySelectorAll("[data-platform-card]").forEach(function (card) {
      card.classList.toggle("is-current", card.getAttribute("data-platform-card") === current);
    });
    document.querySelectorAll("[data-hero-for]").forEach(function (el) {
      el.hidden = el.getAttribute("data-hero-for") !== current;
    });

    if (platform === "mobile") {
      button.hidden = true;
      if (share) share.hidden = false;
      if (meta) meta.hidden = true;
      return;
    }

    if (platform === "mac" && state.intel) {
      label.textContent = "Perché non posso usarla sul mio Mac";
      button.href = "#mac-intel";
      button.classList.add("is-unavailable");
      button.removeAttribute("data-asset");
      if (meta) meta.hidden = true;
      return;
    }

    var key = platform === "mac" ? "mac" : platform === "win" ? "win" : platform === "linux" ? "appimage" : null;
    var asset = key && state.release ? state.release.assets[key] : null;

    if (key) {
      label.textContent =
        platform === "linux" ? "Scarica per Linux (AppImage)" : "Scarica per " + PLATFORM_LABEL[platform];
    } else {
      label.textContent = "Scegli il tuo sistema";
    }

    if (asset) {
      // Con il link diretto il clic scarica il file; senza, porta alla scelta qui sotto.
      button.href = asset.url;
      button.setAttribute("data-asset", key);
      if (meta) {
        var parts = [];
        var version = versionOf(state.release);
        if (version) parts.push(document.createTextNode("Versione " + version));
        var req = document.createTextNode(PLATFORM_REQ[platform]);
        // Dove il browser non dice il processore, il requisito porta a come controllarlo.
        if (platform === "mac" && state.arch === "ignota") {
          var check = document.createElement("a");
          check.href = "#mac-intel";
          check.appendChild(req);
          req = check;
        }
        parts.push(req);
        if (asset.size) parts.push(document.createTextNode(formatSize(asset.size)));
        meta.textContent = "";
        parts.forEach(function (part, i) {
          if (i) meta.appendChild(document.createTextNode(" · "));
          meta.appendChild(part);
        });
        meta.hidden = false;
      }
    } else {
      button.href = "#scarica";
      button.removeAttribute("data-asset");
      if (meta) meta.hidden = true;
    }
  }

  function warnIfIntelMac() {
    detectMacArchitecture().then(function (arch) {
      state.arch = arch || "ignota";
      if (arch === "x86") {
        state.intel = true;
        var warning = document.getElementById("intel-warning");
        if (warning) warning.hidden = false;
      }
      setupHero();
    });
  }

  function setupShare() {
    var share = document.getElementById("hero-share");
    var fallback = document.getElementById("share-fallback");
    var urlBox = document.getElementById("share-url");
    if (!share) return;
    var url = location.href.split("#")[0];

    function showUrl() {
      if (!fallback || !urlBox) return;
      urlBox.textContent = url;
      fallback.hidden = false;
    }

    function copy() {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(function () {
          announce("Link copiato: incollalo dove vuoi e aprilo dal computer.");
          showUrl();
        }, showUrl);
      } else {
        showUrl();
      }
    }

    share.addEventListener("click", function () {
      if (navigator.share) {
        navigator
          .share({ title: "Lettera", text: "Lettera, un editor per chi scrive", url: url })
          .catch(function (error) {
            // Annullato da chi usa il telefono: va bene così. Gli altri errori ripiegano sulla copia.
            if (!error || error.name !== "AbortError") copy();
          });
        return;
      }
      copy();
    });
  }

  // ── Promemoria dopo il download ──────────────────────────

  function setupAfterDownload() {
    document.addEventListener("click", function (event) {
      var link = event.target.closest ? event.target.closest("a[data-asset]") : null;
      if (!link || !state.release) return;
      var key = link.getAttribute("data-asset");
      if (!state.release.assets[key]) return;
      // Dal telefono il file si scarica lo stesso, ma i passaggi servono al computer.
      var platform = state.platform === "mobile" ? "mobile" : ASSET_PLATFORM[key];
      var template = document.getElementById("after-" + platform);
      var scope = link.closest("[data-after-download-scope]");
      var slot = scope ? scope.querySelector("[data-after-download]") : null;
      if (!template || !slot) return;

      // Niente preventDefault: il download parte come sempre.
      document.querySelectorAll("[data-after-download]").forEach(function (el) {
        if (el !== slot) {
          el.hidden = true;
          el.textContent = "";
        }
      });
      slot.textContent = "";
      slot.appendChild(template.content.cloneNode(true));
      slot.querySelectorAll("[data-mac-flow]").forEach(function (el) {
        el.hidden = el.getAttribute("data-mac-flow") !== state.macFlow;
      });
      slot.hidden = false;
      slot.scrollIntoView({ block: "nearest", behavior: reducedMotion ? "auto" : "smooth" });
      announce(
        platform === "mobile"
          ? "Questo file serve al computer: apri la pagina dal Mac o dal PC."
          : "Download avviato. Sotto il pulsante ci sono i passaggi per aprire Lettera."
      );
    });
  }

  // ── Schede del primo avvio e link interni ────────────────

  var tabs = [];
  var panels = [];

  function selectTab(index, options) {
    options = options || {};
    tabs.forEach(function (tab, i) {
      var selected = i === index;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.tabIndex = selected ? 0 : -1;
      if (panels[i]) panels[i].hidden = !selected;
    });
    if (options.focus) tabs[index].focus();
    if (options.updateHash && history.replaceState) {
      history.replaceState(null, "", "#" + panels[index].id);
    }
  }

  function tabIndexFor(platform) {
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].getAttribute("data-platform") === platform) return i;
    }
    return -1;
  }

  function idFromHash(hash) {
    try {
      return decodeURIComponent((hash || "").replace(/^#/, ""));
    } catch (e) {
      return "";
    }
  }

  // Rende visibile l'elemento con quell'id: apre la sua scheda e, se è una
  // domanda (o sta dentro una domanda), la apre. Restituisce l'elemento da
  // raggiungere: la scheda intera, se il bersaglio appartiene all'altro
  // flusso macOS e resta nascosto.
  function reveal(id) {
    var target = id ? document.getElementById(id) : null;
    if (!target) return null;
    var panel = target.closest('[role="tabpanel"]');
    var index = panel ? panels.indexOf(panel) : -1;
    if (index >= 0) selectTab(index);
    if (target.closest("[data-mac-flow][hidden]")) return panel;
    var details = target.closest("details");
    if (details) details.open = true;
    return target;
  }

  function setupTabs(initial) {
    var tablist = document.querySelector('[role="tablist"]');
    if (!tablist) return;
    tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    panels = tabs.map(function (tab) {
      var panel = document.getElementById(tab.getAttribute("aria-controls"));
      // Senza script i pannelli sono sezioni normali: i ruoli servono solo con le schede.
      if (panel) {
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-labelledby", tab.id);
        panel.tabIndex = 0;
      }
      return panel;
    });

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        selectTab(i, { updateHash: true });
      });
      tab.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowRight") next = (i + 1) % tabs.length;
        else if (event.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = tabs.length - 1;
        if (next !== null) {
          event.preventDefault();
          selectTab(next, { focus: true, updateHash: true });
        }
      });
    });

    var start = tabIndexFor(initial);
    selectTab(start >= 0 ? start : 0);

    // Arrivando da un link diretto il bersaglio era nascosto quando il
    // browser ha cercato l'ancora: si mostra e si raggiunge subito.
    var fromHash = reveal(idFromHash(location.hash));
    if (fromHash) {
      // Un salto, non lo scorrimento animato della pagina: al caricamento il
      // layout si assesta mentre l'animazione è in corso e il bersaglio scappa.
      var html = document.documentElement;
      html.style.scrollBehavior = "auto";
      fromHash.scrollIntoView();
      html.style.scrollBehavior = "";
    }

    // Ogni link interno apre la scheda o la domanda giusta prima che il
    // browser scorra fin lì.
    document.addEventListener("click", function (event) {
      var link = event.target.closest ? event.target.closest('a[href^="#"]') : null;
      if (!link) return;
      var id = idFromHash(link.getAttribute("href"));
      var shown = reveal(id);
      if (shown && shown.id !== id) {
        event.preventDefault();
        shown.scrollIntoView();
      }
    });

    window.addEventListener("hashchange", function () {
      var id = idFromHash(location.hash);
      var shown = reveal(id);
      if (shown && shown.id !== id) shown.scrollIntoView();
    });
  }

  // ── Copia dei comandi ────────────────────────────────────

  function setupCopyButtons() {
    if (!navigator.clipboard || !window.isSecureContext) return;
    document.querySelectorAll(".code").forEach(function (block) {
      var button = block.querySelector(".copy");
      var pre = block.querySelector("pre");
      if (!button || !pre) return;
      button.hidden = false;
      var timer = null;
      button.addEventListener("click", function () {
        navigator.clipboard.writeText(pre.textContent.trim()).then(
          function () {
            button.textContent = "Copiato";
            announce("Comando copiato.");
          },
          function () {
            button.textContent = "Selezionalo e copia";
          }
        );
        clearTimeout(timer);
        timer = setTimeout(function () {
          button.textContent = "Copia";
        }, 2500);
      });
    });
  }

  // ── Avvio ────────────────────────────────────────────────

  state.platform = detectPlatform();
  setupHero();
  setupShare();
  setupAfterDownload();
  if (state.platform === "mac") warnIfIntelMac();
  setupTabs(state.platform === "win" || state.platform === "linux" ? state.platform : "mac");
  setupCopyButtons();

  fetchLatest()
    .then(applyRelease)
    .catch(function () {
      // Restano i link alla pagina della release, con il nome del file da prendere.
    });
})();
