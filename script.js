
document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation toggle
  const menuToggle = document.querySelector(
    ".menu-toggle, .nav-toggle, #menu-toggle"
  );
  const navigation = document.querySelector(
    ".nav-links, .navigation, #nav-links"
  );

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      navigation.classList.toggle("active");

      const isOpen = navigation.classList.contains("active");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      navigation?.classList.remove("active");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Header shadow when scrolling
  const header = document.querySelector("header");

  const updateHeader = () => {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 20);
    }
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Reveal elements when they enter the viewport
  const revealElements = document.querySelectorAll(
    ".reveal, .fade-in, .service-card, .stat-card"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

  // Contact form demo
  const contactForm = document.querySelector(
    "#contact-form, .contact-form, form[data-contact-form]"
  );

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      const formData = new FormData(contactForm);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const message = String(formData.get("message") || "").trim();

      if (!name || !email || !message) {
        alert("Please fill in all required fields.");
        return;
      }

      const subject = encodeURIComponent(
        `Website enquiry from ${name}`
      );

      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      );

      // Replace this address with your real business email.
      const businessEmail = "hello@example.com";

      window.location.href =
        `mailto:${businessEmail}?subject=${subject}&body=${body}`;
    });
  }

  // Update copyright year automatically
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
});
