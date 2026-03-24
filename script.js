const yearEl = document.getElementById("year");
const menuToggle = document.getElementById("menuToggle");
const topNav = document.getElementById("topNav");
const tabLinks = document.querySelectorAll(".tab-link");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (menuToggle && topNav) {
  menuToggle.addEventListener("click", () => {
    topNav.classList.toggle("is-open");
  });

  topNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      topNav.classList.remove("is-open");
    });
  });
}

function setActiveTab() {
  const hash = window.location.hash || "#about";

  tabLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === hash;
    link.classList.toggle("active", isActive);
  });
}

setActiveTab();
window.addEventListener("hashchange", setActiveTab);
