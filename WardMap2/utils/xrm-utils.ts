import { Category, CategoryDto, HomeCategoryDto } from "../models/category";
import { HomeDto } from "../models/home";

export async function retrieveAllCategories(): Promise<Category[]> {
    const result = await Xrm.WebApi.retrieveMultipleRecords(
        'jda_category', '?$select=jda_name,jda_categoryid&$orderby=jda_name asc');

    return result.entities.map(
        (categoryDto: CategoryDto) => ({
            id: categoryDto.jda_categoryid,
            name: categoryDto.jda_name
        })
    );
}

export async function retrieveAddressesMatchingCategory(categoryId: string): Promise<string[]> {
    const fetchXml = `
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

    const response = await Xrm.WebApi.retrieveMultipleRecords('jda_home_jda_category', `?fetchXml=${fetchXml}`);

    const uniqueAddresses = new Set<string>();
    response.entities.forEach((entity: HomeCategoryDto) => uniqueAddresses.add(entity['home.jda_name']));

    return Array.from(uniqueAddresses);
}

export async function retrieveHomeId(address: string | undefined): Promise<string | undefined> {
    if (!address) return Promise.resolve(undefined);

    const result = await Xrm.WebApi.retrieveMultipleRecords<HomeDto>('jda_home', `?$select=jda_name&$filter=jda_name eq '${address}'`);

    if (result.entities.length < 1) return undefined;

    return result.entities[0].jda_homeid;
}
