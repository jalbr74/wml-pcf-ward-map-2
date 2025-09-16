import {AppState} from "./App.store";

export function highlightSelectedAddresses(wrapperRef: React.MutableRefObject<HTMLDivElement | null>, state: AppState) {
    const root = wrapperRef.current;
    if (!root) return;

    // Clear previous selection
    root.querySelectorAll(".is-selected").forEach(el => el.classList.remove("is-selected"));

    // Add selection
    state.selectedAddresses.forEach(name => {
        const sel = `path[data-name="${name}"]`;
        root.querySelectorAll(sel).forEach(el => el.classList.add("is-selected"));
    });
}
