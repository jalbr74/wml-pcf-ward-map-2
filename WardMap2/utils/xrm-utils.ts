import { map, Observable, of } from "rxjs";
import {CategoryDto} from "../models/category";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import { HomeDto } from "../models/home";
import { ContactDto } from "../models/contact";

export function retrieveAllCategories(): Observable<CategoryDto[]> {
    return fromPromise(
        Xrm.WebApi.retrieveMultipleRecords('jda_category', '?$select=jda_name,jda_categoryid&$orderby=jda_name asc')
    ).pipe(
        map(response => response.entities.map(
            entity => ({
                id: entity['jda_categoryid'],
                name: entity['jda_name']
            })
        ))
    );
}

export function retrieveAddressesMatchingCategory(categoryId: string): Observable<string[]> {
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

    return fromPromise(
        Xrm.WebApi.retrieveMultipleRecords('jda_home_jda_category', `?fetchXml=${fetchXml}`)
    ).pipe(
        map(response => {
            const uniqueAddresses = new Set<string>();
            response.entities.forEach(entity => uniqueAddresses.add(entity['home.jda_name']));

            return Array.from(uniqueAddresses);
        })
    );
}

export function retrieveHomeInfo(address: string | undefined): Observable<HomeDto | undefined> {
    if (!address) return of(undefined);

    return fromPromise(
        Xrm.WebApi.retrieveMultipleRecords('jda_home', `?$select=jda_name,jda_notes&$filter=jda_name eq '${address}'`)
    ).pipe(
        map(response => {
            if (response.entities.length < 1) return;

            const homeEntity = response.entities[0];

            return {
                id: homeEntity['jda_homeid'],
                name: homeEntity['jda_name'],
                notes: homeEntity['jda_notes'] ?? ''
            };
        })
    );
}

export function retrieveContactsForHome(address: string | undefined): Observable<ContactDto[]> {
    console.log(`Retrieving contacts for home at address: ${address}`);

    if (!address) return of([]);

    const fetchXml = `
      <fetch>
        <entity name="contact">
          <attribute name="fullname" />
          <attribute name="jda_notes" />
          <link-entity name="jda_home" from="jda_homeid" to="jda_home" link-type="inner" alias="home">
            <filter>
              <condition attribute="jda_name" operator="eq" value="${address}" />
            </filter>
          </link-entity>
        </entity>
      </fetch>
    `;

    return fromPromise(
        Xrm.WebApi.retrieveMultipleRecords('contact', `?fetchXml=${fetchXml}`)
    ).pipe(
        map(response => {
            const contacts: ContactDto[] = [];

            response.entities.forEach(entity => {
                contacts.push({
                    id: entity['contactid'],
                    name: entity['fullname'],
                    notes: entity['jda_notes'] ?? ''
                });
            });

            return contacts;
        })
    );
}