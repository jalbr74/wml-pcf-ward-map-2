import styles from './App.module.css';

import * as React from 'react';
import {useEffect, useRef} from "react";
import {useComponentStore} from "use-component-store";
import {AppState, AppStore} from "./App.store";

import WardMap from '!@svgr/webpack!./ward-map/ward-map.svg';
import { Dropdown, Label, Option} from "@fluentui/react-components";

export function App(): React.JSX.Element {
    const mapContentRef = useRef<HTMLDivElement>(null);
    const [state, store] = useComponentStore<AppState, AppStore>(AppStore, () => {
        store.init();
    });

    useEffect(() => highlightSelectedAddresses(mapContentRef, state.selectedAddresses), [state.selectedAddresses]);

    return (
        <div className={styles.appContainer}>
            <div className={styles.mapHeader}>
                <Label>Category of Focus:</Label>
                <Dropdown value={state.selectedCategory?.name ?? "Select one..."}
                    onOptionSelect={(event, data) => store.handleCategorySelected(event, data)}>
                    {state.availableCategories.map(category =>
                        <Option key={category.id} value={category.id}>{category.name}</Option>
                    )}
                </Dropdown>
            </div>
            <div ref={mapContentRef} className={styles.mapContent}>
                <WardMap onClick={(e: React.MouseEvent) => handleHouseClicked(e.target as Element, store)} />
            </div>
        </div>
    )
}

//
// Pure functions to support the component logic
//

function highlightSelectedAddresses(wrapperRef: React.MutableRefObject<HTMLDivElement | null>, selectedAddresses: string[]) {
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

function handleHouseClicked(target: Element, store: AppStore) {
    if (!target) return;

    const house = target.closest<SVGGElement>("g[data-name]");
    if (!house) return;

    const address = house.getAttribute("data-name") ?? "";
    if (!/\d/.test(address)) return; // The address must contain at least one digit

    store.selectHouse(address);
}
