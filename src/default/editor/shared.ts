import type { DefineProductType } from '@';
import type { BlocksNode } from '@default/groups';

export const editorName = '_editor';

export type EditorType = DefineProductType<{
    ParseData: {
        src: string;
        content: BlocksNode;
    }
}>;