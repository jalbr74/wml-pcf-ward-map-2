import styles from './App.module.css';

import * as React from 'react';
import {useEffect, useRef} from "react";
import {useComponentStore} from "use-component-store";
import {AppState, AppStore} from "./App.store";

import WardMap from '!@svgr/webpack!./ward-map/ward-map.svg';
import {highlightSelectedAddresses} from "./app-utils";
import {Combobox, Dropdown, Label, Option} from "@fluentui/react-components";

export function App(): React.JSX.Element {
    const [state, store] = useComponentStore<AppState, AppStore>(AppStore);
    const mapContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => highlightSelectedAddresses(mapContentRef, state), [state.selectedAddresses]);

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
                <WardMap />
            </div>
        </div>
    )
}
