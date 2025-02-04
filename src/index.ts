import type { CreatedRenderData } from '@core/renderData';
import type { ProductMeta } from '@dom/productMeta';

export interface ProductType
{
    /** Additional data that can be attached in universal way to any product in BI markup. */
    Meta?: ProductMeta;

    /**
     * Product data that is generated when parsing BI markup.
     * Only necessary information that can be calculated fast!
     * Move all heavy and expensive to get data to `RenderData`.
     */
    ParseData?:  any;

    /**
      * Product data that is generated when rendering product.
      * Can contain any information and the calculation is allowed to be slow.
      */
    RenderData?: any;

    /**
     * External data provided to the product.
     * Used to link product with outside and external environment.
     */
    Provide?: any;
}

export type DefineProductType<T extends ProductType> = keyof T extends keyof ProductType ? T : 'Invalid ProductType structure!';

export type BitranPreRenderData = { [productId: string]: CreatedRenderData };

export interface BitranContent
{
    biCode: string;
    renderData: BitranPreRenderData;
}