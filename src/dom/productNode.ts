import { ProductType } from '@';

import { Node } from './node';
import { ProductMeta } from './productMeta';

export enum ProductLayout
{
    Block = 'block',
    Inliner = 'inliner',
}

export interface Generated
{
    autoId: string;
}

export abstract class ProductNode<T extends ProductType = ProductType> extends Node
{
    layout:     ProductLayout;
    parseData:  T['ParseData'];
    renderData: T['RenderData'];
    generated:  Generated = {} as any;
    meta:       ProductMeta & T['Meta'] = {};

    getId()
    {
        return this.meta?.id || this.generated?.autoId || null;
    }
}

export abstract class BlockNode<T extends ProductType = ProductType> extends ProductNode<T>
{
    layout = ProductLayout.Block;
}

export abstract class InlinerNode<T extends ProductType = ProductType> extends ProductNode<T>
{
    layout = ProductLayout.Inliner;
}