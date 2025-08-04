import styles from './HelloWorld.module.css';

import * as React from 'react';
import {Label} from '@fluentui/react-components';

export interface IHelloWorldProps {
    name?: string;
}

export function HelloWorld(props: IHelloWorldProps): React.JSX.Element {
    return (
        <Label className={styles.myLabel}>
            Hello {props.name}
        </Label>
    )
}
