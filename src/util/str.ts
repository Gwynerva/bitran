import YAML from 'yaml';

export function normalizeText(text: string)
{
    if (!text)
        return text;

    // Remove Windows carriage returns
    text = text.replace(/\r/gm, '');

    return text;
}

export function textToStrBlocks(text: string)
{
    if (!text) return [];
    return text.trim().split(/\n^\s*\n(?! |\n|})/gm);
}

export function splitFirstLine(text: string)
{
    const parts = text.split('\n');

    return {
        firstLine: parts[0],
        restText: parts.slice(1).join('\n')
    }
}

export function textToObj(text: string): object
{
    const fallback = {};

    try {
        const obj = YAML.parse(text);
        return Object.getPrototypeOf(obj) === Object.prototype ? obj : fallback;
    }
    catch {
        return fallback;
    }
}

export function indent(text: string, indentSize = 4): string
{
    return text.replace(/^(.+)$/gm, (match, group) => {
        return group.trim() ? ' '.repeat(indentSize) + group : match;
    });
}

export function tryParseInt(text: string)
{
    const parsedInt = parseInt(text);
    return Number.isNaN(parsedInt) ? text : parsedInt;
}