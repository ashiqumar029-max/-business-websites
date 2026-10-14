document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  const cursorGlow = document.querySelector(".cursor-glow");

  // Responsive mobile menu
  menuButton?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });

  // Subtle pointer glow on desktop
  if (cursorGlow && window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("pointermove", (event) => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    }, { passive: true });
  }

  // Animate counters only when the stats are in view
  const counters = document.querySelectorAll("[data-count]");
  const runCounter = (element) => {
    const target = Number(element.dataset.count || 0);
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      element.textContent = String(Math.round(target * eased)).padStart(2, "0");
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.55 });
    counters.forEach((counter) => statsObserver.observe(counter));

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".section-kicker, .project, .service-row, .stat, .intro-grid, .services-head").forEach((el) => {
      el.classList.add("reveal");
      revealObserver.observe(el);
    });
  } else {
    counters.forEach((counter) => { counter.textContent = counter.dataset.count || "0"; });
  }

  // Live year
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Contact form: validates inputs and opens a pre-filled email draft.
  // Replace the address below with the real business inbox.
  const form = document.querySelector("#contact-form");
  const feedback = document.querySelector("#form-feedback");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const type = String(data.get("projectType") || "").trim();
    const message = String(data.get("message") || "").trim();

    const subject = encodeURIComponent(`NOIR/FORM project enquiry — ${type}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nProject: ${type}\n\nBrief:\n${message}`
    );
    const recipient = "hello@noirform.studio";

    if (feedback) feedback.textContent = "Opening your email app with the brief filled in…";
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  });
});