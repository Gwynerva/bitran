import { GroupNode } from '@dom/group';
import { Node } from '@dom/node';

abstract class ProductsNode extends GroupNode
{
    constructor(parent: Node)
    {
        super(parent); // Require parent for products groups making it impossible to forget adding parent
    }
}

export const blocksName = '_blocks';
export const inlinersName = '_inliners';

export class BlocksNode extends ProductsNode { name = blocksName; }
export class InlinersNode extends ProductsNode { name = inlinersName; }