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
  document.addEventListener("DOMContentLoaded", () => {
    const mapDiv = document.getElementById("naver-map");
    if (!mapDiv || typeof naver === "undefined") return;
  
    // Center around Seoul for example (change to where you want)
    const center = new naver.maps.LatLng(37.5665, 126.9780);
  
    const map = new naver.maps.Map("naver-map", {
      center,
      zoom: 13
    });
  
    // Example cafes array – fill with your real ones
    const cafes = [
      {
        name: "Example Cafe",
        note: "Nice vibe and latte.",
        lat: 37.5665,
        lng: 126.9780
      }
      // { name: "Another Cafe", note: "Your note", lat: ..., lng: ... }
    ];
  
    cafes.forEach(cafe => {
      const position = new naver.maps.LatLng(cafe.lat, cafe.lng);
      const marker = new naver.maps.Marker({
        position,
        map
      });
  
      const info = new naver.maps.InfoWindow({
        content: `<div style="padding:4px 8px;font-size:12px;">
                    <strong>${cafe.name}</strong><br/>${cafe.note}
                  </div>`
      });
  
      naver.maps.Event.addListener(marker, "click", () => {
        info.open(map, marker);
      });
    });
  });

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
  
  