import { defineAsyncComponent, type Component } from 'vue';

export function defineProductComponent(componentLoader: () => Promise<{ default: Component }>)
{
    return async () => defineAsyncComponent(componentLoader);
}