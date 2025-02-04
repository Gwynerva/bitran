import { InjectionKey } from 'vue';

import type { BitranContent } from '@';
import type { BitranCore } from '@core/index';
import type { BitranRenderConfig } from '@render/index';

export interface GlobalState
{
    scope: string;
    bitranCore: BitranCore;
    bitranRender: BitranRenderConfig;
    content: BitranContent;
    language?: string;
    editMode?: boolean;
}

export const globalStateKey = Symbol() as InjectionKey<GlobalState>;