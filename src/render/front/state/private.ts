import { InjectionKey } from 'vue';

export interface PrivateState
{
    iconCache: Record<string, null>;
}

export const privateStateKey = Symbol() as InjectionKey<PrivateState>;