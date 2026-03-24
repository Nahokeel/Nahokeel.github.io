const yearEl = document.getElementById("year");
const menuToggle = document.getElementById("menuToggle");
const topNav = document.getElementById("topNav");
const tabLinks = document.querySelectorAll(".tab-link");
const tabPanels = document.querySelectorAll(".tab-panel");
const projectTiles = document.querySelectorAll(".project-tile");
const projectDetailViewer = document.getElementById("project-detail-viewer");
const projectDetailContent = document.getElementById("project-detail-content");
const certificateZoomTriggers = document.querySelectorAll(".certificate-zoom-trigger");
const certificateLightbox = document.getElementById("certificateLightbox");
const certificateLightboxImage = document.getElementById("certificateLightboxImage");
const certificateLightboxClose = document.getElementById("certificateLightboxClose");

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

function hideProjectViewer() {
  if (projectDetailViewer) {
    projectDetailViewer.classList.remove("is-open");
    projectDetailViewer.hidden = true;
  }

  projectTiles.forEach((tile) => {
    tile.classList.remove("is-active");
  });
}

function normalizeAssetPaths(rootElement, projectPage) {
  const basePath = projectPage.replace(/index\.html$/i, "");
  const urlAttributes = ["src", "href", "poster"];

  rootElement.querySelectorAll("[src], [href], [poster]").forEach((node) => {
    urlAttributes.forEach((attr) => {
      const value = node.getAttribute(attr);
      if (!value) {
        return;
      }

      const isExternal = /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value) || value.startsWith("//");
      if (value.startsWith("#") || value.startsWith("/") || isExternal) {
        return;
      }

      node.setAttribute(attr, `${basePath}${value}`);
    });
  });
}

async function buildProjectMarkup(projectId, projectPage) {
  const response = await fetch(projectPage, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load ${projectPage}`);
  }

  const rawHtml = await response.text();
  const doc = new DOMParser().parseFromString(rawHtml, "text/html");
  const pageRoot = doc.querySelector("main.page") || doc.body;
  const sections = Array.from(pageRoot.querySelectorAll("section"));
  const wrapper = document.createElement("div");

  if (sections.length) {
    sections.forEach((section) => {
      const clone = section.cloneNode(true);

      if (clone.classList.contains("hero")) {
        clone.classList.remove("hero");
        clone.classList.add("project-hero", "project-hero--center");
      }

      if (clone.classList.contains("section")) {
        clone.classList.remove("section");
        clone.classList.add("project-section");
      }

      wrapper.appendChild(clone);
    });
  } else {
    wrapper.innerHTML = pageRoot.innerHTML;
  }

  normalizeAssetPaths(wrapper, projectPage);

  if (projectId === "dollys-closet") {
    const logo = wrapper.querySelector(".hero-logo");
    if (logo) {
      logo.classList.add("hero-logo--compact");
    }
  }

  return wrapper.innerHTML;
}

async function openProject(projectId, projectPage) {
  if (!projectDetailViewer || !projectDetailContent || !projectPage) {
    return;
  }

  hideProjectViewer();
  projectDetailViewer.hidden = false;
  projectDetailViewer.classList.add("is-open");
  projectDetailContent.innerHTML = '<p class="project-loading">Loading project...</p>';

  try {
    const markup = await buildProjectMarkup(projectId, projectPage);
    projectDetailContent.innerHTML = markup;
  } catch (error) {
    projectDetailContent.innerHTML =
      '<p class="project-error">Could not load this project page. Please try again.</p>';
  }
}

projectTiles.forEach((tile) => {
  tile.addEventListener("click", async () => {
    const projectId = tile.dataset.project;
    const projectPage = tile.dataset.projectPage;
    projectTiles.forEach((current) => current.classList.remove("is-active"));
    tile.classList.add("is-active");
    await openProject(projectId, projectPage);
  });
});

function closeCertificateLightbox() {
  if (!certificateLightbox || !certificateLightboxImage) {
    return;
  }

  certificateLightbox.hidden = true;
  certificateLightboxImage.src = "";
  certificateLightboxImage.alt = "";
}

certificateZoomTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    if (!certificateLightbox || !certificateLightboxImage) {
      return;
    }

    const certSrc = trigger.dataset.certSrc || trigger.getAttribute("src") || "";
    const certAlt = trigger.dataset.certAlt || trigger.getAttribute("alt") || "Certificate";

    certificateLightboxImage.src = certSrc;
    certificateLightboxImage.alt = certAlt;
    certificateLightbox.hidden = false;
  });
});

if (certificateLightbox && certificateLightboxClose) {
  certificateLightboxClose.addEventListener("click", closeCertificateLightbox);
  certificateLightbox.addEventListener("click", (event) => {
    if (event.target === certificateLightbox) {
      closeCertificateLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !certificateLightbox.hidden) {
      closeCertificateLightbox();
    }
  });
}

setActiveTab();
window.addEventListener("hashchange", setActiveTab);
