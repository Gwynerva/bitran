import { defineProductCore } from '@core/product';
import { InlinerNode } from '@dom/productNode';

import { TextStr } from './factory';
import { textName, TextType } from '../shared';

export class TextNode extends InlinerNode<TextType> { name = textName; }

export const text = defineProductCore<TextType>({
    Node: TextNode,
    Parser: null,
    Stringifier: TextStr,
});