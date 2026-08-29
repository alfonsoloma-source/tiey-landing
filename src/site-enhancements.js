let startedForm = false;
let invalidTracked = false;
const depthSeen = new Set();

function track(name, props = {}) {
  try {
    window.va?.("event", { name, ...props });
  } catch {
    // Analytics must never block the site experience.
  }
}

function classifyLink(anchor) {
  const href = anchor.getAttribute("href") || "";
  if (href === "#contacto" || href === "/#contacto") return "contact_cta";
  if (href.startsWith("mailto:")) return "email";
  if (href.startsWith("tel:")) return "phone";
  if (anchor.closest(".client-proof")) return "client_case";
  if (href.startsWith("#") || href.startsWith("/#")) return "navigation";
  if (/^https?:\/\//.test(href) && !href.includes("tiey.cc")) return "external";
  return "internal";
}

function initMobileNavigation() {
  const header = document.querySelector("header.nav");
  const nav = header?.querySelector("nav");
  if (!header || !nav || header.querySelector(".mobile-nav-toggle")) return () => {};

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "mobile-nav-toggle";
  toggle.setAttribute("aria-label", "Abrir menú");
  toggle.setAttribute("aria-expanded", "false");
  toggle.innerHTML = '<span></span><span></span>';
  header.insertBefore(toggle, header.querySelector(".nav-cta"));

  const closeMenu = () => {
    header.classList.remove("mobile-nav-open");
    document.body.classList.remove("mobile-nav-lock");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
  };
  const openMenu = () => {
    header.classList.add("mobile-nav-open");
    document.body.classList.add("mobile-nav-lock");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Cerrar menú");
  };

  const onToggle = () => {
    const isOpen = header.classList.contains("mobile-nav-open");
    isOpen ? closeMenu() : openMenu();
    track("mobile_menu_toggle", { state: isOpen ? "closed" : "opened" });
  };
  const onNavClick = event => {
    if (event.target.closest("a")) closeMenu();
  };
  const onKeydown = event => {
    if (event.key === "Escape") closeMenu();
  };
  const onResize = () => {
    if (window.innerWidth > 760) closeMenu();
  };

  toggle.addEventListener("click", onToggle);
  nav.addEventListener("click", onNavClick);
  document.addEventListener("keydown", onKeydown);
  window.addEventListener("resize", onResize, { passive: true });

  return () => {
    toggle.removeEventListener("click", onToggle);
    nav.removeEventListener("click", onNavClick);
    document.removeEventListener("keydown", onKeydown);
    window.removeEventListener("resize", onResize);
  };
}

function initPremiumMotion() {
  const mediaFine = window.matchMedia("(pointer:fine) and (hover:hover)");
  const mediaReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cleanups = [];

  const header = document.querySelector("header.nav");
  const onScrollState = () => header?.classList.toggle("nav-scrolled", window.scrollY > 28);
  window.addEventListener("scroll", onScrollState, { passive: true });
  onScrollState();
  cleanups.push(() => window.removeEventListener("scroll", onScrollState));

  const revealTargets = [
    ".section .section-head",
    ".section .columns > *",
    ".section .timeline > *",
    ".section .result-intro",
    ".section .result-metrics > *",
    ".section .difference-copy",
    ".section .manifesto > *",
    ".section.faq > div > button",
    ".client-proof > *",
    ".contact > *",
  ];
  const revealNodes = [...document.querySelectorAll(revealTargets.join(","))];
  revealNodes.forEach((node, index) => {
    node.classList.add("premium-reveal");
    node.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 55}ms`);
  });

  if ("IntersectionObserver" in window && !mediaReduced.matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7%" });
    revealNodes.forEach(node => revealObserver.observe(node));
    cleanups.push(() => revealObserver.disconnect());
  } else {
    revealNodes.forEach(node => node.classList.add("is-revealed"));
  }

  if (mediaFine.matches && !mediaReduced.matches) {
    const glow = document.createElement("div");
    glow.className = "premium-cursor-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);

    let glowX = -200;
    let glowY = -200;
    let frame = 0;
    const renderGlow = () => {
      glow.style.transform = `translate3d(${glowX}px,${glowY}px,0)`;
      frame = 0;
    };
    const onPointerMove = event => {
      glowX = event.clientX - 210;
      glowY = event.clientY - 210;
      if (!frame) frame = requestAnimationFrame(renderGlow);
    };
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    cleanups.push(() => {
      document.removeEventListener("pointermove", onPointerMove);
      if (frame) cancelAnimationFrame(frame);
      glow.remove();
    });

    const magneticNodes = [...document.querySelectorAll(".primary,.nav-cta")];
    magneticNodes.forEach(node => {
      const onMove = event => {
        const rect = node.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
        node.style.setProperty("--mag-x", `${x.toFixed(2)}px`);
        node.style.setProperty("--mag-y", `${y.toFixed(2)}px`);
      };
      const onLeave = () => {
        node.style.setProperty("--mag-x", "0px");
        node.style.setProperty("--mag-y", "0px");
      };
      node.addEventListener("pointermove", onMove);
      node.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        node.removeEventListener("pointermove", onMove);
        node.removeEventListener("pointerleave", onLeave);
      });
    });

    const spotlightNodes = [...document.querySelectorAll(".columns article,.timeline article,.result-metrics article,.manifesto > div,.accordion button,.client-proof")];
    spotlightNodes.forEach(node => {
      node.classList.add("premium-spotlight");
      const onMove = event => {
        const rect = node.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        node.style.setProperty("--spot-x", `${x.toFixed(1)}%`);
        node.style.setProperty("--spot-y", `${y.toFixed(1)}%`);
      };
      node.addEventListener("pointermove", onMove);
      cleanups.push(() => node.removeEventListener("pointermove", onMove));
    });
  }

  return () => cleanups.forEach(fn => fn());
}

export function initSiteEnhancements() {
  const cleanupMobileNav = initMobileNavigation();
  const cleanupPremiumMotion = initPremiumMotion();

  const onDocumentClick = event => {
    const anchor = event.target.closest?.("a[href]");
    if (!anchor) return;
    const href = anchor.getAttribute("href") || "";
    track("link_click", {
      link_type: classifyLink(anchor),
      link_text: anchor.textContent?.trim().slice(0, 80) || "",
      destination: href.slice(0, 180),
      page: window.location.pathname,
    });
  };
  document.addEventListener("click", onDocumentClick);

  const form = document.querySelector("#contacto form");
  const onFormFocus = () => {
    if (startedForm) return;
    startedForm = true;
    track("contact_form_start", { page: window.location.pathname });
  };
  const onFormSubmit = () => {
    track("contact_form_submit", { page: window.location.pathname });
  };
  const onFormInvalid = event => {
    if (invalidTracked) return;
    invalidTracked = true;
    track("contact_form_validation_error", {
      field: event.target?.name || "unknown",
      page: window.location.pathname,
    });
    window.setTimeout(() => { invalidTracked = false; }, 1500);
  };
  if (form) {
    form.addEventListener("focusin", onFormFocus);
    form.addEventListener("submit", onFormSubmit, { capture: true });
    form.addEventListener("invalid", onFormInvalid, true);
  }

  const onScroll = () => {
    const root = document.documentElement;
    const max = root.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    const depth = Math.round((window.scrollY / max) * 100);
    [50, 90].forEach(mark => {
      if (depth >= mark && !depthSeen.has(mark)) {
        depthSeen.add(mark);
        track("scroll_depth", { percent: mark, page: window.location.pathname });
      }
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  return () => {
    cleanupMobileNav();
    cleanupPremiumMotion();
    document.removeEventListener("click", onDocumentClick);
    window.removeEventListener("scroll", onScroll);
    if (form) {
      form.removeEventListener("focusin", onFormFocus);
      form.removeEventListener("submit", onFormSubmit, { capture: true });
      form.removeEventListener("invalid", onFormInvalid, true);
    }
  };
}
