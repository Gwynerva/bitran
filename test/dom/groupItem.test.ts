import { GroupNode } from "@/core/dom/group";
import { assumeGroupItem, GroupItem } from "@/core/dom/groupItem";
import { FooNode } from "./FooNode";

//
//
//

test('GroupItem creation', () => {
    const foo1 = new FooNode;
    const group = new GroupNode;

    expect(() => assumeGroupItem(foo1)).toThrow();

    group.setNodes(foo1);

    expect(assumeGroupItem(foo1)).toBeInstanceOf(GroupItem);
});

test('Detach', () => {
    const foo1 = new FooNode;
    const foo2 = new FooNode;
    const foo3 = new FooNode;
    const group = new GroupNode;

    group.setNodes(foo1, foo2, foo3);

    assumeGroupItem(foo2).detach();

    expect(group.children).toEqual([foo1, foo3]);
});

test('Previous & Next', () => {
    const foo1 = new FooNode;
    const foo2 = new FooNode;
    const foo3 = new FooNode;
    const group = new GroupNode;

    group.setNodes(foo1, foo2, foo3);

    expect(assumeGroupItem(foo1).previous()).toBeUndefined();
    expect(assumeGroupItem(foo2).previous()).toBe(foo1);
    expect(assumeGroupItem(foo2).next()).toBe(foo3);
    expect(assumeGroupItem(foo3).next()).toBeUndefined();
});