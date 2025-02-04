import { ProductStrFactory } from '@process/factory';

import { TextType } from '../shared';

export class TextStr extends ProductStrFactory<TextType>
{
    stringifyData(parseData: string)
    {
        return parseData ?? '';
    }
}