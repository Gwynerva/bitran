import { ProductNode } from '@dom/productNode';
import { createPhrase } from '@render/language';

import { useGlobalState } from './state';
import { useProduct } from './product';

export async function useLanguage(node: ProductNode | string)
{
    const nodeName = typeof node ==='string' ? node : node.name;
    const globalState = useGlobalState();
    const { productRender } = useProduct(node);

    const rawPhraseFn = await createPhrase(globalState.language, productRender.languages, `product:${nodeName}`);

    const phraseFn = (phraseKey: string, ...args: any[]) => {
        try { return rawPhraseFn(phraseKey, ...args); }
        catch { return `{{ ${phraseKey} }}`; }
    }

    return phraseFn;
}