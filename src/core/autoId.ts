import { Node } from './dom/node';

export abstract class AutoId
{
    /**
     * Generates an auto ID for the given node.
     *
     * @param node The node to generate auto ID for.
     * @param alter Function that allows to modify generated auto ID.
     */
    abstract generate(node: Node, alter?: (autoId: string) => string): string;
}

export class DefaultAutoId extends AutoId
{
    ids: Record<string, null> = {};
    nameCounters: Record<string, number> = {};

    generate(node: Node, alter?: (autoId: string) => string)
    {
        // Get rid of # in the beginning of technical nodes (paragraph, text, span, editor, ...)
        const name = node.name.substring(node.name.startsWith('#') ? 1 : 0);

        return 'шуе';
    }
}


// export type AutoIdGenerator = () => {
//     generate: (
//         /** The node to generate auto ID for. */
//         node: Node,
//         /** Function that allows to modify generated auto ID. */
//         alter: (autoId: string) => string,
//     ) => string;
// };

// export const defaultAutoId: AutoIdGenerator = () =>
// {
//     const ids: Record<string, null> = {};
//     const nameCounters: Record<string, number> = {};

//     const generate = (node: Node, alter?: (autoId: string) => string) =>
//     {
//         // try to slugify meta `autoIdTitle` property and fallback to numbers
//         return 'abobe'
//     }

//     return {
//         generate,
//     }
// }