const root = document.documentElement;
const buttons = document.querySelectorAll("[data-theme-choice]");

function setTheme(theme) {
  root.dataset.theme = theme;
  buttons.forEach((button) => {
    const active = button.dataset.themeChoice === theme;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

buttons.forEach((button) => {
  button.addEventListener("click", () => setTheme(button.dataset.themeChoice));
});
