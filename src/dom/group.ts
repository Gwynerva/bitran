import { BitranDomError } from './error';
import { Node } from './node';

export abstract class GroupNode extends Node
{
    _children: Node[] = [];
    get children() { return this._children; }

    constructor(parent?: Node)
    {
        super();
        this.parent = parent;
    }

    hasChildren()
    {
        return !!this._children.length;
    }

    isEmpty()
    {
        return !this.hasChildren();
    }

    /**
     * Detach given node from any GroupNode it might belongs to.
     */
    static detachNode(node: Node)
    {
        if (node.parent && node.parent instanceof GroupNode)
            node.parent.detach(node);
    }

    //
    // Low level operations
    //

    __locate(node: Node)
    {
        const index = this.children.indexOf(node);

        if (index === -1)
            throw new BitranDomError('Failed to locate node! Provided node does not belong to current GroupNode!');

        return index;
    }

    __detachAt(index: number)
    {
        const detachedNode = this.children.splice(index, 1).pop();
        detachedNode.parent = undefined;
    }

    __insertAt(index: number, ...nodes: Node[])
    {
        nodes.forEach(node => {
            GroupNode.detachNode(node);
            node.parent = this;
        });

        this.children.splice(index, 0, ...nodes);
    }

    __swap(indexA: number, indexB: number)
    {
        [this.children[indexA], this.children[indexB]] = [this.children[indexB], this.children[indexA]];
    }

    __move(indexSource: number, indexTarget: number, before = false)
    {
        const movingNode = this.children[indexSource];
        this.children.splice(indexSource, 1);
        this.children.splice(indexTarget, 0, movingNode);
    }

    //
    // Operations
    //

    detach(node: Node)
    {
        this.__detachAt(this.__locate(node));
    }

    clear()
    {
        const detachCount = this.children.length;
        for (let i = 0; i < detachCount; i++)
            this.__detachAt(0);
    }

    setNodes(...nodes: Node[]): void
    setNodes(nodes: Node[]): void
    setNodes(nodes: any)
    {
        this.clear();

        let nodeArr: Node[];

        switch (arguments.length)
        {
            case 0: return;
            case 1:
                const arg0 = arguments[0];
                nodeArr = arg0 instanceof Node ? [arg0] : [...arg0];
                break;
            default:
                nodeArr = [];
                for (const node of arguments)
                    nodeArr.push(node);
                break;
        }

        this.__insertAt(0, ...nodeArr);
    }

    swap(nodeA: Node, nodeB: Node)
    {
        this.__swap(this.__locate(nodeA), this.__locate(nodeB));
    }

    move(nodeSource: Node, nodeTarget: Node, before: boolean = false)
    {
        if (nodeSource === nodeTarget)
            return;

        const indexSource = this.__locate(nodeSource);
        let indexTarget = this.__locate(nodeTarget);

        if (indexTarget < indexSource)
            indexTarget++;

        this.__move(indexSource, Math.max(0, indexTarget - (before ? 1 : 0)));
    }

    prepend(...nodes: Node[])
    {
        this.__insertAt(0, ...nodes);
    }

    append(...nodes: Node[])
    {
        this.__insertAt(this.children.length, ...nodes);
    }

    before(refNode: Node, ...beforeNodes: Node[])
    {
        this.__insertAt(this.__locate(refNode), ...beforeNodes);
    }

    after(refNode: Node, ...afterNodes: Node[])
    {
        this.__insertAt(this.__locate(refNode) + 1, ...afterNodes);
    }

    replace(toReplace: Node, ...withNodes: Node[])
    {
        this.after(toReplace, ...withNodes);
        this.detach(toReplace);
    }
}