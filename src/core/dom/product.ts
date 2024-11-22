import { ProductMeta } from "./meta";
import { Node } from "./node";

export enum ProductType
{
    Block = 'block',
    Inliner = 'inliner',
}

export abstract class Product extends Node
{
    type: ProductType;
    meta: ProductMeta = {};
}

export abstract class Block extends Product
{
    type = ProductType.Block;
}

export abstract class Inliner extends Product
{
    type = ProductType.Inliner;
}