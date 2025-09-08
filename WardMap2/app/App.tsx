import styles from './App.module.css';

import WardMap from '!@svgr/webpack!./ward-map/ward-map.svg';

import * as React from 'react';
import {Label} from '@fluentui/react-components';
import {useComponentStore} from "use-component-store";
import {AppState, AppStore} from "./App.store";

export function App(): React.JSX.Element {
    const [state, store] = useComponentStore<AppState, AppStore>(AppStore);

    return (
        <>
            {/*<style>{`*/}
            {/*    g:is(*/}
            {/*        #_214-S-650-W,*/}
            {/*        #_213-S-650-W,*/}
            {/*        #_644-W-300-S,*/}
            {/*        #_208-S-700-W*/}
            {/*     ) > rect {*/}
            {/*        fill: lightgreen !important;*/}
            {/*    }*/}
            {/*`}</style>*/}

            <WardMap />
        </>
    )
}
