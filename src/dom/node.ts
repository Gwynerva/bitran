export abstract class Node
{
    name: string;
    parent?: Node;

    get children(): Node[] { return [] };

    //
    // Tree traversal
    //

    walkDown(step: (node: Node) => any)
    {
        for (const childNode of this.children)
            if (step(childNode) === false || childNode.walkDown(node => step(node)) === false)
                return false;
    }

    __walk(next: (current: Node) => Node, step: (node: Node) => any)
    {
        let current: Node = this;
        while (current = next(current))
            if (step(current) === false)
                return;
    }

    walkUp(step: (node: Node) => any)
    {
        this.__walk(current => current.parent, step);
    }
}