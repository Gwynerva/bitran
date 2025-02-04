import { type BitranCoreConfig } from '@core/index';
import { BlockNode, InlinerNode, ProductLayout, ProductNode } from '@dom/productNode';
import { detachMeta, parseMeta } from '@dom/productMeta';
import { TextNode } from '@default/text/core';
import { RootNode } from '@default/root';
import { ErrorNode } from '@default/error';
import { normalizeText, textToStrBlocks } from '@util/str';
import { getIntersection, Range, RangeIntersection } from '@util/range';

import { AutoId, DefaultAutoId } from './autoId';
import { BlockParseFactory, InlinerParseFactory, ParseFactory } from './factory';

export interface ParseOptions
{
    _resolved?: true;
    autoId?: AutoId;
    step?: (productNode: ProductNode) => Promise<void> | void;
}

export class Parser
{
    coreConfig: BitranCoreConfig;

    private blockFactories: Record<string, new () => BlockParseFactory> = {};
    private inlinerFactories: Record<string, new () => InlinerParseFactory> = {};

    constructor(coreConfig: BitranCoreConfig)
    {
        this.coreConfig = coreConfig;

        for (const [productName, ProductCore] of Object.entries(coreConfig.products))
        {
            const Factory = ProductCore.Parser;

            if (Factory)
                this[Factory.prototype instanceof BlockParseFactory ? 'blockFactories' : 'inlinerFactories'][productName] = Factory as any;
        }
    }

    async parse(text: string, options?: ParseOptions): Promise<RootNode>
    {
        [text, options] = resolveParseArgs(text, options);

        const root = new RootNode;
        const blocks = await this.parseBlocks(text, options);
        root.setNodes(blocks);

        return root;
    }

    //
    // Block Parsing
    //

    async parseBlocks(text: string, options?: ParseOptions): Promise<(BlockNode | ErrorNode)[]>
    {
        if (typeof text !== 'string')
            return [];

        [text, options] = resolveParseArgs(text, options);

        const blocks: (BlockNode | ErrorNode)[] = [];

        for (const strBlock of textToStrBlocks(text))
        {
            const block = await this.parseBlock(strBlock, options);

            if (!block)
                continue;

            blocks.push(block);
        }

        return blocks;
    }

    private async parseBlock(strBlock: string, options: ParseOptions): Promise<BlockNode | ErrorNode>
    {
        [strBlock, options] = resolveParseArgs(strBlock, options);

        const { meta, restText } = detachMeta(strBlock);

        for (const [blockName, BlockFactory] of Object.entries(this.blockFactories))
        {
            const block = new this.coreConfig.products[blockName].Node;
            block.name = blockName;
            block.meta = meta;

            const factory = prepareFactory(BlockFactory, this, block, options);

            if (!factory.canParse(restText))
                continue;

            try
            {
                block.parseData = await factory.createParseData(restText);
                block.generated.autoId = createAutoId(options.autoId, factory, block);
                options.step && await options.step(block);

                return block;
            }
            catch (error)
            {
                return createErrorNode(ProductLayout.Block, blockName, strBlock, error);
            }
        }

        return null;
    }

    //
    // Inliner Parsing
    //

    async parseInliners(text: string, options?: ParseOptions): Promise<(InlinerNode | ErrorNode)[]>
    {
        if (typeof text !== 'string')
            return [];

        [text, options] = resolveParseArgs(text, options);

        //
        // Resolving ranges
        //

        let rangeFactories: Record<number, { name: string, factory: InlinerParseFactory }> = {};
        let ranges: Range[] = [];

        for (const [inlinerName, InlinerFactory] of Object.entries(this.inlinerFactories))
        {
            const factory = prepareFactory(InlinerFactory, this, null, options);
            const newRanges: Range[] = factory.outlineRanges(text);

            for (const newRange of newRanges)
            {
                let rangeIndex = 0;
                let removeIndexes: number[] = [];
                let approved = true;

                for (const toCompareWithRange of ranges)
                {
                    switch (getIntersection(newRange, toCompareWithRange))
                    {
                        case RangeIntersection.Partial:
                        case RangeIntersection.Inside:
                            approved = false;
                            break;
                        case RangeIntersection.Contain:
                            removeIndexes.push(rangeIndex);
                            break;
                    }

                    if (!approved)
                    {
                        removeIndexes = [];
                        break;
                    }

                    rangeIndex += 1;
                }

                if (approved)
                {
                    removeIndexes.forEach(index => {
                        delete rangeFactories[index];
                        ranges = ranges.toSpliced(index, 1);
                    });

                    rangeFactories[ranges.push(newRange) - 1] = {
                        name: inlinerName,
                        factory
                    };
                }
            }
        }

        //
        // Parsing resolved ranges
        //

        const inliners: (InlinerNode | ErrorNode)[] = [];

        const pushTextNode = async (text: string) =>
        {
            const textNode = new TextNode;
            textNode.parseData = text;
            textNode.generated.autoId = createAutoId(options.autoId, null, textNode);
            options.step && await options.step(textNode);
            inliners.push(textNode);
        }

        let startText = text.slice(0, ranges[0]?.start ?? text.length);

        if (startText)
            await pushTextNode(startText);

        for (let i = 0; i < ranges.length; i++)
        {
            const inlinerName = rangeFactories[i].name;

            const inliner = new this.coreConfig.products[inlinerName].Node;
            inliner.name = inlinerName;

            const factory = rangeFactories[i].factory;
            factory.productNode = inliner;

            const range = ranges[i];

            let afterText = text.slice(range.end, ranges[i+1]?.start ?? text.length);
                afterText = afterText.replace(/^{(.+)}/, (match, lineMeta) => {
                    inliner.meta = parseMeta(lineMeta);
                    return '';
                });

            const parseText = text.slice(range.start, range.end);

            try
            {
                inliner.parseData = await factory.createParseData(parseText);
                inliner.generated.autoId = createAutoId(options.autoId, factory, inliner);
                options.step && await options.step(inliner);
                inliners.push(inliner);
            }
            catch (error)
            {
                inliners.push(createErrorNode(ProductLayout.Inliner, inlinerName, parseText, error));
            }

            if (afterText)
                await pushTextNode(afterText);
        }

        return inliners;
    }
}

//
// Utils
//

function resolveParseArgs(text: string, options: ParseOptions)
{
    if (options?._resolved)
        return [text, options] as const;

    text = normalizeText(text);

    options ||= {};
    options.autoId ||= new DefaultAutoId;
    options._resolved = true;

    return [
        text,
        options,
    ] as const;
}

function prepareFactory<T extends ParseFactory>(Factory: new () => T, parser: Parser, productNode: ProductNode, options: ParseOptions): T
{
    const factory = new Factory;
    factory.parser = parser;
    factory.parseOptions = options;
    factory.productNode = productNode;

    return factory;
}

function createAutoId(autoId: AutoId, factory: ParseFactory, productNode: ProductNode)
{
    let id = autoId.generate(productNode);

    if (factory)
        id = factory.alterAutoId(id);

    id = autoId.finalize(id);
    autoId.push(id);

    return id;
}

function createErrorNode(layout: ProductLayout, name: string, src: string, error: Error): ErrorNode
{
    const errorNode = new ErrorNode;
    errorNode.layout = layout;
    errorNode.name = name;
    errorNode.src = src;
    errorNode.error = error;

    return errorNode;
}