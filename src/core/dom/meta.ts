import YAML from 'yaml';
import { indent, textToObj, tryParseInt } from "@/util/str";

export interface ProductMeta
{
    id?: string;
    classes?: string[];
    [key: string]: any;
}

//
// Parse
//

export function detachMeta(textWithMeta: string): { meta?: ProductMeta, restText: string }
{
    const result = <ReturnType<typeof detachMeta>> {
        meta: {}
    }

    result.restText = textWithMeta.replace(/^{(.*)}\n|^{([\s\S]*?)^}\n/m, (match, lineMeta, complexMeta, offset) => {
        if (offset > 0 || match.length === textWithMeta.length)
            return match;

        result.meta = parseMeta(lineMeta ?? complexMeta);

        return '';
    });

    return result;
}

export function parseMeta(textMeta: string): ProductMeta
{
    return textMeta.includes('\n') ? textToObj(textMeta) : parseLineMeta(textMeta);
}

export function parseLineMeta(lineMeta: string): ProductMeta
{
    const meta = <ProductMeta> { classes: [] };

    for (const term of lineMeta.trim().split(/\s+/gm))
    {
        const firstSymbol = term.at(0);
        const restTerm = term.substring(1);

        switch (firstSymbol)
        {
            case '#':
                meta.id = restTerm;
                break;

            case '.':
                meta.classes.push(restTerm);
                break;

            case '+':
                meta[restTerm] = true;
                break;

            case '-':
                meta[restTerm] = false;
                break;

            default:
                const parts = term.split('=');
                const value = parts?.[1];
                meta[parts[0]] = typeof value === 'string' ? tryParseInt(value) : null;
                break;
        }
    }

    if (meta.classes.length === 0)
        delete meta.classes;

    return meta;
}

//
// Stringify
//

export function stringifyMeta(meta: ProductMeta, complexMetaAllowed: boolean)
{
    if (!meta)
        return '';

    let hasObjectProps = false;
    for (const [key, value] of Object.entries(meta))
    {
        if (key === 'id') continue;
        if (key === 'classes') continue;

        if (typeof value === 'object')
        {
            hasObjectProps = true;
            break;
        }
    }

    if (complexMetaAllowed && hasObjectProps)
    {
        // Complex meta output

        let output = indent(YAML.stringify(meta, null, 4));
            output = '{\n' + output + '}';

        return output;
    }
    else
    {
        // Line meta output

        let output = '';

        for (const [key, value] of Object.entries(meta))
        {
            if (key === 'id')
            {
                output += `#${value} `;
                continue;
            }

            if (key === 'classes')
            {
                output += meta.classes.map(item => `.${item}`).join(' ') + ' ';
                continue;
            }

            //

            if (typeof value === 'boolean')
            {
                output += `${value ? '+' : '-'}${key} `;
                continue;
            }

            if (typeof value === 'string')
            {
                let resultValue = value.replace(/(\s.+)/, '').trim();

                if (!resultValue)
                    continue;

                output += `${key}=${resultValue} `;
                continue;
            }

            if (typeof value === 'number')
            {
                output += `${key}=${value} `;
                continue;
            }
        }

        if (!output)
            return '';

        return `{ ${output}}`;
    }
}