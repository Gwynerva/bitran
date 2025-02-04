import { keyable, ObjBlockParseFactory, ObjProductStrFactory } from '@process/factory';
import { editorName, EditorType } from '../shared';

export class EditorParser extends ObjBlockParseFactory<EditorType>
{
    objName = editorName;

    async parseDataFromObj(obj: keyable)
    {
        if (!obj.src)
            throw new Error(`Missing editor string 'src' property!`);

        return {
            src: obj.src,
            content: await this.parseBlocks(obj.src),
        };
    }
}

export class EditorStr extends ObjProductStrFactory<EditorType>
{
    objName = editorName;

    createObj(data: EditorType['ParseData'])
    {
        return { src: data.src };
    }
}