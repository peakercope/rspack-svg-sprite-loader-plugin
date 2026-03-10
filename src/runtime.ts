const registered = new Set<string>();
let container: SVGElement | null = null;

function getContainer(): SVGElement | null {
  if (typeof document === "undefined") return null;
  if (container) return container;

  container = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  container.setAttribute("data-svg-sprite", "");
  container.setAttribute("aria-hidden", "true");
  container.style.position = "absolute";
  container.style.width = "0";
  container.style.height = "0";
  container.style.overflow = "hidden";
  document.body.appendChild(container);
  return container;
}

export function add(id: string, symbolHtml: string): void {
  if (registered.has(id)) return;
  const el = getContainer();
  if (!el) return;
  registered.add(id);
  el.insertAdjacentHTML("beforeend", symbolHtml);
}
