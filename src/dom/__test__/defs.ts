import { Node, GroupNode } from '..';

let key = 0;
export class FooNode extends Node {
    name = 'foo';
    get children() { return []; }

    key: number;
    constructor()
    {
        super();
        this.key = key++;
    }
}

export class TestGroupNode extends GroupNode
{
    constructor() { super(undefined); }
}