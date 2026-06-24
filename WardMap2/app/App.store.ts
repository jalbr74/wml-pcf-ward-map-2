import { ComponentStore } from "use-component-store";
import { OptionOnSelectData, SelectionEvents } from "@fluentui/react-combobox";
import { Category } from "../models/category";
import { retrieveAddressesMatchingCategory, retrieveAllCategories, retrieveHomeId } from "../utils/xrm-utils";
import { HomeDto } from "../models/home";

export interface AppState {
    highlightedAddresses: string[];
    availableCategories: Category[];
    availableAddresses: string[];
    selectedCategory?: Category;
}

export class AppStore extends ComponentStore<AppState> {
    constructor() {
        super({
            highlightedAddresses: [],
            availableCategories: [],
            availableAddresses: []
        });
    }

    init() {
        Promise.allSettled([
            this.fetchCategories(),
            this.fetchAddresses()
        ]).catch(error => console.error("Error initializing AppStore:", error));
    }

    async handleCategorySelected(data: OptionOnSelectData) {
        const category = this.state.availableCategories.find(c => c.id === data.optionValue);
        if (!category) return;

        Xrm.Utility.showProgressIndicator("Loading...");

        this.patchState({
            highlightedAddresses: [],
            selectedCategory: category
        });

        try {
            const addresses = await retrieveAddressesMatchingCategory(category.id);
            this.patchState({
                highlightedAddresses: addresses
            });
        }
        finally {
            Xrm.Utility.closeProgressIndicator();
        }
    }

    async fetchCategories() {
        const categories = await retrieveAllCategories();
        this.patchState({
            availableCategories: categories
        });
    }

    async fetchAddresses() {
        const homes = await Xrm.WebApi.retrieveMultipleRecords('jda_home', '?$select=jda_name');
        const allKnownAddresses = homes.entities.map((homeDto: HomeDto) => homeDto.jda_name);
        const sortedAddresses = allKnownAddresses.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

        this.patchState({
            availableAddresses: sortedAddresses
        });
    }

    async showHouseInfo(address: string) {
        if (!/\d/.test(address)) return; // The address must contain at least one digit

        Xrm.Utility.showProgressIndicator("Loading...");

        const homeId = await retrieveHomeId(address);
        if (!homeId) return;

        console.log(`Opening form for home with address: ${address} and ID: ${homeId}`);

        Xrm.Utility.closeProgressIndicator();

        await Xrm.Navigation.navigateTo({
            pageType: "entityrecord",
            entityName: "jda_home",
            formId: "9d12b8f7-3b64-4aae-ab31-f969c91e74e9",
            entityId: homeId
        }, {
            target: 2, // Open in a dialog
            width: { value: 100, unit: "%" },
            height: { value: 100, unit: "%" }
        });
    }

    highlightSelectedAddresses(highlightedAddresses: string[]) {
        this.patchState({ highlightedAddresses });
    }
}
