import { indent, splitFirstLine, textToObj, textToStrBlocks, tryParseInt } from "@/util/str";

describe('Split text into raw blocks', () =>
{
    type TestSet = { name: string, input: string, out: string[] }[];

    const testSet: TestSet = [
        {
            name: 'Empty string',
            input:  '',
            out:    []
        },
        {
            name:   'Simple string',
            input:  'Hello world!',
            out:    ['Hello world!']
        },
        {
            name:   'One block with multiple lines',
            input:  'My first line\nMy second line',
            out:    ['My first line\nMy second line']
        },
        {
            name:   'Complex string with line breaks and string objects',
            input:  '\n\n   \n \nHello World!\n\n@objBlock\n    property1\n\n    property2\n\n  \n\n   \nLast line\n   \n\n  ',
            out: [
                'Hello World!',
                '@objBlock\n    property1\n\n    property2',
                'Last line',
            ]
        }
    ];

    for (const setItem of testSet)
    {
        test(setItem.name, () => expect(textToStrBlocks(setItem.input)).toMatchObject(setItem.out));
    }
});

describe('Yaml parse str to obj', () =>
{
    test('Empty line', () => expect(textToObj('')).toMatchObject({}));
    test('Not an object', () => expect(textToObj('[5, 3, 2]')).toMatchObject({}));
    test('Literal object', () => expect(textToObj('a: b\nfoo: 5\nbar: [1, 2, 3]')).toMatchObject({a: 'b', foo: 5, bar: [1,2,3]}));
});

describe('Split by first line', () =>
{
    const cases: [string, string, ReturnType<typeof splitFirstLine>][] = [
        [
            'Empty line',
            '',
            { firstLine: '', restText: '' }
        ],
        [
            'One line',
            'My first line!',
            { firstLine: 'My first line!', restText: '' }
        ],
        [
            'Empty first line',
            '\n\nMy third line!',
            { firstLine: '', restText: '\nMy third line!'}
        ],
        [
            'Many lines',
            'a\n\nb\nc',
            { firstLine: 'a', restText: '\nb\nc'}
        ]
    ];

    test.each(cases)('%s', (testName, text, result) => expect(splitFirstLine(text)).toMatchObject(result));
});

describe('Indent', () => {
    test('Single line', () => {
        expect(indent('')).toBe('');
        expect(indent('Line')).toBe('    Line');
    });

    test('Multiple lines', () => {
        expect(indent('First line\nSecond line\nThird line')).toBe('    First line\n    Second line\n    Third line');
    });

    test('Text with empty lines and space symbols', () => {
        expect(indent('\n   \n\nFirst line\n  \n\nSecond line\nThird line\n')).toBe('\n   \n\n    First line\n  \n\n    Second line\n    Third line\n');
    });

    test('Different indent sizes', () => {
        expect(indent('a', 0)).toBe('a');
        expect(indent('a', 1)).toBe(' a');
        expect(indent('a', 5)).toBe('     a');
    });
});

describe('Try Parse Int', () => {
    test('Empty text', () => {
        expect(tryParseInt('')).toBe('');
    });

    test('Stay string', () => {
        expect(tryParseInt('')).toBe('');
        expect(tryParseInt('test')).toBe('test');
    });

    test('Convert to number', () => {
        expect(tryParseInt('0')).toBe(0);
        expect(tryParseInt('123')).toBe(123);
        expect(tryParseInt('-123')).toBe(-123);
    });
});