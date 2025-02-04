import { inject } from 'vue';

import { globalStateKey } from '@render/front/state/global';
import { privateStateKey } from '@render/front/state/private';

export function useGlobalState()
{
    return inject(globalStateKey);
}

export function usePrivateState()
{
    return inject(privateStateKey);
}