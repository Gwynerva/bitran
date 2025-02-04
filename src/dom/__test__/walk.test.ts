import { Node, GroupNode, assumeGroupItem } from '..';
import { FooNode, TestGroupNode } from './defs';

class RootNode extends GroupNode {}

class ComplexNode extends Node
{
    name = 'complex';

    foo: TestGroupNode;
    bar: TestGroupNode;
    baz: TestGroupNode;

    constructor()
    {
        super();
        this.foo = new TestGroupNode;
        this.bar = new TestGroupNode;
        this.baz = new TestGroupNode;

        this.foo.parent = this.bar.parent = this.baz.parent = this;
    }

    get children()
    {
        return [this.foo, this.bar, this.baz];
    }
}

// root
// └── complex2
//     ├── foo
//     │   └── simpleAlpha
//     └── baz
//         └── complex1
//             ├── foo
//             │   ├── simpleFoo1
//             │   └── simpleFoo2
//             └── bar
//                 ├── simpleBar1
//                 └── simpleBar2
//                 └── simpleBar3

const simpleFoo1 = new FooNode;
const simpleFoo2 = new FooNode;

const simpleBar1 = new FooNode;
const simpleBar2 = new FooNode;
const simpleBar3 = new FooNode;

const complex1 = new ComplexNode;
complex1.foo.setNodes(simpleFoo1, simpleFoo2);
complex1.bar.setNodes(simpleBar1, simpleBar2, simpleBar3);

const simpleAlpha = new FooNode;

const complex2 = new ComplexNode;
complex2.baz.setNodes(complex1);
complex2.foo.setNodes(simpleAlpha);

const root = new RootNode;
root.setNodes(complex2);

//
//
//

describe('Walk down', () => {
    test('Full walk', () => {
        const downNodes: Node[] = [];
        root.walkDown(node => downNodes.push(node));
        expect(downNodes).toEqual([
            complex2,
                complex2.foo,
                    simpleAlpha,
                complex2.bar,
                complex2.baz,
                    complex1,
                        complex1.foo,
                            simpleFoo1,
                            simpleFoo2,
                        complex1.bar,
                            simpleBar1,
                            simpleBar2,
                            simpleBar3,
                        complex1.baz,
        ]);
    });

    test('Partial walk', () => {
        const downNodes: Node[] = [];
        root.walkDown(node => {
            downNodes.push(node);
            if (node === simpleFoo2)
                return false;
        });
        expect(downNodes).toEqual([
            complex2,
                complex2.foo,
                    simpleAlpha,
                complex2.bar,
                complex2.baz,
                    complex1,
                        complex1.foo,
                            simpleFoo1,
                            simpleFoo2,
        ]);
    });
});

describe('Walk up', () => {
    test('Full walk', () => {
        const upNodes: Node[] = [];
        simpleBar1.walkUp(node => upNodes.push(node));
        expect(upNodes).toEqual([complex1.bar, complex1, complex2.baz, complex2, root]);
    });

    test('Partial walk', () => {
        const upNodes: Node[] = [];
        simpleBar1.walkUp(node => {
            upNodes.push(node);
            if (node === complex2.baz)
                return false;
        });
        expect(upNodes).toEqual([complex1.bar, complex1, complex2.baz]);
    });
});

describe('Walk forward', () => {
    test('Full walk', () => {
        const forwardNodes: Node[] = [];
        assumeGroupItem(simpleBar1).walkForward(node => forwardNodes.push(node));
        expect(forwardNodes).toEqual([simpleBar2, simpleBar3]);
    });

    test('Partial walk', () => {
        const forwardNodes: Node[] = [];
        assumeGroupItem(simpleBar1).walkForward(node => {
            forwardNodes.push(node);
            if (node === simpleBar2)
                return false;
        });
        expect(forwardNodes).toEqual([simpleBar2]);
    });
});

describe('Walk backwards', () => {
    test('Full walk', () => {
        const backwardNodes: Node[] = [];
        assumeGroupItem(simpleBar3).walkBackward(node => backwardNodes.push(node));
        expect(backwardNodes).toEqual([simpleBar2, simpleBar1]);
    });

    test('Partial walk', () => {
        const backwardNodes: Node[] = [];
        assumeGroupItem(simpleBar3).walkBackward(node => {
            backwardNodes.push(node);
            if (node === simpleBar2)
                return false;
        });
        expect(backwardNodes).toEqual([simpleBar2]);
    });
});