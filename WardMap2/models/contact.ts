export interface Contact {
    id: string;
    name: string;
    notes: string;
}

export interface ContactDto {
    ['contactid']: string;
    ['fullname']: string;
    ['jda_notes']?: string;
}
