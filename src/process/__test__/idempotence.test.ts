import { createBitranCore } from '@core/index';

const text = `

This <<it text <<with <<blocks>>{ .subClass } and>> inliners>>.

{ #myId }
This text is needed to test Bitran idempotence.

{
    foo: 5
}
It's goal is to test if the same input produces the same output no matter how many times we run the process.

`;

const bitranCore = createBitranCore();

const parsed1 = await bitranCore.parser.parse(text);
const parsed2 = await bitranCore.parser.parse(text);
const parsed3 = await bitranCore.parser.parse(text);

test('Parser indempotence', () => {
    expect(parsed2).toEqual(parsed1);
    expect(parsed3).toEqual(parsed1);
});

const str1 = bitranCore.stringifier.stringify(parsed1);
const str2  = bitranCore.stringifier.stringify(parsed2);
const str3 = bitranCore.stringifier.stringify(parsed3);

test('Stringifier indempotence', () => {
    expect(str2).toEqual(str1);
    expect(str3).toEqual(str1);
});
