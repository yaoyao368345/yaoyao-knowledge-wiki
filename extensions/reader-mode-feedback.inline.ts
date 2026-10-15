// Keep Quartz's native mode switching; only improve its state feedback.
(() => {
const readerIcons = `
<svg class="reader-state-icon reader-state-layout" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <rect x="3" y="4" width="18" height="16" rx="2" />
  <path d="M8 4v16M16 4v16M11 8h2M11 12h2M11 16h2" />
</svg>
<svg class="reader-state-icon reader-state-book" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1ZM12 6v14M6 9l3 1M6 13l3 1M15 10l3-1M15 14l3-1" />
</svg>`

function syncReaderModeFeedback() {
  const enabled = document.documentElement.getAttribute("reader-mode") === "on"
  for (const button of document.querySelectorAll<HTMLButtonElement>("button.readermode")) {
    if (!button.querySelector(".reader-state-icon")) button.innerHTML = readerIcons
    const label = enabled ? "恢复普通布局" : "开启专注阅读"
    button.setAttribute("aria-label", label)
    button.setAttribute("aria-pressed", String(enabled))
    button.title = enabled ? "专注阅读已开启 · 恢复普通布局" : "普通布局 · 开启专注阅读"
  }
}

// These document listeners deliberately survive SPA navigation; install once.
if (!document.documentElement.hasAttribute("data-reader-feedback-ready")) {
  document.documentElement.setAttribute("data-reader-feedback-ready", "")
  document.addEventListener("nav", syncReaderModeFeedback)
  document.addEventListener("render", syncReaderModeFeedback)
  document.addEventListener("readermodechange", syncReaderModeFeedback)
}
syncReaderModeFeedback()
})()
