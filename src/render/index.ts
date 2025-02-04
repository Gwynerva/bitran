import type { Component } from 'vue';

import { editorName } from '@default/editor/shared';
import { editor } from '@default/editor/render';
import { spanName } from '@default/span/shared';
import { span } from '@default/span/render';
import { text } from '@default/text/render';
import { textName } from '@default/text/shared';
import { paragraph } from '@default/paragraph/render';
import { paragraphName } from '@default/paragraph/shared';

import { ProductRender } from './product';
import DefaultRenderWrapper from './components/RenderWrapper.vue';

export interface BitranRenderConfig
{
    products:       Record<string, ProductRender>;
    formatText?:    (text: string) => string;
    RenderWrapper?: Component;
    // ...
}

export interface BitranRender
{
    products:       Record<string, ProductRender>;
    formatText:     (text: string) => string;
    RenderWrapper:  Component;
}

export const defaultProductRenders = {
    [editorName]:       editor,
    [paragraphName]:    paragraph,
    [spanName]:         span,
    [textName]:         text,
};

export function createBitranRender(config?: Partial<BitranRenderConfig>): BitranRender
{
    const resolvedConfig: BitranRenderConfig = {
        products: {
            ...(config?.products || {}),
            ...defaultProductRenders,
        },
    };

    return {
        products:       resolvedConfig.products,
        formatText:     config.formatText || (text => text),
        RenderWrapper:  config.RenderWrapper || DefaultRenderWrapper,
    }
}

export { default as Bitran } from './components/Bitran.vue';
export { default as Render } from './components/Render.vue';
export { default as ProductIcon } from './components/ProductIcon.vue';

export * from './icon';
export * from './component';
export * from './language';
export * from './product';
export * from './front';