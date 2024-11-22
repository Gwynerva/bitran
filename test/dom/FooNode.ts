import { Node } from "@/core/dom/node";

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