import { BlockNode } from '@dom/productNode';
import { defineProductCore } from '@core/product';

import { editorName, EditorType } from '../shared';
import { EditorParser, EditorStr } from './factory';

export class EditorNode extends BlockNode<EditorType> { name = editorName; }

export const editor = defineProductCore<EditorType>({
    Node: EditorNode,
    Parser: EditorParser,
    Stringifier: EditorStr,
});