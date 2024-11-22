import { BlockParseFactory, InlinerParseFactory, ParseFactory } from "./factory";
import { detachMeta, parseMeta, ProductMeta } from "./dom/meta";
import { RootNode } from "./dom/group";
import { ErrorNode } from "./dom/error";
import { Inliner, ProductType } from "./dom/product";
import { Node } from "./dom/node";
import { Text } from "@/default/text/node";
import { paragraphName } from '@/default/paragraph';
import { ParagraphParser } from '@/default/paragraph/factory';
import { editorName } from '@/default/editor';
import { EditorParser } from '@/default/editor/factory';
import { spanName } from '@/default/span';
import { SpanParser } from '@/default/span/factory';
import { textToStrBlocks } from "@/util/str";
import { getIntersection, Range, RangeIntersection } from "@/util/range";

export class Parser
{
    private blocks: Record<string, new () => BlockParseFactory>;
    private inliners: Record<string, new () => InlinerParseFactory>;

    constructor(factories: Record<string, new () => ParseFactory>)
    {
        this.blocks = {};
        this.inliners = {};

        for (const [productName, Factory] of Object.entries(factories))
            this[Factory.prototype instanceof BlockParseFactory ? 'blocks' : 'inliners'][productName] = Factory as any;

        this.blocks[editorName] = EditorParser;
        this.blocks[paragraphName] = ParagraphParser;
        this.inliners[spanName] = SpanParser;
    }

    async parse(text: string): Promise<RootNode>
    {
        // Remove Windows-like carriage returns
        text = text.replace(/\r\n/g, '\n');

        const root = new RootNode;
        const blocks = await this.parseBlocks(text);
        root.setNodes(blocks);

        return root;
    }

    //
    // Block Parsing
    //

    async parseBlocks(text: string): Promise<Node[]>
    {
        if (typeof text !== 'string') return [];

        const nodes: Node[] = [];

        for (const strBlock of textToStrBlocks(text))
        {
            const node = await this.parseBlock(strBlock);

            if (!node)
                continue;

            nodes.push(node);
        }

        return nodes;
    }

    private async parseBlock(strBlock: string): Promise<Node>
    {
        const { meta, restText } = detachMeta(strBlock);

        for (const [blockName, Factory] of Object.entries(this.blocks))
        {
            const factory = this.prepareFactory(Factory, meta);

            if (!factory.canParse(restText))
                continue;

            try {
                const block = await factory.parseProduct(restText);
                block.name = blockName;
                block.meta = meta;
                return block;
            }
            catch (e) {
                return this.createErrorNode(ProductType.Block, blockName, restText, e);
            }
        }

        return null;
    }

    //
    // Inliner Parsing
    //

    async parseInliners(text: string): Promise<Node[]>
    {
        if (typeof text !== 'string') return [];

        if (text === '')
            return [];

        //
        // Resolving ranges
        //

        let rangeFactories: Record<number, { name: string, factory: InlinerParseFactory }> = {};
        let ranges: Range[] = [];

        for (const [inlinerName, Factory] of Object.entries(this.inliners))
        {
            const factory = this.prepareFactory(Factory, null);
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

        const inliners: Inliner[] = [];

        let startText = text.slice(0, ranges[0]?.start ?? text.length);
        if (startText)
        {
            const startTextNode = new Text;
            startTextNode.content = startText;
            inliners.push(startTextNode);
        }

        for (let i = 0; i < ranges.length; i++)
        {
            const inlinerName = rangeFactories[i].name;
            const factory = rangeFactories[i].factory;
            const range = ranges[i];

            factory.meta = {};
            let afterText = text.slice(range.end, ranges[i+1]?.start ?? text.length);
                afterText = afterText.replace(/^{(.+)}/, (match, lineMeta) => {
                    factory.meta = parseMeta(lineMeta);
                    return '';
                });

            const parseText = text.slice(range.start, range.end);

            try {
                const inliner = await factory.parseProduct(parseText);
                inliner.name = inlinerName;
                inliner.meta = factory.meta;
                inliners.push(inliner);
            }
            catch (e) {
                inliners.push(this.createErrorNode(ProductType.Inliner, inlinerName, parseText, e) as any);
            }

            if (afterText)
            {
                const textNode = new Text;
                textNode.content = afterText;
                inliners.push(textNode);
            }
        }

        return inliners;
    }

    //
    //
    //

    private createErrorNode(type: ProductType, productName: string, strProduct: string, error: Error): ErrorNode
    {
        const errorNode = new ErrorNode;
        errorNode.contextType = type;
        errorNode.target = productName;
        errorNode.error = error;
        errorNode.src = strProduct;

        return errorNode;
    }

    private prepareFactory<T extends ParseFactory>(TFactory: new () => T, meta: ProductMeta): T
    {
        const factory = new TFactory;
        factory.parser = this;
        factory.meta = meta;

        return factory;
    }
}