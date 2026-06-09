import * as styles from './App.module.css';

import * as React from 'react';
import { useEffect, useRef } from "react";
import { useComponentStore } from "use-component-store";
import { AppStore } from "./App.store";

import WardMap from '!@svgr/webpack!./ward-map/ward-map.svg';
import { Dropdown, Label, Option } from "@fluentui/react-components";
import { OptionOnSelectData, SelectionEvents } from "@fluentui/react-combobox";

// TODO: Maybe we just open the Home form when a home is clicked, instead of building a custom dialog? It would be less work and would allow users to edit the home record directly.

export function App(): React.JSX.Element {
    const [state, store] = useComponentStore(AppStore);
    const mapContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => highlightSelectedAddresses(mapContentRef, state.highlightedAddresses), [state.highlightedAddresses]);

    function onDropdownClick(e: SelectionEvents, data: OptionOnSelectData) {
        store.handleCategorySelected(data).catch(console.error);
    }

    function onMapClick(e: React.MouseEvent) {
        handleHouseClicked(e.target as Element, store).catch(console.error);
    }

    return (
        <>
            <div className={styles.appContainer}>
                <div className={styles.mapHeader}>
                    <Label>Category of Focus:</Label>
                    <Dropdown value={state.selectedCategory?.name ?? "Select one..."} onOptionSelect={onDropdownClick}>
                        {state.availableCategories.map(category =>
                            <Option key={category.id} value={category.id}>{category.name}</Option>
                        )}
                    </Dropdown>
                </div>
                <div ref={mapContentRef} className={styles.mapContent}>
                    <WardMap onClick={onMapClick}/>
                </div>
            </div>
        </>
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

async function handleHouseClicked(target: Element, store: AppStore) {
    if (!target) return;

    const house = target.closest<SVGGElement>("g[data-name]");
    if (!house) return;

    const address = house.getAttribute("data-name") ?? "";
    if (!/\d/.test(address)) return; // The address must contain at least one digit

    await store.showHouseInfo(address);
}
