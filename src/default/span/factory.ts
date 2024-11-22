import { InlinerParseFactory, StrFactory } from '@/core/factory';
import { Range, tryRange } from '@/util/range';
import { Span } from './node';

const startDelim = '<<';
const endDelim = '>>';

export class SpanParser extends InlinerParseFactory<Span>
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

    async parseProduct(strInliner: string): Promise<Span>
    {
        const span = new Span;
        span.content.setNodes(await this.parser.parseInliners(strInliner.slice(startDelim.length, -1 * endDelim.length)));

        return span;
    }
}

export class SpanStr extends StrFactory<Span>
{
    stringify(node: Span): string
    {
        return startDelim + this.stringifier.stringify(node.content) + endDelim;
    }
}