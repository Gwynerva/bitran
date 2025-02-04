import { defineProductCore } from '@core/product';
import { BlockNode } from '@dom/productNode';

import { ParagraphParser, ParagraphStr } from './factory';
import { paragraphName, ParagraphType } from '../shared';

export class ParagraphNode extends BlockNode<ParagraphType>
{
    name = paragraphName;

    get children()
    {
        return [this.parseData];
    }
}

export const paragraph = defineProductCore<ParagraphType>({
    Node: ParagraphNode,
    Parser: ParagraphParser,
    Stringifier: ParagraphStr,
});