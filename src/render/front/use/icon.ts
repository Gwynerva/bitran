import { BlockParseFactory } from '@process/factory';
import { ProductNode } from '@dom/productNode';

import { useProduct } from './product';

import defaultBlockIcon from '@render/assets/block.svg?raw';
import defaultInlinerIcon from '@render/assets/inliner.svg?raw';

export async function useIcon(node: ProductNode | string)
{
    const nodeName = typeof node === 'string' ? node : node.name;
    const { productCore, productRender } = useProduct(node);
    const isBlock = productCore.Parser.prototype instanceof BlockParseFactory;

    let svg = isBlock ? defaultBlockIcon : defaultInlinerIcon;

    const iconFn = productRender?.icon;
    if (iconFn)
    {
        try { svg = await iconFn(); }
        catch { console.warn(`Failed to load icon for product "${nodeName}"! Using the default icon instead!`); }
    }

    return svg;
}