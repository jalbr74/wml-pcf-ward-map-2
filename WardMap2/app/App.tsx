import styles from './App.module.css';

import * as React from 'react';
import {useCallback, useEffect, useRef} from "react";
import {useComponentStore} from "use-component-store";
import {AppState, AppStore} from "./App.store";

import WardMap from '!@svgr/webpack!./ward-map/ward-map.svg';
import {highlightSelectedAddresses} from "./app-utils";
import {Combobox, Dropdown, Label, Option} from "@fluentui/react-components";

export function App(): React.JSX.Element {
    const mapContentRef = useRef<HTMLDivElement>(null);
    const [state, store] = useComponentStore<AppState, AppStore>(AppStore, () => {
        store.init();
    });

    useEffect(() => highlightSelectedAddresses(mapContentRef, state.selectedAddresses), [state.selectedAddresses]);

    // One stable handler; we’ll attach it once.
    const onSvgClick = useCallback((e: React.MouseEvent) => {
        const target = e.target as Element | null;
        if (!target) return;

        const house = target.closest<SVGGElement>("g[data-name]");
        if (!house) return;

        const address = house.getAttribute("data-name") ?? "";
        if (!/\d/.test(address)) return; // The address must contain at least one digit

        store.selectHouse(address);
    }, []);

    return (
        <div className={styles.appContainer}>
            <div className={styles.mapHeader}>
                <Label>Category of Focus:</Label>
                <Dropdown value={state.selectedCategory?.name ?? "Select one..."}
                    onOptionSelect={(event, data) => store.changeSelection(event, data)}>
                    {state.availableCategories.map(category =>
                        <Option key={category.id} value={category.id}>{category.name}</Option>
                    )}
                </Dropdown>
            </div>
            <div ref={mapContentRef} className={styles.mapContent}>
                <WardMap onClick={onSvgClick} />
            </div>
        </div>
    )
}
