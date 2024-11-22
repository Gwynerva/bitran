import { InlinerGroupNode } from '@/core/dom/group';
import { Inliner } from '@/core/dom/product';
import { spanName } from '.';

export class Span extends Inliner
{
    name = spanName
    content = new InlinerGroupNode(this);

    get children()
    {
        return [this.content];
    }
}