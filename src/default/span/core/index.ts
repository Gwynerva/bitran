import { defineProductCore } from '@core/product';
import { InlinerNode } from '@dom/productNode';

import { spanName, SpanType } from '../shared';
import { SpanParser, SpanStr } from './factory';

export class SpanNode extends InlinerNode<SpanType>
{
    name = spanName;

    get children()
    {
        return [this.parseData];
    }
}

export const span = defineProductCore<SpanType>({
    Node: SpanNode,
    Parser: SpanParser,
    Stringifier: SpanStr,
});