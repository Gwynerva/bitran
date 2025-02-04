import { type BitranCoreConfig } from '@core/index';
import { Node } from '@dom/node';
import { BlockNode, InlinerNode } from '@dom/productNode';
import { stringifyMeta } from '@dom/productMeta';
import { ErrorNode } from '@default/error';
import { BlocksNode, InlinersNode } from '@default/groups';
import { RootNode } from '@default/root';

import { StrFactory } from './factory';

export interface StrOptions
{
    step?: (node: Node, strNode: string) => void;
}

export class Stringifier
{
    private factories: Record<string, new () => StrFactory> = {};

    constructor(coreConfig: BitranCoreConfig)
    {
        for (const [productName, ProductCore] of Object.entries(coreConfig.products))
        {
            const Factory = ProductCore.Stringifier;
            this.factories[productName] = Factory;
        }
    }

    stringify(node: Node, options: StrOptions = {}): string
    {
        const withStep = (strNode: string) =>
        {
            options.step && options.step(node, strNode);
            return strNode;
        }

        //
        // Technical nodes
        //

        if (node instanceof ErrorNode)
            return withStep(node.src);

        if (node instanceof BlocksNode || node instanceof RootNode)
            return withStep(node.children.map(childNode => this.stringify(childNode, options)).join('\n\n'));

        if (node instanceof InlinersNode)
            return withStep(node.children.map(childNode => this.stringify(childNode, options)).join(''));

        //
        // User defined nodes
        //

        const Factory = this.factories[node.name];

        if (!Factory)
            throw new Error(`Can't stringify unknown node type "${node.name}"!`);

        const factory = new Factory;
        factory.stringifier = this;
        factory.strOptions = options;
        factory.node = node;

        const strNode = factory.stringifyNode(node);

        if (node instanceof BlockNode)
        {
            const strMeta = stringifyMeta(node.meta, true);
            return withStep(strMeta + (strMeta ? '\n' : '') + strNode);
        }
        else if (node instanceof InlinerNode)
        {
            return withStep(strNode + stringifyMeta(node.meta, false));
        }
    }
}