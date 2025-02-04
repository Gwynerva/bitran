import { ProductNode } from '@dom/productNode';

import { useGlobalState } from './state';

export function useProduct(node: string | ProductNode)
{
    const globalState = useGlobalState();
    const nodeName = typeof node === 'string' ? node : node.name;

    return {
        productCore: globalState.bitranCore.products[nodeName],
        productRender: globalState.bitranRender.products[nodeName],
    };
}