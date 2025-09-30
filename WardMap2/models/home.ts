export interface Home {
    id: string;
    name: string;
    notes: string;
}

export interface HomeDto {
    ['jda_homeid']: string;
    ['jda_name']: string;
    ['jda_notes']: string;
}