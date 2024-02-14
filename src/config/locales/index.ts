import { en } from './en';

const data: any = {
    en,
};

export const locale = (key: string, language = 'en') => data[language][key];

