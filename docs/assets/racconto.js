/* Lettera — il racconto.
   La finestra accanto ai capitoli è la versione di prova di Lettera (prova/):
   quando un capitolo arriva a metà schermo la pagina le chiede la sua scena,
   e lei la recita con un cursore finto. Al primo clic o tasto dentro la
   finestra la scena si ferma e Lettera è del visitatore; dove la finestra non
   prende il mouse, come sul telefono, la si apre a tutto schermo con «Prova
   tu». I suoni restano spenti finché non li accende l'interruttore sotto la
   finestra. */
(function () {
  "use strict";

  var finestra = document.querySelector(".finestra");
  if (!finestra || !("IntersectionObserver" in window) || !window.postMessage) return;

  var cornice = finestra.querySelector(".finestra-cornice");
  var comandi = finestra.querySelector(".finestra-comandi");
  var stato = document.getElementById("stato-finestra");
  var suono = document.getElementById("suono");
  var rivedi = document.getElementById("rivedi");
  var provaTu = document.getElementById("prova-tu");
  var torna = document.getElementById("torna");
  var capitoli = Array.prototype.slice.call(document.querySelectorAll(".capitolo[data-scena]"));

  // La finestra è disegnata alla misura di una finestra vera e rimpicciolita
  // nella cornice: Lettera la vede come sul computer. Sul telefono anche la
  // finestra è stretta, e Lettera si dispone da sola: rimpicciolita meno, si
  // legge. La soglia è la stessa del CSS e dell'immagine che la precede.
  var LARGA = { larghezza: 920, altezza: 660 };
  var STRETTA = { larghezza: 480, altezza: 520 };
  var stretta = window.matchMedia("(max-width: 631px)");
  // Quando sta sopra i capitoli, come sul telefono, la finestra lascia loro
  // almeno quattro decimi dello schermo.
  var accanto = window.matchMedia("(min-width: 900px)");

  var pronta = false;
  var recitata = null;
  var voluta = capitoli.length ? capitoli[0].dataset.scena : null;
  var suonoAcceso = false;
  var intera = false;
  var ritorno = 0;

  var iframe = document.createElement("iframe");
  iframe.src = "prova/";
  iframe.title = "Lettera, la versione di prova: guardala lavorare o fai clic e prova tu";
  iframe.setAttribute("allow", "autoplay");
  cornice.appendChild(iframe);

  function adatta() {
    var larghezza = cornice.clientWidth;
    var misura = stretta.matches ? STRETTA : LARGA;
    // Mai ingrandita: in una cornice più larga la finestra si allarga.
    var virtuale = Math.max(misura.larghezza, larghezza);
    var scala = larghezza / virtuale;
    var altezza;
    if (intera) {
      altezza = Math.round(cornice.clientHeight / scala);
    } else {
      altezza = accanto.matches ? misura.altezza : Math.min(misura.altezza, Math.floor((0.6 * window.innerHeight) / scala));
      cornice.style.height = Math.round(altezza * scala) + "px";
    }
    iframe.width = String(virtuale);
    iframe.height = String(altezza);
    cornice.style.setProperty("--scala", String(scala));
  }
  adatta();
  if ("ResizeObserver" in window) new ResizeObserver(adatta).observe(cornice);
  else window.addEventListener("resize", adatta);

  function manda(messaggio) {
    if (iframe.contentWindow) iframe.contentWindow.postMessage(messaggio, window.location.origin);
  }

  function recita(nome) {
    voluta = nome;
    document.body.classList.toggle("pagina-in-focus", nome === "focus");
    capitoli.forEach(function (capitolo) {
      capitolo.classList.toggle("attivo", capitolo.dataset.scena === nome);
    });
    if (!pronta || recitata === nome) return;
    recitata = nome;
    stato.textContent = "";
    manda({ lettera: "scena", nome: nome });
  }

  window.addEventListener("message", function (event) {
    if (event.origin !== window.location.origin || event.source !== iframe.contentWindow) return;
    var messaggio = event.data || {};
    if (messaggio.lettera === "pronta") {
      pronta = true;
      cornice.classList.add("viva");
      comandi.hidden = false;
      manda({ lettera: "suono", acceso: suonoAcceso });
      if (voluta) recita(voluta);
    } else if (messaggio.lettera === "controllo") {
      stato.textContent = "Tocca a te: la finestra è tua. Scorri per la scena dopo.";
    }
  });

  // Il capitolo che occupa la fascia a metà schermo è quello che la finestra
  // recita. Con la finestra a tutto schermo la pagina dietro non conta.
  var osservatore = new IntersectionObserver(
    function (voci) {
      if (intera) return;
      voci.forEach(function (voce) {
        if (voce.isIntersecting) recita(voce.target.dataset.scena);
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  capitoli.forEach(function (capitolo) {
    osservatore.observe(capitolo);
  });

  // Fuori dal racconto la finestra si ferma: niente recita dove nessuno guarda,
  // e niente che riporti su la pagina. Tornando, la scena riparte.
  var racconto = document.querySelector(".racconto");
  if (racconto) {
    new IntersectionObserver(function (voci) {
      if (intera) return;
      if (voci[voci.length - 1].isIntersecting) {
        if (voluta) recita(voluta);
      } else {
        recitata = null;
        manda({ lettera: "ferma" });
      }
    }).observe(racconto);
  }

  suono.addEventListener("click", function () {
    suonoAcceso = !suonoAcceso;
    suono.setAttribute("aria-pressed", String(suonoAcceso));
    suono.querySelector("span").textContent = suonoAcceso ? "Suono acceso" : "Suono";
    document.body.classList.toggle("suono-acceso", suonoAcceso);
    // Dentro il clic, perché Safari faccia partire l'audio della finestra.
    var diretto = null;
    try {
      diretto = iframe.contentWindow && iframe.contentWindow.letteraSuono;
    } catch (e) {}
    if (typeof diretto === "function") diretto(suonoAcceso);
    else manda({ lettera: "suono", acceso: suonoAcceso });
  });

  rivedi.addEventListener("click", function () {
    recitata = null;
    if (voluta) recita(voluta);
  });

  // «Prova tu»: la finestra copre lo schermo, il dito la comanda e la
  // tastiera del telefono ci scrive. Il resto della pagina intanto non si
  // raggiunge, e «Torna al racconto» la rimette dov'era.
  function fuori(chiuso) {
    for (var dentro = finestra; dentro !== document.body; dentro = dentro.parentElement) {
      Array.prototype.forEach.call(dentro.parentElement.children, function (vicino) {
        if (vicino !== dentro) vicino.inert = chiuso;
      });
    }
  }

  // Con la tastiera del telefono aperta lo schermo visibile si accorcia: la
  // finestra finisce sopra la tastiera, e Lettera tiene in vista il cursore.
  var vista = window.visualViewport;
  function segui() {
    finestra.style.height = vista.height + "px";
    finestra.style.transform = "translateY(" + vista.offsetTop + "px)";
  }

  // La nuova misura la prende adatta(), chiamata dal ResizeObserver.
  function apri() {
    if (intera) return;
    intera = true;
    ritorno = window.scrollY;
    cornice.style.height = "";
    document.documentElement.classList.add("finestra-intera");
    finestra.setAttribute("role", "dialog");
    finestra.setAttribute("aria-modal", "true");
    fuori(true);
    if (vista) {
      vista.addEventListener("resize", segui);
      vista.addEventListener("scroll", segui);
      segui();
    }
    torna.focus();
  }

  function chiudi() {
    if (!intera) return;
    intera = false;
    document.documentElement.classList.remove("finestra-intera");
    finestra.removeAttribute("role");
    finestra.removeAttribute("aria-modal");
    if (vista) {
      vista.removeEventListener("resize", segui);
      vista.removeEventListener("scroll", segui);
    }
    finestra.style.height = "";
    finestra.style.transform = "";
    fuori(false);
    // Subito, non al prossimo giro del ResizeObserver: la pagina deve tornare
    // della sua altezza prima di scorrere dov'era.
    adatta();
    window.scrollTo({ top: ritorno, behavior: "instant" });
    provaTu.focus();
  }

  provaTu.addEventListener("click", apri);
  torna.addEventListener("click", chiudi);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") chiudi();
  });
  // Dove la finestra non prende il dito, toccarla vuol dire volerla provare:
  // «Prova tu» si vede solo lì, e solo quando la prova è pronta.
  cornice.addEventListener("click", function () {
    if (provaTu.offsetParent !== null) apri();
  });

  // Le scorciatoie sono scritte per il Mac: altrove i tasti hanno altri nomi.
  // Il sistema lo riconosce app.js, caricato prima.
  var sistema = document.documentElement.dataset.sistema;
  if (sistema !== "mac" && sistema !== "mobile") {
    var nomi = { "⌘": "Ctrl", "⌥": "Alt", "⇧": "Maiusc", "↩": "Invio", "⌫": "Backspace" };
    document.querySelectorAll(".racconto kbd, .catalogo kbd").forEach(function (tasto) {
      if (nomi[tasto.textContent]) tasto.textContent = nomi[tasto.textContent];
    });
  }
})();
