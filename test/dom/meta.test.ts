import { detachMeta, parseLineMeta, parseMeta, ProductMeta, stringifyMeta } from '@/core/dom/meta';

describe('Line meta', () =>
{
    const cases: [string, string, ProductMeta][] = [
        [
            'Empty line',
            '',
            {}
        ],
        [
            'Id and classes',
            ' #myId .a .b .foo   .bar',
            { id: 'myId', classes: ['a', 'b', 'foo', 'bar'] }
        ],
        [
            'Id, classes and fast props',
            '   #id1 ..foo +bar #id2  -baz ',
            { id: 'id2', classes: ['.foo'], bar: true, baz: false }
        ]
    ];

    test.each(cases)('%s', (label, strMeta, objMeta) => expect(parseLineMeta(strMeta)).toMatchObject(objMeta));
});

describe('Parse meta', () =>
{
    const cases: [string, string, ProductMeta][] = [
        [
            'Empty line',
            '',
            {}
        ],
        [
            'Line meta',
            '   #id1 ..foo +bar #id2  -baz ',
            { id: 'id2', classes: ['.foo'], bar: true, baz: false }
        ],
        [
            'Complex meta',
            'a: b\nfoo: 5\nbar: [1, 2, 3]',
            {a: 'b', foo: 5, bar: [1,2,3]}
        ]
    ];

    test.each(cases)('%s', (label, strMeta, objMeta) => expect(parseMeta(strMeta)).toMatchObject(objMeta));
});

describe('Detach meta', () =>
{
    const cases: [string, string, ReturnType<typeof detachMeta>][] = [
        [
            'Empty line',
            '',
            { restText: '' }
        ],
        [
            'String containing only line meta',
            '{   #id1 ..foo +bar #id2  -baz }',
            { restText: '{   #id1 ..foo +bar #id2  -baz }' }
        ],
        [
            'Line meta',
            '{   #id1 ..foo +bar #id2  -baz }\nRest text',
            { restText: 'Rest text', meta: { id: 'id2', classes: ['.foo'], bar: true, baz: false } }
        ],
        [
            'String containing only complex meta',
            '{\na: b\nfoo: 5\nbar: [1, 2, 3]\n}\n',
            { restText: '{\na: b\nfoo: 5\nbar: [1, 2, 3]\n}\n' }
        ],
        [
            'Complex meta',
            '{\na: b\nfoo: 5\nbar: [1, 2, 3]\n}\nRest text',
            { restText: 'Rest text', meta: {a: 'b', foo: 5, bar: [1,2,3]} }
        ]
    ];

    test.each(cases)('%s', (label, strMeta, objMeta) => expect(detachMeta(strMeta)).toMatchObject(objMeta));
});

describe('Stringify meta', () =>
{
    test('Empty meta', () => {
        const meta: ProductMeta = {};

        expect(stringifyMeta(meta, false)).toBe('');
        expect(stringifyMeta(meta, true)).toBe('');
    });

    test('Complex meta', () => {
        //
        // Complete meta
        //

        const fullMeta: ProductMeta = {
            id: 'myId',
            classes: [
                'class1',
                'class2',
                'class3',
            ],
            good: true,
            bad: false,
            foo: 'fooValue',
            bar: {
                prop: 'val'
            }
        }

        expect(stringifyMeta(fullMeta, true)).toBe(`
{
    id: myId
    classes:
        - class1
        - class2
        - class3
    good: true
    bad: false
    foo: fooValue
    bar:
        prop: val
}
        `.trim());

        //
        // Incomplete meta
        //

        const incompleteMeta: ProductMeta = {
            one: {
                two: {
                    three: {
                        four: 4
                    }
                }
            }
        }

        expect(stringifyMeta(incompleteMeta, true)).toBe(`
{
    one:
        two:
            three:
                four: 4
}
        `.trim());
    });

    test('Line meta', () => {
        //
        // Complete meta
        //

        const fullMeta: ProductMeta = {
            id: 'myId',
            classes: [
                'class1',
                'class2',
                'class3',
            ],
            good: true,
            bad: false,
            foo: 'foo Value',
            bar: {
                prop: 'val'
            }
        }

        expect(stringifyMeta(fullMeta, false)).toBe('{ #myId .class1 .class2 .class3 +good -bad foo=foo }');

        //
        // Incomplete meta
        //

        const incompleteMeta: ProductMeta = {
            one: {
                two: {
                    three: {
                        four: 4
                    }
                }
            },
            foo: 'foo Value',
            good: true,
            num: 3
        }

        expect(stringifyMeta(incompleteMeta, false)).toBe('{ foo=foo +good num=3 }');
    });

    test('Empty line meta when everything is cut', () => {
        const onlyComplexMeta: ProductMeta = {
            one: {
                two: 2
            }
        }

        expect(stringifyMeta(onlyComplexMeta, false)).toBe('');
    });

    test('Prefer line meta when possible instead of making complex meta', () => {
        const meta: ProductMeta = {
            id: 'myId',
            classes: ['foo', 'bar'],
            good: true,
            num: 3
        }

        expect(stringifyMeta(meta, false)).toBe('{ #myId .foo .bar +good num=3 }');
    });

    test('Consistency when parsing stringified meta', () => {
        const complexMeta: ProductMeta = {
            id: 'myId',
            classes: [
                'class1',
                'class2',
                'class3',
            ],
            good: true,
            bad: false,
            foo: 'fooValue',
            bar: {
                prop: 'val'
            }
        }

        expect(parseMeta(stringifyMeta(complexMeta, true).slice(1,-1))).toMatchObject(complexMeta);

        const lineMeta: ProductMeta = {
            id: 'myId',
            classes: [
                'class1',
                'class2',
                'class3',
            ],
            good: true,
            bad: false,
            foo: 'fooValue',
        }

        expect(parseMeta(stringifyMeta(complexMeta, false).slice(1,-1))).toMatchObject(lineMeta);
    });
});