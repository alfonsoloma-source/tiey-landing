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

export function initSiteEnhancements() {
  document.addEventListener("click", event => {
    const anchor = event.target.closest?.("a[href]");
    if (!anchor) return;
    const href = anchor.getAttribute("href") || "";
    track("link_click", {
      link_type: classifyLink(anchor),
      link_text: anchor.textContent?.trim().slice(0, 80) || "",
      destination: href.slice(0, 180),
      page: window.location.pathname,
    });
  });

  const form = document.querySelector("#contacto form");
  if (form) {
    form.addEventListener("focusin", () => {
      if (startedForm) return;
      startedForm = true;
      track("contact_form_start", { page: window.location.pathname });
    });

    form.addEventListener("submit", () => {
      track("contact_form_submit", { page: window.location.pathname });
    }, { capture: true });

    form.addEventListener("invalid", event => {
      if (invalidTracked) return;
      invalidTracked = true;
      track("contact_form_validation_error", {
        field: event.target?.name || "unknown",
        page: window.location.pathname,
      });
      window.setTimeout(() => { invalidTracked = false; }, 1500);
    }, true);
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

  return () => window.removeEventListener("scroll", onScroll);
}
