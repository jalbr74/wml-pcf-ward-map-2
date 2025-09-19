import {AppState} from "./App.store";

export function highlightSelectedAddresses(wrapperRef: React.MutableRefObject<HTMLDivElement | null>, selectedAddresses: string[]) {
    const root = wrapperRef.current;
    if (!root) return;

    // Clear previous selection
    root.querySelectorAll(".is-selected").forEach(el => el.classList.remove("is-selected"));

    // Add selection
    selectedAddresses.forEach(name => {
        const sel = `g[data-name="${name}"] path`;
        root.querySelectorAll(sel).forEach(el => el.classList.add("is-selected"));
    });
}

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