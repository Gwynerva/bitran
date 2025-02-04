import { CreatedRenderData, createRenderData } from '@core/index';
import { ProductNode } from '@dom/productNode';

import { useGlobalState } from './state';
import { useProduct } from './product';

export async function getFrontRenderData(node: ProductNode)
{
    const globalState = useGlobalState();
    const { productCore } = useProduct(node);

    let createdRenderData: CreatedRenderData = globalState.content.renderData?.[node.getId()];
        createdRenderData ||= await createRenderData('front', node, productCore);

    return createdRenderData;
}

export function useRenderData<T extends ProductNode>(node: T): T['renderData']
{
    return node.renderData;
}