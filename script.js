const yearEl = document.getElementById("year");
const menuToggle = document.getElementById("menuToggle");
const topNav = document.getElementById("topNav");
const tabLinks = document.querySelectorAll(".tab-link");
const tabPanels = document.querySelectorAll(".tab-panel");
const portfolioFilterButtons = document.querySelectorAll(".portfolio-filter-btn");
const portfolioCategoryPanels = document.querySelectorAll(".portfolio-category-panel");
const projectCardButtons = document.querySelectorAll(".project-card-btn");
const projectDetailPanes = document.querySelectorAll(".project-detail-pane");

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

function setPortfolioCategory(category) {
  portfolioFilterButtons.forEach((button) => {
    const isActive = button.dataset.category === category;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  portfolioCategoryPanels.forEach((panel) => {
    const isActive = panel.dataset.categoryPanel === category;
    panel.classList.toggle("is-active", isActive);
  });

  projectCardButtons.forEach((card) => {
    const shouldShow = card.dataset.category === category;
    card.classList.toggle("is-hidden", !shouldShow);
  });

  const activeVisible = document.querySelector(".project-card-btn.is-active:not(.is-hidden)");
  if (!activeVisible) {
    const firstVisible = document.querySelector(`.project-card-btn[data-category=\"${category}\"]`);
    if (firstVisible) {
      setActiveProject(firstVisible.dataset.project);
    }
  }
}

function setActiveProject(projectId) {
  projectCardButtons.forEach((card) => {
    const isActive = card.dataset.project === projectId;
    card.classList.toggle("is-active", isActive);
  });

  projectDetailPanes.forEach((pane) => {
    const isActive = pane.dataset.project === projectId;
    pane.classList.toggle("is-active", isActive);
  });
}

if (portfolioFilterButtons.length && projectCardButtons.length && projectDetailPanes.length) {
  portfolioFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setPortfolioCategory(button.dataset.category);
    });
  });

  projectCardButtons.forEach((card) => {
    card.addEventListener("click", () => {
      setActiveProject(card.dataset.project);
    });
  });

  setPortfolioCategory("personal");
  setActiveProject("luarpg");
}
