import { Node } from "./node";
import { ProductType } from "./product";

export class BitranDomError extends Error
{
    constructor(message)
    {
        super(message);
        this.name = 'BitranDomError';
    }
}

export class ErrorNode extends Node
{
    name = '#error';
    contextType: ProductType;
    target: string;
    src: string;
    error: Error;

    get children()
    {
        return [];
    }
}