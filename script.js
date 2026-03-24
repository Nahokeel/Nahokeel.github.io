const yearEl = document.getElementById("year");
const menuToggle = document.getElementById("menuToggle");
const topNav = document.getElementById("topNav");
const tabLinks = document.querySelectorAll(".tab-link");
const tabPanels = document.querySelectorAll(".tab-panel");
const projectTiles = document.querySelectorAll(".project-tile");
const projectDetails = document.querySelectorAll(".project-detail");

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

function closeAllProjects() {
  projectDetails.forEach((detail) => {
    detail.classList.remove("is-open");
    detail.hidden = true;
  });
}

function openProject(projectId) {
  closeAllProjects();
  const projectDetail = document.getElementById(`project-${projectId}`);
  if (projectDetail) {
    projectDetail.classList.add("is-open");
    projectDetail.hidden = false;
  }
}

projectTiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    const projectId = tile.dataset.project;
    openProject(projectId);
  });
});

setActiveTab();
window.addEventListener("hashchange", setActiveTab);
