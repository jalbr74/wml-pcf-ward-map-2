import { ComponentStore } from "use-component-store";
import { OptionOnSelectData, SelectionEvents } from "@fluentui/react-combobox";
import { CategoryDto } from "../models/category";
import { catchError, EMPTY, switchMap, tap } from "rxjs";
import { retrieveAddressesMatchingCategory, retrieveAllCategories } from "../utils/xrm-utils";

export interface AppState {
    highlightedAddresses: string[];
    openedAddress?: string;
    availableCategories: CategoryDto[];
    selectedCategory?: CategoryDto;
    isLoadingCategories?: boolean;
    isLoadingSelectedHouses?: boolean;
}

export class AppStore extends ComponentStore<AppState> {
    constructor() {
        super({
            highlightedAddresses: [],
            availableCategories: [],
        });
    }

    init(): void {
        this.fetchCategories();
    }

    handleCategorySelected(event: SelectionEvents, data: OptionOnSelectData) {
        this.fetchHousesForCategory({
            id: data.optionValue ?? '',
            name: data.optionText ?? ''
        });
    }

    fetchHousesForCategory = this.effect<CategoryDto>(origin$ => origin$
        .pipe(
            tap((category: CategoryDto) => {
                this.patchState({
                    highlightedAddresses: [],
                    selectedCategory: category,
                    isLoadingSelectedHouses: true
                });
            }),
            switchMap((category: CategoryDto) => retrieveAddressesMatchingCategory(category.id)
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

    showHouseInfo(address: string) {
        this.patchState({
            openedAddress: address
        });
    }

    hideHouseInfo() {
        this.patchState({
            openedAddress: undefined
        });
    }
}
