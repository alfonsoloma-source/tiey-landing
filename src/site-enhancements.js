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

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.contains("mobile-nav-open");
    isOpen ? closeMenu() : openMenu();
    track("mobile_menu_toggle", { state: isOpen ? "closed" : "opened" });
  });
  nav.addEventListener("click", event => {
    if (event.target.closest("a")) closeMenu();
  });
  const onKeydown = event => {
    if (event.key === "Escape") closeMenu();
  };
  const onResize = () => {
    if (window.innerWidth > 760) closeMenu();
  };
  document.addEventListener("keydown", onKeydown);
  window.addEventListener("resize", onResize, { passive: true });

  return () => {
    document.removeEventListener("keydown", onKeydown);
    window.removeEventListener("resize", onResize);
  };
}

export function initSiteEnhancements() {
  const cleanupMobileNav = initMobileNavigation();

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
    document.removeEventListener("click", onDocumentClick);
    window.removeEventListener("scroll", onScroll);
    if (form) {
      form.removeEventListener("focusin", onFormFocus);
      form.removeEventListener("submit", onFormSubmit, { capture: true });
      form.removeEventListener("invalid", onFormInvalid, true);
    }
  };
}
