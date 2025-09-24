import styles from './HomeInfoDialog.module.css';
import * as React from "react";
import {
    Button,
    Dialog, DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger
} from "@fluentui/react-components";
import {useComponentStore} from "use-component-store";
import {HomeInfoDialogState, HomeInfoDialogStore} from "./HomeInfoDialog.store";

interface HomeInfoProps {
    address?: string,
    onDialogDismissed?: () => void
}

export function HomeInfoDialog({address, onDialogDismissed}: HomeInfoProps) {
    const [state, store] = useComponentStore(HomeInfoDialogStore);

    return (
        <Dialog open={true}>
            <DialogSurface className={styles.fullWidthSurface}>
                <DialogBody>
                    <DialogTitle>Dialog title</DialogTitle>
                    <DialogContent>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
                        exercitationem cumque repellendus eaque est dolor eius expedita
                        nulla ullam? Tenetur reprehenderit aut voluptatum impedit voluptates
                        in natus iure cumque eaque?
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="secondary" onClick={() => onDialogDismissed?.()}>Close</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
