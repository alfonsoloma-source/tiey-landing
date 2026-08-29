export function initSignatureMoments() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hero = document.querySelector(".hero");
  const proof = document.querySelector(".client-proof");
  const contact = document.querySelector("#contacto");
  const cleanups = [];

  if (reduced.matches) {
    hero?.classList.add("signature-live");
    proof?.classList.add("signature-live");
    contact?.classList.add("signature-live");
    return () => {};
  }

  if (hero) {
    hero.classList.add("signature-intro");
    const frame1 = requestAnimationFrame(() => {
      const frame2 = requestAnimationFrame(() => hero.classList.add("signature-live"));
      cleanups.push(() => cancelAnimationFrame(frame2));
    });
    cleanups.push(() => cancelAnimationFrame(frame1));
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("signature-live");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.32, rootMargin: "0px 0px -8%" });
    [proof, contact].filter(Boolean).forEach(node => observer.observe(node));
    cleanups.push(() => observer.disconnect());
  } else {
    proof?.classList.add("signature-live");
    contact?.classList.add("signature-live");
  }

  return () => cleanups.forEach(fn => fn());
}
