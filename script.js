// Cache the popup windows and taskbar controls used by the desktop UI.
const popupWindows = Array.from(document.querySelectorAll(".popup-window"));
const taskbarApps = document.getElementById("taskbar-apps");
let highestZIndex = 5;

function focusWindow(windowElement) {
  highestZIndex += 1;
  windowElement.style.zIndex = highestZIndex;

  document.querySelectorAll(".taskbar-app").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.open === windowElement.id);
  });
}

function updateTaskbar() {
  taskbarApps.replaceChildren();

  popupWindows.forEach((windowElement) => {
    if (windowElement.hidden) return;

    const tab = document.createElement("button");
    tab.className = "taskbar-app";
    tab.type = "button";
    tab.dataset.open = windowElement.id;
    tab.textContent = windowElement.dataset.title;
    tab.title = windowElement.dataset.title;
    taskbarApps.appendChild(tab);
  });
}

// Show one detail window at a time so popup windows do not overlap.
function openWindow(id) {
  const windowElement = popupWindows.find((item) => item.id === id);
  if (!windowElement) {
    console.error(`Cannot open window "${id}": no matching popup window exists.`);
    return;
  }

  popupWindows.forEach((otherWindow) => {
    if (otherWindow !== windowElement) {
      otherWindow.hidden = true;
      otherWindow.style.display = "";
    }
  });

  windowElement.hidden = false;
  windowElement.style.display = "";
  updateTaskbar();
  focusWindow(windowElement);
}

function closeWindow(id) {
  const windowElement = popupWindows.find((item) => item.id === id);
  if (!windowElement) {
    console.error(`Cannot close window "${id}": no matching popup window exists.`);
    return;
  }

  windowElement.hidden = true;
  windowElement.style.display = "";
  updateTaskbar();
}

function minimizeWindow(windowElement) {
  windowElement.style.display = "none";
  updateTaskbar();
}

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  if (actionButton) {
    const windowElement = actionButton.closest(".window");

    if (actionButton.dataset.action === "close") {
      closeWindow(windowElement.id);
    } else if (actionButton.dataset.action === "minimize") {
      minimizeWindow(windowElement);
    }
    return;
  }

  const openButton = event.target.closest("[data-open]");
  if (openButton) {
    openWindow(openButton.dataset.open);
  }
});

function updateClock() {
  document.getElementById("clock").textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

updateTaskbar();
updateClock();
window.setInterval(updateClock, 30000);
