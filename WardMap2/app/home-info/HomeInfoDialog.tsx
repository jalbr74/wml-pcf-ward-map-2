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
import { Dismiss24Regular } from "@fluentui/react-icons";
// import {useComponentStore} from "use-component-store";
import {HomeInfoDialogState, HomeInfoDialogStore} from "./HomeInfoDialog.store";
import { useComponentStore } from "use-component-store";

interface HomeInfoProps {
    address: string,
    onDialogDismissed?: () => void
}

export function HomeInfoDialog({address, onDialogDismissed}: HomeInfoProps) {
    const [state, store] = useComponentStore(() => new HomeInfoDialogStore(address));

    return (
        <Dialog open={true}>
            <DialogSurface className={styles.fullWidthSurface}>
                <DialogBody>
                    <DialogTitle action={
                        <Button appearance="subtle" aria-label="close" icon={<Dismiss24Regular />}
                            onClick={() => onDialogDismissed?.()}
                        />
                    }>{state.address}</DialogTitle>
                    <DialogContent className={styles.dialogContent}>
                        <h3>Notes</h3>
                        <div>{state.notes}</div>
                        <h3>Contacts</h3>
                        {state.contacts.map((contact, index) => (
                            <div key={index}>{contact.name} - {contact.notes}</div>
                        ))}
                    </DialogContent>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
