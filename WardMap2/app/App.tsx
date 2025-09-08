import styles from './App.module.css';

import * as React from 'react';
import {useComponentStore} from "use-component-store";
import {AppState, AppStore} from "./App.store";

import WardMap from '!@svgr/webpack!./ward-map/ward-map.svg';

const esc = (s: string) =>
    (window.CSS && CSS.escape) ? CSS.escape(s) : s.replace(/(["\\])/g, "\\$1");

export function App(): React.JSX.Element {
    const [state, store] = useComponentStore<AppState, AppStore>(AppStore);

    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const addresses = React.useMemo(() => ["214 S 650 W", "211 S 650 W"], []);

    React.useEffect(() => {
        const root = wrapperRef.current;
        if (!root) return;

        // Clear previous selection
        root.querySelectorAll(".is-selected").forEach(el => el.classList.remove("is-selected"));

        // Add selection
        addresses.forEach(name => {
            const sel = `path[data-name="${esc(name)}"]`;
            root.querySelectorAll(sel).forEach(el => el.classList.add("is-selected"));
        });
    }, [addresses]);

    return (
        <>
            <div ref={wrapperRef} className={styles.wrap}>
                <WardMap />
            </div>
        </>
    )
}
