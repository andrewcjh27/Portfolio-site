// script.js
document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link").forEach(link => {
      const href = link.getAttribute("href");
      if (href === path) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  });
  