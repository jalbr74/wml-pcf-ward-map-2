import {ComponentStore} from "use-component-store";
import {OptionOnSelectData, SelectionEvents} from "@fluentui/react-combobox";
import {CategoryDto} from "../models/category";
import {map, switchMap, tap} from "rxjs";
import {fromPromise} from "rxjs/internal/observable/innerFrom";

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

    fetchHousesForCategory = this.effect<CategoryDto>(
        origin$ => origin$
            .pipe(
                tap((category: CategoryDto) => {
                    this.patchState({
                        highlightedAddresses: [],
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
                                highlightedAddresses: addresses,
                                isLoadingSelectedHouses: false
                            });
                        })
                    )
                )
            )
    );

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

//
// Pure functions to support the store logic
//

export function fetchXmlForAllHousesMatchingCategory(categoryId: string): string {
    return `
    <fetch>
      <entity name='jda_home_jda_category'>
        <attribute name='jda_categoryid' />
        <attribute name='jda_homeid' />
        <filter>
          <condition attribute='jda_categoryid' operator='eq' value='${categoryId}' />
        </filter>
        <link-entity name='jda_home' from='jda_homeid' to='jda_homeid' link-type='inner' alias='home'>
          <attribute name='jda_name' />
        </link-entity>
      </entity>
    </fetch>
    `;
}
