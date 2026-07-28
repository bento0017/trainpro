/* ==========================================================================
   TrainPro — site público
   Três coisas: o leitor de entrada, o seletor de ciclo, e as revelações.
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ------------------------------------------------- leitor de entrada -- */
  /* O elemento assinatura. Cicla chegadas reais de uma manhã de ginásio:
     quem está em dia passa, quem não está fica à porta. É a promessa do
     produto demonstrada em vez de afirmada. */

  var arrivals = [
    {
      name: "Marta Sousa",
      plan: "Mensalidade 6 meses · válida até 12 dez",
      state: "granted",
      word: "Acesso permitido",
      reason: "Pagamento em dia. Torniquete aberto.",
      time: "07:42"
    },
    {
      name: "Bruno Reis",
      plan: "Mensalidade mensal · venceu há 4 dias",
      state: "denied",
      word: "Acesso negado",
      reason: "Mensalidade por regularizar. Avisado na app dele.",
      time: "07:51"
    },
    {
      name: "Carla Pinto",
      plan: "Mensalidade anual · válida até 3 mar",
      state: "granted",
      word: "Acesso permitido",
      reason: "Pagamento em dia. Torniquete aberto.",
      time: "08:03"
    },
    {
      name: "Visitante",
      plan: "Day pass · pago na app às 08:06",
      state: "granted",
      word: "Acesso permitido",
      reason: "Caução de 50 € reservada, devolvida à saída.",
      time: "08:07"
    },
    {
      name: "Tiago Mendes",
      plan: "Senha avulsa · já utilizada hoje",
      state: "denied",
      word: "Acesso negado",
      reason: "Senha gasta às 06:58. Pode comprar outra na app.",
      time: "08:15"
    }
  ];

  var reader = document.getElementById("reader");

  if (reader) {
    var elName = document.getElementById("readerName");
    var elPlan = document.getElementById("readerPlan");
    var elWord = document.getElementById("readerWord");
    var elReason = document.getElementById("readerReason");
    var elClock = document.getElementById("readerClock");
    var elCount = document.getElementById("readerCount");

    var index = 0;
    var entries = 38;
    var timer = null;

    function paint(arrival) {
      reader.setAttribute("data-state", arrival.state);
      elName.textContent = arrival.name;
      elPlan.textContent = arrival.plan;
      elWord.textContent = arrival.word;
      elReason.textContent = arrival.reason;
      elClock.textContent = arrival.time;

      if (arrival.state === "granted") {
        entries += 1;
        elCount.textContent = "Hoje: " + entries + " entradas";
      }
    }

    function advance() {
      index = (index + 1) % arrivals.length;
      // Fade de saída, troca, fade de entrada — o ecrã não pisca conteúdo novo.
      reader.classList.add("is-swapping");
      window.setTimeout(function () {
        paint(arrivals[index]);
        reader.classList.remove("is-swapping");
      }, 320);
    }

    function start() {
      if (timer || reduceMotion.matches) return;
      reader.classList.add("is-running");
      timer = window.setInterval(advance, 4400);
    }

    function stop() {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
      reader.classList.remove("is-running");
    }

    paint(arrivals[0]);

    if (reduceMotion.matches) {
      // Sem movimento: mostra o caso que interessa — o que fica à porta.
      paint(arrivals[1]);
    } else {
      // Só corre quando está à vista; um leitor a piscar fora do ecrã é
      // bateria gasta a fingir que trabalha.
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (items) {
          items.forEach(function (item) {
            if (item.isIntersecting) start();
            else stop();
          });
        }, { threshold: 0.25 }).observe(reader);
      } else {
        start();
      }

      document.addEventListener("visibilitychange", function () {
        if (document.hidden) stop();
        else start();
      });
    }
  }

  /* --------------------------------------------------- seletor de ciclo -- */

  var monthlyBtn = document.getElementById("cycleMonthly");
  var annualBtn = document.getElementById("cycleAnnual");

  if (monthlyBtn && annualBtn) {
    function setCycle(cycle) {
      var isAnnual = cycle === "annual";

      monthlyBtn.setAttribute("aria-pressed", String(!isAnnual));
      annualBtn.setAttribute("aria-pressed", String(isAnnual));

      document.querySelectorAll(".plan__price").forEach(function (el) {
        el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
      });

      document.querySelectorAll("[data-cycle]").forEach(function (el) {
        el.textContent = isAnnual ? "por ano" : "por mês";
      });

      document.querySelectorAll("[data-save]").forEach(function (el) {
        el.textContent = isAnnual ? el.dataset.annualSave : "";
      });
    }

    monthlyBtn.addEventListener("click", function () { setCycle("monthly"); });
    annualBtn.addEventListener("click", function () { setCycle("annual"); });
  }

  /* ------------------------------------------------------- revelações --- */

  var revealables = document.querySelectorAll(".reveal");

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var observer = new IntersectionObserver(function (items) {
      items.forEach(function (item) {
        if (!item.isIntersecting) return;
        item.target.classList.add("is-in");
        observer.unobserve(item.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealables.forEach(function (el) { observer.observe(el); });
  }
})();
