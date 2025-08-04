import {ComponentStore} from "use-component-store";

export interface AppState {
    message: string;
}

export class AppStore extends ComponentStore<AppState> {
    constructor() {
        super({
            message: 'Hello World!'
        });
    }
}
