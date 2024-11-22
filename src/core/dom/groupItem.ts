import { Node } from "./node";
import { GroupNode } from "./group";
import { BitranDomError } from "./error";

export function assumeGroupItem(node: Node)
{
    return new GroupItem(node);
}

export class GroupItem
{
    node: Node;
    group: GroupNode;

    constructor(node: Node)
    {
        if (!node.parent || !(node.parent instanceof GroupNode))
            throw new BitranDomError(`Can't create GroupItem from given node! Given node is not a child of any GroupNode!`);

        this.node = node;
        this.group = node.parent;
    }

    //
    // Operations
    //

    detach()
    {
        this.group.detach(this.node);
    }

    before(...beforeNodes: Node[])
    {
        this.group.before(this.node, ...beforeNodes);
    }

    after(...afterNodes: Node[])
    {
        this.group.after(this.node, ...afterNodes);
    }

    replace(...withNodes: Node[])
    {
        this.group.replace(this.node, ...withNodes);
    }

    move(toNode: Node, before: boolean = false)
    {
        this.group.move(this.node, toNode, before);
    }

    //
    // Group traversal
    //

    previous()
    {
        return this.group.children[this.group.__locate(this.node) - 1];
    }

    next()
    {
        return this.group.children[this.group.__locate(this.node) + 1];
    }

    walkBackward(step: (node: Node) => any)
    {
        this.node.__walk(current => assumeGroupItem(current).previous(), step);
    }

    walkForward(step: (node: Node) => any)
    {
        this.node.__walk(current => assumeGroupItem(current).next(), step);
    }
}