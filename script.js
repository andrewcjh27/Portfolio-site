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
  // Cafe map logic lives in cafes.html and uses Naver Maps.

  document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".photo-slideshow-container .photo-slide");
    if (!slides.length) return;
  
    let slideIndex = 0;
  
    function showNextSlide() {
      slides.forEach(slide => {
        slide.style.display = "none";
      });
  
      slideIndex++;
      if (slideIndex > slides.length) {
        slideIndex = 1;
      }
  
      slides[slideIndex - 1].style.display = "block";
      setTimeout(showNextSlide, 3500); // change every 3.5 seconds
    }
  
    showNextSlide();
  });
  
  
