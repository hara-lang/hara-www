const MOBILE_QUERY = "(max-width: 760px)";

export function siteNavigationMode(width) {
  return Number(width) <= 760 ? "disclosure" : "inline";
}

export function initialiseSiteNavigation(root = document) {
  if (!root?.querySelectorAll) return;
  const documentRoot = root.nodeType === 9 ? root : root.ownerDocument;
  const view = documentRoot?.defaultView;
  if (!documentRoot || !view) return;

  const media = view.matchMedia(MOBILE_QUERY);
  const headers = [...root.querySelectorAll("[data-site-header]")];
  if (headers.length === 0) return;

  documentRoot.documentElement.dataset.siteNavigationReady = "true";

  for (const header of headers) {
    if (!(header instanceof view.HTMLElement) || header.dataset.navigationReady === "true") continue;

    const trigger = header.querySelector("[data-site-navigation-trigger]");
    const navigation = header.querySelector("[data-site-navigation]");
    const backdrop = header.querySelector("[data-site-navigation-backdrop]");
    if (!(trigger instanceof view.HTMLButtonElement) || !(navigation instanceof view.HTMLElement) || !(backdrop instanceof view.HTMLButtonElement)) continue;

    header.dataset.navigationReady = "true";

    const setOpen = (requestedOpen, restoreFocus = false) => {
      const disclosure = media.matches;
      const open = disclosure && requestedOpen;
      header.dataset.navigationOpen = String(open);
      trigger.setAttribute("aria-expanded", String(open));
      navigation.hidden = disclosure && !open;
      backdrop.hidden = !open;
      documentRoot.documentElement.dataset.siteNavigationOpen = String(open);
      if (!open && restoreFocus) trigger.focus();
    };

    trigger.addEventListener("click", () => {
      setOpen(trigger.getAttribute("aria-expanded") !== "true");
    });
    backdrop.addEventListener("click", () => setOpen(false, true));
    navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
    documentRoot.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && trigger.getAttribute("aria-expanded") === "true") setOpen(false, true);
    });
    media.addEventListener?.("change", () => setOpen(false));
    setOpen(false);
  }
}
