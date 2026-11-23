(() => {
  const htmlEl = document.documentElement;
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Scroll progress + reveal observer
  const progressBar = document.querySelector(".scroll-progress");
  const updateProgress = () => {
    if (!progressBar) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
    progressBar.style.width = `${pct}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  // 2. Pointer Spotlight Hover Glow (desktop/mouse devices)
  if (!reducedMotion && window.matchMedia && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        card.style.setProperty("--my", `${e.clientY - rect.top}px`);
      }, { passive: true });
    });
  }

  // 3. Theme Toggle (Light / Dark)
  const themeBtn = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("intercomle_theme");
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  const applyTheme = (theme) => {
    htmlEl.setAttribute("data-theme", theme);
    localStorage.setItem("intercomle_theme", theme);
    if (themeBtn) {
      themeBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      themeBtn.innerHTML = theme === "dark"
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
  };
  applyTheme(savedTheme || (prefersLight ? "light" : "dark"));
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = htmlEl.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(current);
    });
  }

  // 4. Language Engine (EN default fallback, PT, ES)
  const dict = window.INTERCOM_I18N || {};
  const urlLang = new URLSearchParams(window.location.search).get("lang");
  const savedLang = localStorage.getItem("intercomle_lang");
  const navLang = (navigator.language || "en").toLowerCase();
  const detectedLang = navLang.startsWith("pt") ? "pt" : navLang.startsWith("es") ? "es" : "en";
  let currentLang = ["en", "pt", "es"].includes(urlLang) ? urlLang : ["en", "pt", "es"].includes(savedLang) ? savedLang : detectedLang;

  const langBtns = document.querySelectorAll(".lang-btn");
  const applyLanguage = (lang) => {
    const t = dict[lang] || dict.en || {};
    currentLang = lang;
    htmlEl.lang = lang === "pt" ? "pt-BR" : lang;
    localStorage.setItem("intercomle_lang", lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (t[key]) {
        el.textContent = t[key];
      }
    });

    langBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });
  };

  langBtns.forEach((btn) => {
    btn.addEventListener("click", () => applyLanguage(btn.getAttribute("data-lang")));
  });
  applyLanguage(currentLang);

  // 5. Mobile Nav Drawer
  const menuBtn = document.getElementById("mobileMenuBtn");
  const drawer = document.getElementById("mobileDrawer");
  if (menuBtn && drawer) {
    menuBtn.addEventListener("click", () => {
      const open = drawer.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    drawer.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        drawer.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 6. Accessible FAQ Accordion
  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-q");
    if (!btn) return;
    btn.setAttribute("aria-expanded", String(item.classList.contains("open")));
    btn.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((o) => {
        o.classList.remove("open");
        const q = o.querySelector(".faq-q");
        if (q) q.setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  // 7. Compatibility Brand Filter
  const filterPills = document.querySelectorAll(".filter-pill");
  const compatCards = document.querySelectorAll(".compat-card");
  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const filter = pill.getAttribute("data-filter");
      filterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      compatCards.forEach((card) => {
        const brand = card.getAttribute("data-brand");
        const show = filter === "all" || filter === brand;
        card.classList.toggle("hidden", !show);
      });
    });
  });

  // 8. Interactive Dual-Earbud Cockpit Simulator + Live Dual-Channel Oscilloscope
  const simBudL = document.getElementById("simBudL");
  const simBudR = document.getElementById("simBudR");
  const fillL = document.getElementById("simFillL");
  const fillR = document.getElementById("simFillR");
  const sepText = document.getElementById("simSepValue");
  const arcL = document.getElementById("simArcL");
  const arcR = document.getElementById("simArcR");
  const presetBtns = document.querySelectorAll("[data-preset]");
  const matrixBtns = document.querySelectorAll("[data-matrix]");
  const palDots = document.querySelectorAll("[data-pal]");
  const telemetryPresetEl = document.getElementById("simTelemetryPreset");
  const matrixReadout = document.getElementById("simMatrixReadout");
  const waveCanvas = document.getElementById("simWaveCanvas");

  const savedPalette = localStorage.getItem("intercomle_palette") || "emerald";
  const applyPalette = (pal) => {
    htmlEl.setAttribute("data-palette", pal);
    localStorage.setItem("intercomle_palette", pal);
    palDots.forEach((d) => d.classList.toggle("active", d.getAttribute("data-pal") === pal));
  };
  applyPalette(savedPalette);

  palDots.forEach((dot) => {
    dot.addEventListener("click", () => applyPalette(dot.getAttribute("data-pal")));
  });

  let activeMatrix = "cross";
  let activeSide = "L";
  let waveAmpL = 0.85;
  let waveAmpR = 0.12;

  const updateArcVisuals = () => {
    if (!arcL || !arcR) return;
    if (activeMatrix === "silent") {
      arcL.style.opacity = "0.14";
      arcR.style.opacity = "0.14";
      arcL.style.strokeDasharray = "4 6";
      arcR.style.strokeDasharray = "4 6";
      return;
    }
    arcL.style.strokeDasharray = "";
    arcR.style.strokeDasharray = "";
    arcL.style.opacity = activeSide === "L" ? "1" : "0.28";
    arcL.style.strokeWidth = activeSide === "L" ? "3.2" : "1.6";
    arcR.style.opacity = activeSide === "R" ? "1" : "0.28";
    arcR.style.strokeWidth = activeSide === "R" ? "3.2" : "1.6";
  };

  matrixBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      matrixBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeMatrix = btn.getAttribute("data-matrix") || "cross";
      if (matrixReadout) {
        matrixReadout.textContent =
          activeMatrix === "direct" ? "DIRECT L→L / R→R"
          : activeMatrix === "silent" ? "SILENT DIAG"
          : "CROSS L⇄R";
      }
      updateArcVisuals();
    });
  });

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      presetBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const preset = btn.getAttribute("data-preset");
      if (telemetryPresetEl) {
        telemetryPresetEl.textContent =
          preset === "moto" ? "HPF 200 Hz • Gate -34 dBFS"
          : preset === "ptt" ? "HPF 150 Hz • PTT Tactical"
          : "HPF 100 Hz • Gate -48 dBFS";
      }
    });
  });

  if (simBudL && simBudR && fillL && fillR && sepText) {
    let speakTimer = null;
    let demoSide = "L";

    const triggerSpeak = (side, isUserTap) => {
      if (isUserTap && speakTimer) {
        clearInterval(speakTimer);
        speakTimer = null;
      }
      activeSide = side;
      simBudL.classList.toggle("speaking-l", side === "L");
      simBudR.classList.toggle("speaking-r", side === "R");

      fillL.style.width = side === "L" ? "88%" : "14%";
      fillR.style.width = side === "R" ? "90%" : "12%";
      waveAmpL = side === "L" ? 0.92 : 0.14;
      waveAmpR = side === "R" ? 0.92 : 0.12;
      sepText.textContent = side === "L" ? "96%" : "94%";
      updateArcVisuals();

      if (isUserTap) {
        setTimeout(() => {
          activeSide = "idle";
          waveAmpL = 0.15;
          waveAmpR = 0.15;
          fillL.style.width = "16%";
          fillR.style.width = "16%";
          simBudL.classList.remove("speaking-l");
          simBudR.classList.remove("speaking-r");
        }, 1250);
      }
    };

    simBudL.addEventListener("click", () => triggerSpeak("L", true));
    simBudR.addEventListener("click", () => triggerSpeak("R", true));

    triggerSpeak("L", false);
    if (!reducedMotion) {
      speakTimer = setInterval(() => {
        demoSide = demoSide === "L" ? "R" : "L";
        triggerSpeak(demoSide, false);
      }, 2200);
    }
  }

  // Dual-Channel Live Oscilloscope Renderer
  if (waveCanvas && waveCanvas.getContext) {
    const ctx = waveCanvas.getContext("2d");
    let phase = 0;
    let curL = 0.2;
    let curR = 0.2;

    const drawWaves = () => {
      const w = waveCanvas.width;
      const h = waveCanvas.height;
      const mid = h / 2;
      const styles = getComputedStyle(htmlEl);
      const colL = styles.getPropertyValue("--left-accent").trim() || "#00e5a3";
      const colR = styles.getPropertyValue("--right-accent").trim() || "#38bdf8";

      curL += (waveAmpL - curL) * 0.14;
      curR += (waveAmpR - curR) * 0.14;
      phase += 0.16;

      ctx.clearRect(0, 0, w, h);

      // Center zero-crossing hairline
      ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, mid);
      ctx.lineTo(w, mid);
      ctx.stroke();

      const drawChannel = (amp, color, freqMult, phaseOffset) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 3) {
          const env = Math.sin((x / w) * Math.PI); // clean window taper at ends
          const wave =
            Math.sin(x * 0.055 * freqMult + phase + phaseOffset) * 0.65 +
            Math.sin(x * 0.12 * freqMult - phase * 1.3 + phaseOffset) * 0.35;
          const y = mid + wave * (mid - 4) * amp * env;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };

      drawChannel(curL, colL, 1.0, 0);
      drawChannel(curR, colR, 1.28, 1.9);

      if (!reducedMotion) {
        requestAnimationFrame(drawWaves);
      }
    };

    drawWaves();
  }
})();
