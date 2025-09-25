import {ComponentStore} from "use-component-store";
import { retrieveHomeInfo } from "../../utils/xrm-utils";
import { catchError, combineLatest, EMPTY, switchMap, tap } from "rxjs";


export interface HomeInfoDialogState {
    address?: string;
    notes?: string;
}

export class HomeInfoDialogStore extends ComponentStore<HomeInfoDialogState> {
    constructor(private address: string | undefined) {
        super({
            address
        });
    }

    init() {
        this.fetchHomeInfo();
    }

    fetchHomeInfo = this.effect($origin => $origin
        .pipe(
            switchMap(() => combineLatest([
                retrieveHomeInfo(this.address)
            ]).pipe(
                tap({
                    next: ([home]) => {
                        this.patchState({
                            notes: home?.notes
                        });
                    },
                    error: (e) => console.error(e),
                }),
                catchError((error) => EMPTY)
            ))
        )
    );
}
