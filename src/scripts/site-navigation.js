import { setHaraHeaderMenuState } from "@hara-lang/ui/v2/header.js";

export function siteNavigationMode() {
  return "disclosure";
}

export function initialiseSiteNavigation(root = document) {
  if (!root?.querySelectorAll) return;
  const documentRoot = root.nodeType === 9 ? root : root.ownerDocument;
  const view = documentRoot?.defaultView;
  if (!documentRoot || !view) return;

  const mastheads = [...root.querySelectorAll("[data-site-header]")];
  if (mastheads.length === 0) return;

  documentRoot.documentElement.dataset.siteNavigationReady = "true";

  for (const masthead of mastheads) {
    if (!(masthead instanceof view.HTMLElement) || masthead.dataset.navigationReady === "true") continue;

    const header = masthead.querySelector("[data-hara-shell-header]");
    const navigation = masthead.querySelector("[data-site-navigation]");
    const backdrop = masthead.querySelector("[data-site-navigation-backdrop]");
    const close = masthead.querySelector("[data-site-navigation-close]");
    if (!(header instanceof view.HTMLElement) || !(navigation instanceof view.HTMLElement) || !(backdrop instanceof view.HTMLButtonElement)) continue;

    masthead.dataset.navigationReady = "true";

    const setOpen = (requestedOpen, restoreFocus = false) => {
      const open = Boolean(requestedOpen);
      masthead.dataset.navigationOpen = String(open);
      navigation.hidden = !open;
      navigation.setAttribute("aria-hidden", String(!open));
      backdrop.hidden = !open;
      documentRoot.documentElement.dataset.siteNavigationOpen = String(open);
      setHaraHeaderMenuState(header, open, {
        compact: view.matchMedia("(max-width: 840px)").matches,
        restoreFocus,
        syncNavigation: false
      });

      if (open) {
        const firstLink = navigation.querySelector("a");
        if (firstLink instanceof view.HTMLAnchorElement) view.requestAnimationFrame(() => firstLink.focus());
      }
    };

    header.addEventListener("hara:header-menu-request", (event) => {
      if (!(event instanceof view.CustomEvent)) return;
      event.preventDefault();
      setOpen(Boolean(event.detail?.open), Boolean(event.detail?.restoreFocus));
    });
    backdrop.addEventListener("click", () => setOpen(false, true));
    if (close instanceof view.HTMLButtonElement) close.addEventListener("click", () => setOpen(false, true));
    navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
    documentRoot.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && masthead.dataset.navigationOpen === "true") setOpen(false, true);
    });

    setOpen(false);
  }
}
