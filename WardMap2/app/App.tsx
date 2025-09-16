import styles from './App.module.css';

import * as React from 'react';
import {useEffect, useRef} from "react";
import {useComponentStore} from "use-component-store";
import {AppState, AppStore} from "./App.store";

import WardMap from '!@svgr/webpack!./ward-map/ward-map.svg';

export function App(): React.JSX.Element {
    const [state, store] = useComponentStore<AppState, AppStore>(AppStore);
    const mapContentRef = useRef<HTMLDivElement>(null);

    useEffect(highlightSelectedAddresses(mapContentRef, state), [state.addresses]);

    return (
        <div className={styles.appContainer}>
            <div className={styles.mapHeader}>
                <button onClick={() => store.changeSelection()}>Change Selection</button>
            </div>
            <div ref={mapContentRef} className={styles.mapContent}>
                <WardMap />
            </div>
        </div>
    )
}

function highlightSelectedAddresses(wrapperRef: React.MutableRefObject<HTMLDivElement | null>, state: AppState) {
    return () => {
        const root = wrapperRef.current;
        if (!root) return;

        // Clear previous selection
        root.querySelectorAll(".is-selected").forEach(el => el.classList.remove("is-selected"));

        // Add selection
        state.addresses.forEach(name => {
            const sel = `path[data-name="${name}"]`;
            root.querySelectorAll(sel).forEach(el => el.classList.add("is-selected"));
        });
    };
}
