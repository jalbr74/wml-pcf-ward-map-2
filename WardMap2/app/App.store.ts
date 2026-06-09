import { ComponentStore } from "use-component-store";
import { OptionOnSelectData, SelectionEvents } from "@fluentui/react-combobox";
import { Category } from "../models/category";
import { catchError, EMPTY, switchMap, tap } from "rxjs";
import { retrieveAddressesMatchingCategory, retrieveAllCategories, retrieveHomeId } from "../utils/xrm-utils";
import { HomeDto } from "../models/home";

export interface AppState {
    highlightedAddresses: string[];
    availableCategories: Category[];
    availableAddresses: string[];
    selectedCategory?: Category;
    isLoadingCategories?: boolean;
    isLoadingSelectedHouses?: boolean;
}

export class AppStore extends ComponentStore<AppState> {
    constructor() {
        super({
            highlightedAddresses: [],
            availableCategories: [],
            availableAddresses: []
        });
    }

    async init(): Promise<void> {
        this.fetchCategories();
        await this.fetchAddresses();
    }

    handleCategorySelected(event: SelectionEvents, data: OptionOnSelectData) {
        this.fetchHousesForCategory({
            id: data.optionValue ?? '',
            name: data.optionText ?? ''
        });
    }

    fetchHousesForCategory = this.effect<Category>(origin$ => origin$
        .pipe(
            tap((category: Category) => {
                this.patchState({
                    highlightedAddresses: [],
                    selectedCategory: category,
                    isLoadingSelectedHouses: true
                });
            }),
            switchMap((category: Category) => retrieveAddressesMatchingCategory(category.id)
                .pipe(
                    tap({
                        next: (addresses) => {
                            this.patchState({
                                highlightedAddresses: addresses,
                                isLoadingSelectedHouses: false
                            });
                        },

                        error: (e) => {
                            this.patchState({ isLoadingSelectedHouses: false });
                            console.error(e);
                        },
                    }),
                    catchError((error) => EMPTY)
                )
            )
        )
    );

    fetchCategories = this.effect<void>(origin$ => origin$
        .pipe(
            tap(() => this.patchState({ isLoadingCategories: true })),
            switchMap(() => retrieveAllCategories()
                .pipe(
                    tap({
                        next: (categories) => {
                            this.patchState({
                                availableCategories: categories,
                                isLoadingCategories: false
                            });
                        },
                        error: (e) => {
                            this.patchState({ isLoadingCategories: false });

                            console.error(e)
                        },
                    }),
                    catchError((error) => EMPTY)
                )
            )
        )
    );

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

        Xrm.Utility.showProgressIndicator("Loading home information...");

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
}
