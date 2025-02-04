export type Phrase = string | ((...args: any[]) => string);

export type FrontPhrase = (phraseKey: string, ...args: any[]) => string;

export type Language = Record<string, Phrase> & {};

export interface Languages
{
    [language: string]: () => Promise<Language>;
}

export function defineLanguage(language: Language)
{
    return language;
}

export function defineLanguages(languagesLoader: Record<string, () => Promise<{ default: Language }>>)
{
    const result: Languages = {};

    for (const [languageCode, languageLoader] of Object.entries(languagesLoader))
        result[languageCode] = async () => (await languageLoader()).default;

    return result;
}

export async function createPhrase(languageCode: string, languages: Languages, context?: string)
{
    let langData = {};

    const phrase = (phraseKey: string, ...args: any[]) => {
        const phrase = langData[phraseKey];

        if (!phrase)
            throw new Error(`Missing phrase "${phraseKey}" in language "${languageCode}"${context ? ` in context "${context}"` : ''}!`);

        if (typeof phrase === 'function')
            return phrase(...args);

        return phrase;
    }

    if (!languageCode)
        return phrase;

    if (!languages)
        return phrase;

    if (!languages[languageCode])
    {
        console.warn(`Language "${languageCode}" not supported${context ? ` in context "${context}"` : ''}!`);
        return phrase;
    }

    try
    {
        const actualLangData = await languages[languageCode]();
        langData = actualLangData;
    }
    catch (error)
    {
        console.warn(`Failed to load language "${languageCode}"${context ? ` in context "${context}"` : ''}!`);
    }

    return phrase;
}