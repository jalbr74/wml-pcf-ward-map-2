import {ComponentStore} from "use-component-store";
import { retrieveContactsForHome, retrieveHomeInfo } from "../../utils/xrm-utils";
import { catchError, combineLatest, EMPTY, of, switchMap, tap } from "rxjs";
import { Contact } from "../../models/contact";

export interface HomeInfoDialogState {
    address?: string;
    notes?: string;
    contacts: Contact[]
}

export class HomeInfoDialogStore extends ComponentStore<HomeInfoDialogState> {
    constructor(private address: string) {
        super({
            contacts: [],
            address
        });
    }

    init() {
        console.log(`Initializing HomeInfoDialogStore for address: ${this.address}`);

        this.fetchHomeInfo();
    }

    fetchHomeInfo = this.effect<void>($origin => $origin
        .pipe(
            switchMap(() => combineLatest([
                retrieveHomeInfo(this.address),
                retrieveContactsForHome(this.address)
            ]).pipe(
                tap({
                    next: ([home, contacts]) => {
                        this.patchState({
                            notes: home?.notes,
                            contacts
                        });
                    },
                    error: (e) => console.error(e),
                }),
                catchError((error) => EMPTY)
            ))
        )
    );
}
