import { Parser } from '@/core';
import { readFileSync } from 'fs';

const parser = new Parser({});
const textFromFile = readFileSync('./test/parse/example.bi', 'utf-8');
const dom = await parser.parse(textFromFile);

test('Meta parse from file', () => {
    expect(dom.children[0]['meta']).toEqual({ id: 'first' });
    expect(dom.children[1]['meta']).toEqual({ classes: ['class1'] });
    expect(dom.children[1]['content']['children'][1]['meta']).toEqual({ id: 'foo' });
});