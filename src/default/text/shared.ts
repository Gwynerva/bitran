import type { DefineProductType } from '@';

export const textName = '_text';

export type TextType = DefineProductType<{ ParseData: string }>;