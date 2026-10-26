/* Lettera — il racconto.
   La finestra accanto ai capitoli è la versione di prova di Lettera (prova/):
   quando un capitolo arriva a metà schermo la pagina le chiede la sua scena,
   e lei la recita con un cursore finto. Al primo clic o tasto dentro la
   finestra la scena si ferma e Lettera è del visitatore. I suoni restano
   spenti finché non li accende l'interruttore sotto la finestra. */
(function () {
  "use strict";

  var finestra = document.querySelector(".finestra");
  if (!finestra || !("IntersectionObserver" in window) || !window.postMessage) return;

  var cornice = finestra.querySelector(".finestra-cornice");
  var comandi = finestra.querySelector(".finestra-comandi");
  var stato = document.getElementById("stato-finestra");
  var suono = document.getElementById("suono");
  var rivedi = document.getElementById("rivedi");
  var capitoli = Array.prototype.slice.call(document.querySelectorAll(".capitolo[data-scena]"));

  // La finestra è disegnata alla misura di una finestra vera e rimpicciolita
  // nella cornice: Lettera la vede sempre come sul computer.
  var LARGHEZZA = 920;
  var ALTEZZA = 660;

  var pronta = false;
  var recitata = null;
  var voluta = capitoli.length ? capitoli[0].dataset.scena : null;
  var suonoAcceso = false;

  var iframe = document.createElement("iframe");
  iframe.src = "prova/";
  iframe.title = "Lettera, la versione di prova: guardala lavorare o fai clic e prova tu";
  iframe.setAttribute("allow", "autoplay");
  iframe.width = String(LARGHEZZA);
  iframe.height = String(ALTEZZA);
  cornice.appendChild(iframe);

  function adatta() {
    var scala = cornice.clientWidth / LARGHEZZA;
    cornice.style.setProperty("--scala", String(scala));
    cornice.style.height = Math.round(ALTEZZA * scala) + "px";
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

  // Il capitolo che occupa la fascia a metà schermo è quello che la finestra recita.
  var osservatore = new IntersectionObserver(
    function (voci) {
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
