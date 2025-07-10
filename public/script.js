// Hauptskript für den Nunjucks Blog
console.log("Blog Script geladen!");

// Beispiel: Smooth Scrolling für Navigation
document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling für alle internen Links
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Beispiel: Aktive Navigation highlighten
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  const currentPage = window.location.pathname;

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

  // Beispiel: Back to top Button
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 300) {
        backToTopBtn.style.display = "block";
      } else {
        backToTopBtn.style.display = "none";
      }
    });

    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
});

// Beispiel: Blog-spezifische Funktionen
window.BlogUtils = {
  // Format Datum
  formatDate: function (dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("de-DE", options);
  },

  // Zeige/Verstecke Elemente
  toggleElement: function (elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display =
        element.style.display === "none" ? "block" : "none";
    }
  },

  // Einfache Form Validierung
  validateForm: function (formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const requiredFields = form.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        field.classList.add("is-invalid");
        isValid = false;
      } else {
        field.classList.remove("is-invalid");
      }
    });

    return isValid;
  },
};
