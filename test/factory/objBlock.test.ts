import { Node } from '@/core/dom/node';
import { BlockGroupNode } from '@/core/dom/group';
import { Block } from '@/core/dom/product';
import { keyable, ObjBlockParseFactory, ObjStrFactory } from '@/core/factory';
import { Parser } from '@/core/parse';
import { Stringifier } from '@/core/stringify';

class FooBar extends Block
{
    boolProp: boolean;

    foo = new BlockGroupNode(this);
    bar = new BlockGroupNode(this);

    get children(): Node[]
    {
        return [this.foo, this.bar];
    }
}

const objType = 'fooBar';

class FooBarParser extends ObjBlockParseFactory<FooBar>
{
    objType = objType;

    async parseObjBlock(obj: keyable)
    {
        const fooBar = new FooBar;

        fooBar.boolProp = obj.boolProp;
        fooBar.foo.setNodes(await this.parser.parseBlocks(obj.foo));
        fooBar.bar.setNodes(await this.parser.parseBlocks(obj.bar));

        return fooBar;
    }
}

class FooBarStr extends ObjStrFactory<FooBar>
{
    objType = objType;

    productToObj(product: FooBar): keyable
    {
        const obj: keyable = {};

        if (product.boolProp)
            obj.boolProp = true;

        if (product.foo.hasChildren())
            obj.foo = this.stringifier.stringify(product.foo);

        if (product.bar.hasChildren())
            obj.bar = this.stringifier.stringify(product.bar);

        return obj;
    }
}

const parser = new Parser({
    fooBar: FooBarParser,
});

const stringifier = new Stringifier({
    fooBar: FooBarStr,
});

const text = `

{ #first }
This is the first paragraph

@fooBar
    boolProp: true

    foo: |
        { .cls1 .cls2 }
        This is the second paragraph!

        More on that later!

    bar: |
        Here goes nested foobar block:

        {
            id: nested
            deep:
                property: 69
        }
        @fooBar
            bar: |
                The deepest paragraph!

Last paragraph.

`;

//
//
//

const doc = await parser.parse(text);
const strDoc = stringifier.stringify(doc);

test('Object blocks and paragraphs with meta', () => {
    expect(strDoc).toBe(`

{ #first }
This is the first paragraph

@fooBar
    boolProp: true
    foo: |
        { .cls1 .cls2 }
        This is the second paragraph!

        More on that later!
    bar: |
        Here goes nested foobar block:

        {
            id: nested
            deep:
                property: 69
        }
        @fooBar
            bar: The deepest paragraph!

Last paragraph.`.trimStart());
});
