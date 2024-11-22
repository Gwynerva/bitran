import { InlinerGroupNode } from "@/core/dom/group";
import { Block } from "@/core/dom/product";
import { paragraphName } from '.';

export class Paragraph extends Block
{
    name = paragraphName;

    content = new InlinerGroupNode(this);

    get children()
    {
        return [this.content];
    }
}