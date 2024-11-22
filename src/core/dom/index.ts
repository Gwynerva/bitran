import { Node } from "./node";

type InstanceTypeOf<T> = T extends new () => infer I ? I : never;

export class DOM<TNodeTypes extends Record<string, new () => Node> = any>
{
    private readonly types: TNodeTypes = {} as TNodeTypes;

    constructor(nodeTypes: TNodeTypes)
    {
        for (const [nodeName, NodePrototype] of Object.entries(nodeTypes) as Array<[keyof TNodeTypes, TNodeTypes[string]]>)
            this.types[nodeName] = NodePrototype;
    }

    create<K extends Extract<keyof TNodeTypes, string>>(nodeName: K)
    {
        const newNode = new this.types[nodeName]();
        newNode.name = nodeName;

        return newNode as InstanceTypeOf<TNodeTypes[K]>;
    }
}