import { InlinerGroupNode } from '@/core/dom/group';
import { Inliner } from '@/core/dom/product';
import { RegexpInlinerParseFactory, StrFactory } from '@/core/factory';
import { Parser } from '@/core/parse';
import { Stringifier } from '@/core/stringify';
import { SpanParser, SpanStr } from '@/default/span/factory';

class Strong extends Inliner
{
    content = new InlinerGroupNode(this);

    get children()
    {
        return [this.content];
    }
}

const delim = '**';

class StrongParser extends RegexpInlinerParseFactory<Strong>
{
    regexp = /\*\*(.+?)\*\*/gm;

    async parseRegexpInliner(regexpResult: RegExpExecArray)
    {
        const strong = new Strong;
        strong.content.setNodes(await this.parser.parseInliners(regexpResult[1]));

        return strong;
    }
}

class StrongStr extends StrFactory<Strong>
{
    stringify(node: Strong)
    {
        return delim + this.stringifier.stringify(node.content) + delim;
    }
}

const parser = new Parser({
    span: SpanParser,
    strong: StrongParser,
});

const stringifier = new Stringifier({
    span: SpanStr,
    strong: StrongStr,
});

const text = `

This is <<my **very <<important>>{ #span2 }**{ #strong }>>{ #span1 } **text**!

`;

//
//
//

const doc = await parser.parse(text);
const strDoc = stringifier.stringify(doc);

test('String with nested spans and regexp inliners', () => {
    expect(strDoc).toBe(`
    This is <<my **very <<important>>{ #span2 }**{ #strong }>>{ #span1 } **text**!`.trimStart());
})
