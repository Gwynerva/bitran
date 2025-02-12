import { ProductType } from '@';
import type { ProductNode } from '@dom/productNode';
import type { GenericProductStrFactory, ParseFactory } from '@process/factory';

import type { RenderDataSide } from './renderData';

type Provide<T extends ProductType> = { provide: T['Provide']; };
type BuildRenderData<T extends ProductType> = { buildRenderData: (args: { parseData: T['ParseData']; node: ProductNode<T>; core: ProductCore<T>; }) => Promise<T['RenderData']>; }

type ProductCoreBase<T extends ProductType> = {
  Node: new () => ProductNode<T>;
  Parser: (new () => ParseFactory<T>) | (new () => ParseFactory<T>)[];
  Stringifier: new () => GenericProductStrFactory<T>;

  /**
   * Where render data can be built.
   * @default "both"
   */
  renderDataSide?: RenderDataSide;
};

export type ProductCore<T extends ProductType> =
    ProductCoreBase<T>
    & (T extends { Provide: any } ? Provide<T> : {})
    & (T extends { RenderData: any  } ? BuildRenderData<T> : {});

export type GenericProductCore = ProductCoreBase<any> & Partial<Provide<any>> & Partial<BuildRenderData<any>>;

export function defineProductCore<T extends ProductType>(productCore: ProductCore<T>)
{
    return finalizeCore(productCore);
}

export function defineProductCoreFn<T extends ProductType>(productCore: Omit<ProductCore<T>, 'provide'>)
{
    return (provide: T['Provide']) => ({ ...finalizeCore(productCore), ...{ provide } });
}

function finalizeCore(core: GenericProductCore): GenericProductCore
{
    if (!core.renderDataSide)
        core.renderDataSide = 'both';

    return core;
}