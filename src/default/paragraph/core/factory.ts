import { BlockParseFactory, ProductStrFactory } from '@process/factory';
import { InlinersNode } from '@default/groups';

import { ParagraphType } from '../shared';

export class ParagraphParser extends BlockParseFactory<ParagraphType>
{
    canParse()
    {
        return true;
    }

    async createParseData(strBlock: string)
    {
        return await this.parseInliners(strBlock);
    }
}

export class ParagraphStr extends ProductStrFactory<ParagraphType>
{
    stringifyData(data: InlinersNode)
    {
        return this.stringify(data);
    }
}