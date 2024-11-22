import { keyable, ObjBlockParseFactory, ObjStrFactory } from '@/core/factory';
import { Editor } from './node';
import { editorName } from '.';

export class EditorParser extends ObjBlockParseFactory<Editor>
{
    objType = editorName;

    async parseObjBlock(obj: keyable)
    {
        if (!obj.src)
            throw new Error(`Missing editor string 'src' property!`);

        const editor = new Editor;
        editor.src = obj.src;
        editor.content.setNodes(await this.parser.parseBlocks(obj.src));

        return editor;
    }
}

export class EditorStr extends ObjStrFactory<Editor>
{
    objType = editorName;

    productToObj(product: Editor): keyable
    {
        return {
            src: product.src
        }
    }
}