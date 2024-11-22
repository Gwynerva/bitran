import YAML from 'yaml';

import { ProductMeta } from "./dom/meta";
import { Parser } from "./parse";
import { Stringifier } from "./stringify";
import { Block, Inliner, Product } from './dom/product';
import { Node } from './dom/node';
import { indent, splitFirstLine, textToObj } from "@/util/str";
import { Range, tryRange } from '@/util/range';

export interface keyable extends Record<string, any> {}

export abstract class ParseFactory<TProduct extends Product = Product>
{
    parser: Parser;
    meta: ProductMeta;

    abstract parseProduct(...args: any[]): Promise<TProduct>;
}

//
// Block Factory
//

export abstract class BlockParseFactory<TBlock extends Block = Block> extends ParseFactory<TBlock>
{
    abstract canParse(strBlock: string): boolean;
    abstract parseProduct(strBlock: string): Promise<TBlock>;
}

export abstract class ObjBlockParseFactory<TBlock extends Block = Block> extends BlockParseFactory<TBlock>
{
    abstract objType: string;
    abstract parseObjBlock(obj: keyable): Promise<TBlock>;

    canParse(strBlock: string)
    {
        return strBlock.match(/^@(\S+)$/m)?.[1] === this.objType;
    }

    async parseProduct(strBlock: string)
    {
        const { restText } = splitFirstLine(strBlock);
        return this.parseObjBlock(textToObj(restText));
    }
}

//
// Inliner Factory
//

export abstract class InlinerParseFactory<TInliner extends Inliner = Inliner> extends ParseFactory<TInliner>
{
    abstract outlineRanges(text: string): Range[];
    abstract parseProduct(strInliner: string): Promise<TInliner>;
}

export abstract class RegexpInlinerParseFactory<TInliner extends Inliner = Inliner> extends InlinerParseFactory<TInliner>
{
    abstract regexp: RegExp;
    abstract parseRegexpInliner(regexpResult: RegExpExecArray): Promise<TInliner>;

    outlineRanges(text: string)
    {
        const ranges: Range[] = [];

        const matches = text.matchAll(new RegExp(this.regexp));
        for (const match of matches)
            ranges.push(tryRange(match.index, match.index + match[0].length));

        return ranges;
    }

    async parseProduct(strInliner: string): Promise<TInliner>
    {
        return this.parseRegexpInliner(new RegExp(this.regexp).exec(strInliner));
    }
}

//
// String Factory
//

export abstract class StrFactory<TNode extends Node = Node>
{
    stringifier: Stringifier;

    abstract stringify(node: TNode): string;
}

export abstract class ObjStrFactory<TNode extends Node = Node> extends StrFactory<TNode>
{
    abstract objType: string;
    abstract productToObj(product: TNode): keyable;

    stringify(node: TNode): string
    {
        const obj = this.productToObj(node);

        let strObj = YAML.stringify(obj, { indent: 4 }).trim();
            strObj = strObj.replace(/: \|(-|\+|>)\n/gm, ': |\n'); // Hacky way to bypass all YAML weird "newlines" logic and just use "|" for multiline text
            //strObj = strObj.replace(/ \|\n    \n/gm, ' |\n\n'); // <-- Dirty hack to fix YAML.stringify putting space symbol out of nowhere

        return `@${this.objType}\n${indent(strObj)}`;
    }
}