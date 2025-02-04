import YAML from 'yaml';

import type { ProductType } from '@';
import { Node } from '@dom/node';
import { ProductNode } from '@dom/productNode';
import { BlocksNode, InlinersNode } from '@default/groups';
import type { ProductCore } from '@core/product';
import { indent, splitFirstLine, textToObj } from '@util/str';
import { Range, tryRange } from '@util/range';

import type { ParseOptions, Parser } from './parse';
import type { Stringifier, StrOptions } from './stringify';

export interface keyable extends Record<string, any> {}

//
// Parse
//

export abstract class ParseFactory<T extends ProductType = ProductType>
{
    parser: Parser;
    parseOptions: ParseOptions;
    productNode: ProductNode<T>;

    abstract createParseData(...args: any[]): Promise<T['ParseData']>;

    getPayload()
    {
        const bitranCore = this.parser.coreConfig;
        const productCore = bitranCore.products[this.productNode.name] as any as ProductCore<T>;

        return {
            bitranCore,
            productCore,
            node:       this.productNode,
            parseData:  this.productNode?.parseData,
            provide:    this.parser.coreConfig.products?.[this.productNode?.name]?.provide as T['Provide'],
        }
    }

    alterAutoId(autoId: string)
    {
        return autoId;
    }

    async parseBlocks(text: string)
    {
        const blocks = await this.parser.parseBlocks(text, this.parseOptions);
        const blocksGroup = new BlocksNode(this.productNode);
        blocksGroup.setNodes(blocks);

        return blocksGroup;
    }

    async parseInliners(text: string)
    {
        const inliners = await this.parser.parseInliners(text, this.parseOptions);
        const inlinersGroup = new InlinersNode(this.productNode);
        inlinersGroup.setNodes(inliners);

        return inlinersGroup;
    }
}

// //
// // Block
// //

export abstract class BlockParseFactory<T extends ProductType = ProductType> extends ParseFactory<T>
{
    abstract canParse(strBlock: string): boolean;
    abstract createParseData(strBlock: string): Promise<T['ParseData']>;
}

export abstract class ObjBlockParseFactory<T extends ProductType = ProductType> extends BlockParseFactory<T>
{
    abstract objName: string;
    abstract parseDataFromObj(obj: keyable, strBlock: string): Promise<T['ParseData']>;

    canParse(strBlock: string)
    {
        return strBlock.match(/^@(\S+)$/m)?.[1] === this.objName;
    }

    async createParseData(strBlock: string)
    {
        const { restText } = splitFirstLine(strBlock);
        return this.parseDataFromObj(textToObj(restText), strBlock);
    }
}

// //
// // Inliner
// //

export abstract class InlinerParseFactory<T extends ProductType = ProductType> extends ParseFactory<T>
{
    abstract outlineRanges(text: string): Range[];
    abstract createParseData(strInliner: string): Promise<T['ParseData']>;
}

export abstract class RegexpInlinerParseFactory<T extends ProductType = ProductType> extends InlinerParseFactory<T>
{
    abstract regexp: RegExp;
    abstract parseDataFromRegexp(match: RegExpExecArray): Promise<T['ParseData']>;

    outlineRanges(text: string)
    {
        const ranges: Range[] = [];

        const matches = text.matchAll(new RegExp(this.regexp));
        for (const match of matches)
            ranges.push(tryRange(match.index, match.index + match[0].length));

        return ranges;
    }

    async createParseData(strInliner: string): Promise<T['ParseData']>
    {
        return this.parseDataFromRegexp(new RegExp(this.regexp).exec(strInliner));
    }
}

//
// Stringify
//

export abstract class StrFactory<T extends Node = Node>
{
    stringifier: Stringifier;
    strOptions: StrOptions;
    node: T;

    abstract stringifyNode(node: T): string;

    getPayload()
    {
        return {
            node: this.node,
        }
    }

    stringify(node: Node): string
    {
        return this.stringifier.stringify(node, this.strOptions);
    }
}

export abstract class ProductStrFactory<T extends ProductType = ProductType> extends StrFactory<ProductNode<T>>
{
    abstract stringifyData(parseData: T['ParseData']): string;

    stringifyNode(node: ProductNode<T>)
    {
        return this.stringifyData(node.parseData);
    }
}

export abstract class ObjProductStrFactory<T extends ProductType = ProductType> extends StrFactory<ProductNode<T>>
{
    abstract objName: string;
    abstract createObj(parseData: T['ParseData']): keyable;

    stringifyNode(node: ProductNode<T>)
    {
        const obj = this.createObj(node.parseData);

        let strObj = YAML.stringify(obj, { indent: 4 }).trim();
            strObj = strObj.replace(/: \|(-|\+|>)\n/gm, ': |\n'); // Hacky way to bypass all YAML weird "newlines" logic and just use "|" for multiline text
            //strObj = strObj.replace(/ \|\n    \n/gm, ' |\n\n'); // <-- Dirty hack to fix YAML.stringify putting space symbol out of nowhere

        return `@${this.objName}\n${indent(strObj)}`;
    }
}

export type GenericProductStrFactory<T extends ProductType = ProductType> = ProductStrFactory<T> | ObjProductStrFactory<T>;