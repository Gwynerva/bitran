import { editorName } from '.';
import { Block } from '@/core/dom/product';
import { BlockGroupNode } from '@/core/dom/group';

export class Editor extends Block
{
    name = editorName;

    src: string;
    content = new BlockGroupNode(this);

    get children()
    {
        return [this.content];
    }
}