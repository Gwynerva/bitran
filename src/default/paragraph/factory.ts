import { BlockParseFactory, StrFactory } from "@/core/factory";
import { Paragraph } from './node';

export class ParagraphParser extends BlockParseFactory<Paragraph>
{
    canParse()
    {
        return true;
    }

    async parseProduct(strBlock: string)
    {
        const p = new Paragraph;
        p.content.setNodes(await this.parser.parseInliners(strBlock));
        return p;
    }
}

export class ParagraphStr extends StrFactory<Paragraph>
{
    stringify(product: Paragraph): string
    {
        return this.stringifier.stringify(product.content);
    }
}