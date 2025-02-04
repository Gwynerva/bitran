import type { DefineProductType } from '@';
import type { InlinersNode } from '@default/groups';

export const paragraphName = '_paragraph';

export type ParagraphType = DefineProductType<{ ParseData: InlinersNode }>;