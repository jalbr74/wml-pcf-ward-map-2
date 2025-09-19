import {ComponentStore} from "use-component-store";
import {OptionOnSelectData, SelectionEvents} from "@fluentui/react-combobox";
import {CategoryDto} from "../models/category";

export interface AppState {
    selectedAddresses: string[];
    availableCategories: CategoryDto[];
    selectedCategory?: CategoryDto;
    isLoadingCategories?: boolean;
    isLoadingSelectedHouses?: boolean;
}

export class AppStore extends ComponentStore<AppState> {
    constructor() {
        super({
            selectedAddresses: ["214 S 650 W", "211 S 650 W"],
            availableCategories: [
                { id: '5643d23f-4016-4155-8754-8ff8f9eef270', name: 'Less Active Fellowshipping Opportunities' },
                { id: '087ad21a-70a5-4e4f-a28b-8c5c17eea22e', name: 'New Move Ins' },
                { id: '397aacbc-e1a0-469e-b128-01ad2cdfd864', name: 'Part Member Families' },
                { id: '4b3511ba-b51c-4171-87af-2dc2f21c68b4', name: 'Potential Missionary Opportunities' },
                { id: '84591b3a-bfc3-4cf1-b3b0-fb689532a15e', name: 'Recent Converts' },
                { id: '8e03e2e4-2846-4483-9243-ca4df0bc4784', name: 'Unbaptized Youth' },
                { id: 'fad7d5e9-8505-426c-92e9-0b48fffad03c', name: 'Ward Leadership' },
                { id: 'ebe4634f-ffb4-4d96-b954-0cf67ee7dab7', name: 'Ward Members' },
            ],
        });
    }

    init(): void {

    }

    changeSelection(event: SelectionEvents, data: OptionOnSelectData) {
        console.log('event: %O', event);
        console.log('data: %O', data);

        this.patchState({
            selectedAddresses: ['571 W 300 N'],
            selectedCategory: {
                id: data.optionValue ?? '',
                name: data.optionText ?? ''
            }
        });
    }

    selectHouse(address: string) {
        this.patchState({
            selectedAddresses: [address]
        });
    }
}
