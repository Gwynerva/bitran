import { Parser } from '@process/parse';
import { Stringifier } from '@process/stringify';

import { editor } from '@default/editor/core';
import { editorName } from '@default/editor/shared';
import { paragraph } from '@default/paragraph/core';
import { paragraphName } from '@default/paragraph/shared';
import { span } from '@default/span/core';
import { spanName } from '@default/span/shared';
import { text } from '@default/text/core';
import { textName } from '@default/text/shared';

import type { GenericProductCore } from './product';

export interface BitranCoreConfig
{
    products: Record<string, GenericProductCore>;
    // ...
}

export interface BitranCore
{
    products: Record<string, GenericProductCore>;
    parser: Parser;
    stringifier: Stringifier;
}

export const defaultProductCores = {
    [editorName]:       editor,
    [paragraphName]:    paragraph,
    [spanName]:         span,
    [textName]:         text,
};

export function createBitranCore(config?: Partial<BitranCoreConfig>): BitranCore
{
    const resolvedConfig: BitranCoreConfig = {
        products: {
            ...(config?.products || {}),
            ...defaultProductCores,
        },
    };

    return {
        products:       resolvedConfig.products,
        parser:         new Parser(resolvedConfig),
        stringifier:    new Stringifier(resolvedConfig),
    }
}

export * from './default';
export * from './product';
export * from './renderData';