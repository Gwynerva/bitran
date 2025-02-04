import { useGlobalState } from './state';

export function usePrettyText()
{
    return useGlobalState().bitranRender.formatText;
}