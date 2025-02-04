import { ProductNode } from '@dom/productNode';

export function useMeta<T extends ProductNode>(node: T): T['meta']
{
    return node.meta;
}