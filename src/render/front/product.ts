import { h, VNode } from 'vue';

import { ProductNode } from '@dom/productNode';
import { ErrorNode } from '@default/error';

import { useGlobalState } from './use/state';
import { useProduct } from './use/product';
import { getFrontRenderData } from './use/renderData';

export interface PrepareProductResult
{
    VNode: VNode;
    prepareError?: Error;
}

export async function prepareProduct(node: ProductNode | ErrorNode): Promise<PrepareProductResult>
{
    const toReturn: PrepareProductResult = {
        VNode: null,
        prepareError: null,
    };

    const setError = (error: Error) => {
        console.error(`Error in ${node.layout} product "${node.name}"!\n\n` + (error?.message || error));
        toReturn.prepareError = error;
    };

    if (node instanceof ErrorNode)
    {
        setError(node.error);
        return toReturn;
    }

    const renderDataPromise = getFrontRenderData(node);
    const prepareVNodePromise = prepareVNode(node);

    try
    {
        // Turns out Vue's `withAsyncContext` works only on top-level awaits and the context
        // is lost when awaiting inside async function! So we must call all composables before awaiting
        // anything in this function. That is why we await only here — at the end!
        const [createdRenderData, vNode] = await Promise.all([renderDataPromise, prepareVNodePromise]);

        if (createdRenderData)
        {
            if (createdRenderData.status === 'error')
                throw new Error(createdRenderData.errorMessage);

            node.renderData = createdRenderData?.data;
        }

        toReturn.VNode = vNode;
    }
    catch (error)
    {
        setError(error);
        return toReturn;
    }

    return toReturn;
}

export async function prepareVNode(node: ProductNode)
{
    const { productRender } = useProduct(node);
    return h(await productRender.component(), { node });
}