const yearEl = document.getElementById("year");
const menuToggle = document.getElementById("menuToggle");
const topNav = document.getElementById("topNav");
const tabLinks = document.querySelectorAll(".tab-link");
const tabPanels = document.querySelectorAll(".tab-panel");
const categoryButtons = document.querySelectorAll(".category-btn");
const projectListItems = document.querySelectorAll(".project-list-item[data-category]");

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
  const allowedTabs = ["#about", "#resume", "#portfolio"];
  const hash = allowedTabs.includes(window.location.hash)
    ? window.location.hash
    : "#about";

  tabLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === hash;
    link.classList.toggle("active", isActive);
  });

  tabPanels.forEach((panel) => {
    const panelHash = `#${panel.id}`;
    const isActive = panelHash === hash;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

setActiveTab();
window.addEventListener("hashchange", setActiveTab);

function setCategory(category) {
  categoryButtons.forEach((button) => {
    const isActive = button.dataset.category === category;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  projectListItems.forEach((item) => {
    const shouldShow = item.dataset.category === category;
    item.classList.toggle("is-hidden", !shouldShow);
  });
}

if (categoryButtons.length) {
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setCategory(button.dataset.category);
    });
  });

  setCategory("personal");
}
