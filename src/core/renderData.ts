import type { ProductNode } from '@dom/productNode';

import type { GenericProductCore } from '.';

export type RenderDataSide = 'pre' | 'front' | 'both';

type RenderDataResult = 'success' | 'error';

type RenderDataBase = { status: RenderDataResult; }

interface RenderDataError extends RenderDataBase
{
    status: 'error';
    errorMessage: string;
}

interface RenderDataSuccess extends RenderDataBase
{
    status: 'success';
    data: any;
}

export type CreatedRenderData = RenderDataError | RenderDataSuccess;

export async function createRenderData(side: 'pre' | 'front', productNode: ProductNode, productCore: GenericProductCore): Promise<CreatedRenderData>
{
    const buildRenderData = productCore?.buildRenderData;
    const wantedSide = productCore.renderDataSide;

    if (!buildRenderData)
        return undefined;

    if (
        (wantedSide === 'pre' && side === 'front')
        ||
        (wantedSide === 'front' && side ==='pre')
    )
        return undefined;

    try
    {
        const data = await buildRenderData({
            node: productNode,
            parseData: productNode.parseData,
            core: productCore,
        });

        return {
            status: 'success',
            data,
        }
    }
    catch (error)
    {
        return {
            status: 'error',
            errorMessage: error?.message || error,
        }
    }
}