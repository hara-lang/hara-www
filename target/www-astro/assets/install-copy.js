(() => {
  const commandSelector = "[data-install-command] code";
  const resetDelay = 1800;

  const legacyCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    if (!copied) throw new Error("Copy command was rejected");
  };

  const writeClipboard = async (text) => {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    legacyCopy(text);
  };

  const mountCopyButton = (code) => {
    const command = code.textContent?.trim();
    const parent = code.parentElement;
    if (!command || !parent || parent.querySelector("[data-install-copy]")) return;

    const commandRow = document.createElement("div");
    commandRow.className = "install-command-row";
    code.replaceWith(commandRow);
    commandRow.append(code);

    const button = document.createElement("button");
    button.className = "install-command-copy";
    button.type = "button";
    button.dataset.installCopy = "";
    button.setAttribute("aria-label", "Copy Homebrew install command");

    const label = document.createElement("span");
    label.dataset.installCopyLabel = "";
    label.setAttribute("aria-live", "polite");
    label.textContent = "Copy";
    button.append(label);
    commandRow.append(button);

    let resetTimer;
    button.addEventListener("click", async () => {
      window.clearTimeout(resetTimer);
      button.disabled = true;
      try {
        await writeClipboard(command);
        label.textContent = "Copied";
        button.dataset.state = "copied";
      } catch (error) {
        console.error("Unable to copy Hara install command", error);
        label.textContent = "Copy failed";
        button.dataset.state = "error";
      } finally {
        button.disabled = false;
        resetTimer = window.setTimeout(() => {
          label.textContent = "Copy";
          delete button.dataset.state;
        }, resetDelay);
      }
    });
  };

  document.querySelectorAll(commandSelector).forEach(mountCopyButton);
})();
