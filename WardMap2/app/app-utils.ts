import {AppState} from "./App.store";

export function highlightSelectedAddresses(wrapperRef: React.MutableRefObject<HTMLDivElement | null>, selectedAddresses: string[]) {
    const root = wrapperRef.current;
    if (!root) return;

    // Clear previous selection
    root.querySelectorAll(".is-selected").forEach(el => el.classList.remove("is-selected"));

    // Add selection
    selectedAddresses.forEach(name => {
        const sel = `g[data-name="${name}"] path`;
        root.querySelectorAll(sel).forEach(el => el.classList.add("is-selected"));
    });
}
