import {ComponentStore} from "use-component-store";

export interface AppState {
    addresses: string[];
}

export class AppStore extends ComponentStore<AppState> {
    constructor() {
        super({
            addresses: ["214 S 650 W", "211 S 650 W"]
        });
    }

    changeSelection() {
        this.patchState({
            addresses: ['571 W 300 N']
        });
    }
}
