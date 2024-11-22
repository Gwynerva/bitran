import { Node, ParseFactory, StrFactory } from '@/core';

export interface BitranProduct
{
    Node: new () => Node;
    Parser: new () => ParseFactory;
    Stringifier: new () => StrFactory;
}

export function defineBitranProduct(product: BitranProduct): BitranProduct
{
    return product;
}