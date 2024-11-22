import { ParseFactory, StrFactory, Node, Parser, Stringifier, DOM } from './core';
import { BitranProduct } from './product';

//
// Сделать конфигом, где можно передать продукты, генератор и вообще все что угодно по желанию
//

export default function useBitran(products: Record<string, BitranProduct>)
{
    const parserFactories: Record<string, new () => ParseFactory> = {};
    const strFactories: Record<string, new () => StrFactory> = {};
    const nodeTypes: Record<string, new () => Node> = {};

    for (const [nodeName, definition] of Object.entries(products))
    {
        parserFactories[nodeName] = definition.Parser;
        strFactories[nodeName] = definition.Stringifier;
        nodeTypes[nodeName] = definition.Node;
    }

    return {
        parser: new Parser(parserFactories),
        stringifier: new Stringifier(strFactories),
        dom: new DOM(nodeTypes),
    }
}

export type UseBitran = ReturnType<typeof useBitran>;