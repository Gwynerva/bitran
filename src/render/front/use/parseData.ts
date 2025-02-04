import { ProductNode } from '@dom/productNode';

export function useParseData<T extends ProductNode>(node: T): T['parseData']
{
    return node.parseData;
}