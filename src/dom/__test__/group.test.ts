import { FooNode, TestGroupNode } from './defs';

describe('Low level oprations', () => {
    {
        const foo1 = new FooNode;
        const foo2 = new FooNode;
        const foo3 = new FooNode;

        const group = new TestGroupNode;
        group.setNodes(foo1, foo2, foo3);

        test('__insertAt', () => {
            group.__insertAt(0, foo1);
            expect(group.children[0]).toBe(foo1);
            expect(group.children[0].parent).toBe(group);

            group.__insertAt(0, foo2);
            expect(group.children[0]).toBe(foo2);
            expect(group.children[0].parent).toBe(group);

            group.__insertAt(3, foo3);
            expect(group.children[2]).toBe(foo3);
            expect(group.children[2].parent).toBe(group);
        });

        test('__locate', () => {
            expect(group.__locate(foo2)).toEqual(0);
            expect(() => group.__locate(new FooNode)).toThrow();
        });

        test('__swap', () => {
            group.__swap(0, 2);
            expect(group.children).toEqual([foo3, foo1, foo2]);

            group.__swap(1, 2);
            expect(group.children).toEqual([foo3, foo2, foo1]);
        });

        test('__detachAt', () => {
            group.__detachAt(1);
            expect(group.children).toEqual([foo3, foo1]);
        });
    }

    test('__move', () => {
        const foo1 = new FooNode;
        const foo2 = new FooNode;
        const foo3 = new FooNode;

        const group = new TestGroupNode;
        group.setNodes(foo1, foo2, foo3);

        group.__move(0, 0);
        group.__move(0, 0);
        group.__move(1, 1);
        group.__move(2, 2);
        expect(group.children).toEqual([foo1, foo2, foo3]);

        group.__move(0, 1);
        expect(group.children).toEqual([foo2, foo1, foo3]);

        group.__move(1, 2);
        expect(group.children).toEqual([foo2, foo3, foo1]);

        group.__move(2, 0);
        expect(group.children).toEqual([foo1, foo2, foo3]);

        group.__move(2, 1);
        expect(group.children).toEqual([foo1, foo3, foo2]);
    });
});

//
//
//

describe('Operations', () => {
    test('Detach', () => {
        const foo1 = new FooNode;
        const foo2 = new FooNode;
        const foo3 = new FooNode;

        const group = new TestGroupNode;

        group.__insertAt(0, foo1, foo2, foo3);
        group.detach(foo2);

        expect(group.children).toEqual([foo1, foo3]);
    });

    test('Clear', () => {
        const foo1 = new FooNode;
        const foo2 = new FooNode;
        const foo3 = new FooNode;

        const group = new TestGroupNode;

        group.__insertAt(0, foo1, foo2, foo3);
        group.clear();

        expect(group.children).toEqual([]);
        expect([foo1.parent, foo2.parent, foo3.parent]).toEqual([undefined, undefined, undefined]);
    });

    test('Set nodes (+ same nodes in multiple groups)', () => {
        const foo1 = new FooNode;
        const foo2 = new FooNode;
        const foo3 = new FooNode;

        const group1 = new TestGroupNode;
        const group2 = new TestGroupNode;

        group1.setNodes(foo1, foo2, foo3);
        group2.setNodes([foo1, foo2, foo3]);

        expect(group1.children.length).toEqual(0);
        expect(group2.children.length).toEqual(3);

        expect(group2.children[1]).toBe(foo2);
        expect(group2.children[1].parent).toBe(group2);

        const groupSingleNode = new TestGroupNode;
        groupSingleNode.setNodes(foo1);

        expect(group2.children.length).toEqual(2);
        expect(groupSingleNode.children[0]).toBe(foo1);
    });

    test('Swap', () => {
        const foo1 = new FooNode;
        const foo2 = new FooNode;
        const foo3 = new FooNode;

        const group = new TestGroupNode;

        group.setNodes(foo1, foo2, foo3);
        group.swap(foo1, foo3);

        expect(group.children).toEqual([foo3, foo2, foo1]);
    });

    test('Move', () => {
        const foo1 = new FooNode;
        const foo2 = new FooNode;
        const foo3 = new FooNode;

        const group = new TestGroupNode;

        const resetOrder = () => group.setNodes(foo1, foo2, foo3);

        // Testing moving to same place

        resetOrder();

        group.move(foo1, foo1);
        group.move(foo1, foo1, true);
        group.move(foo2, foo2, true);
        expect(group.children).toEqual([foo1, foo2, foo3]);

        // Testing default move mode: "after"

            // Moving backward

            resetOrder();

            group.move(foo2, foo1);
            group.move(foo3, foo2);
            expect(group.children).toEqual([foo1, foo2, foo3]);

            group.move(foo3, foo1);
            expect(group.children).toEqual([foo1, foo3, foo2]);

            // Moving forward

            resetOrder();

            group.move(foo1, foo2);
            expect(group.children).toEqual([foo2, foo1, foo3]);

            group.move(foo2, foo3);
            expect(group.children).toEqual([foo1, foo3, foo2]);

        // Testing "before" move mode:

            // Moving backward

            resetOrder();

            group.move(foo2, foo1, true);
            expect(group.children).toEqual([foo2, foo1, foo3]);

            group.move(foo3, foo2, true);
            expect(group.children).toEqual([foo3, foo2, foo1]);

            // Moving forward

            resetOrder();

            group.move(foo1, foo2, true);
            group.move(foo2, foo3, true);
            expect(group.children).toEqual([foo1, foo2, foo3]);

            group.move(foo1, foo3, true);
            expect(group.children).toEqual([foo2, foo1, foo3]);
    });

    test('Prepend & Append', () => {
        const foo1 = new FooNode;
        const foo2 = new FooNode;
        const foo3 = new FooNode;
        const foo4 = new FooNode;
        const foo5 = new FooNode;
        const foo6 = new FooNode;

        const refNode = new FooNode;
        const group = new TestGroupNode;

        group.setNodes(refNode);
        group.prepend(foo1, foo2, foo3);
        group.append(foo4, foo5, foo6);

        expect(group.children).toEqual([foo1, foo2, foo3, refNode, foo4, foo5, foo6]);
    });

    test('Before & After', () => {
        const foo1 = new FooNode;
        const foo2 = new FooNode;
        const foo3 = new FooNode;
        const foo4 = new FooNode;
        const foo5 = new FooNode;
        const foo6 = new FooNode;

        const refNode = new FooNode;
        const group = new TestGroupNode;

        group.setNodes(refNode);
        group.before(refNode, foo1, foo2, foo3);
        group.append(refNode, foo4, foo5, foo6);

        expect(group.children).toEqual([foo1, foo2, foo3, refNode, foo4, foo5, foo6]);
    });

    test('Replace', () => {
        const foo1 = new FooNode;
        const foo2 = new FooNode;
        const foo3 = new FooNode;
        const foo4 = new FooNode;
        const foo5 = new FooNode;

        const group = new TestGroupNode;
        group.setNodes(foo1, foo2, foo3);

        group.replace(foo2, foo4, foo5);

        expect(group.children).toEqual([foo1, foo4, foo5, foo3]);
    });
});