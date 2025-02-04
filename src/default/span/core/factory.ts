import { InlinerParseFactory, ProductStrFactory } from '@process/factory';
import { InlinersNode } from '@default/groups';
import { type Range, tryRange } from '@util/range';

import { SpanType } from '../shared';

const startDelim = '<<';
const endDelim = '>>';

export class SpanParser extends InlinerParseFactory<SpanType>
{
    private startDelim = startDelim;
    private endDelim = endDelim;

    outlineRanges(text: string)
    {
        const ranges: Range[] = [];

        let regexp = new RegExp(`${this.startDelim}|${this.endDelim}`, 'g');
        let openCount = 0;
        let cursor = 0;

        for (const match of text.matchAll(regexp))
        {
            const offset = match.index;
            const openMatch = match[0] === this.startDelim;

            // Just random closing delimiter out of nowhere
            if (openCount === 0 && !openMatch)
                continue;

            // Opening span group
            if (openMatch)
            {
                // Opened "root"-level span group
                if (openCount === 0)
                    cursor = offset + this.startDelim.length;

                openCount++;
            }

            // Closing span group
            if (!openMatch)
            {
                openCount--;

                // Closed "root"-level span group
                if (openCount === 0)
                {
                    const range = tryRange(cursor - this.startDelim.length, offset + this.endDelim.length);
                    if (range)
                        ranges.push(range);

                    cursor = offset + this.endDelim.length;
                }
            }
        }

        return ranges;
    }

    async createParseData(strInliner: string)
    {
        const strContent = strInliner.slice(startDelim.length, -1 * endDelim.length);
        return await this.parseInliners(strContent);
    }
}

export class SpanStr extends ProductStrFactory<SpanType>
{
    stringifyData(parseData: InlinersNode): string
    {
        return startDelim + this.stringify(parseData) + endDelim;
    }
}