export interface Category {
    id: string;
    name: string;
}

export interface CategoryDto {
    ['jda_categoryid']: string;
    ['jda_name']: string;
}

export interface HomeCategoryDto {
    ['home.jda_name']: string;
}