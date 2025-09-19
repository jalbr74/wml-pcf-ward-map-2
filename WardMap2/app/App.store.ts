import {ComponentStore} from "use-component-store";
import {OptionOnSelectData, SelectionEvents} from "@fluentui/react-combobox";
import {CategoryDto} from "../models/category";
import {map, switchMap, tap} from "rxjs";
import {fetchXmlForAllHousesMatchingCategory} from "./app-utils";
import {fromPromise} from "rxjs/internal/observable/innerFrom";

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
            selectedAddresses: [],
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

    fetchHousesForCategory = this.effect<CategoryDto>(
        origin$ => origin$
            .pipe(
                tap((category: CategoryDto) => {
                    this.patchState({
                        selectedAddresses: [],
                        selectedCategory: category,
                        isLoadingSelectedHouses: true
                    });
                }),
                switchMap((category: CategoryDto) =>
                    fromPromise(
                        Xrm.WebApi.retrieveMultipleRecords('jda_home_jda_category', `?fetchXml=${fetchXmlForAllHousesMatchingCategory(category.id)}`)
                    ).pipe(
                        tap((houses) => {
                            console.log('houses', houses);

                            const uniqueAddresses = new Set<string>();

                            houses.entities.forEach(entity => uniqueAddresses.add(entity['home.jda_name']));

                            const addresses = Array.from(uniqueAddresses);

                            this.patchState({
                                selectedAddresses: addresses,
                                isLoadingSelectedHouses: false
                            });
                        })
                    )
                )
            )
    );

    handleHouseClicked(e: React.MouseEvent) {
        const target = e.target as Element;
        if (!target) return;

        const house = target.closest<SVGGElement>("g[data-name]");
        if (!house) return;

        const address = house.getAttribute("data-name") ?? "";
        if (!/\d/.test(address)) return; // The address must contain at least one digit

        this.patchState({
            selectedAddresses: [address]
        });
    }

    fetchCategories = this.effect<void>(
        origin$ => origin$.pipe(
            tap(() => this.patchState({ isLoadingCategories: true })),
            switchMap(() =>
                Xrm.WebApi.retrieveMultipleRecords('jda_category', '?$select=jda_name,jda_categoryid&$orderby=jda_name asc')
            ),
            tap((response) => {
                const categories = response.entities.map(
                    entity => ({
                        id: entity['jda_categoryid'],
                        name: entity['jda_name']
                    })
                );

                this.patchState({
                    availableCategories: categories,
                    isLoadingCategories: false
                });
            })
        )
    );
}
