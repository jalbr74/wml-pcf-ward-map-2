import styles from './App.module.css';

import * as React from 'react';
import {Label} from '@fluentui/react-components';
import {useComponentStore} from "use-component-store";
import {AppState, AppStore} from "./App.store";

export function App(): React.JSX.Element {
    const [state, store] = useComponentStore<AppState, AppStore>(AppStore);

    return (
        <Label className={styles.myLabel}>
            Message: {state.message}
        </Label>
    )
}
