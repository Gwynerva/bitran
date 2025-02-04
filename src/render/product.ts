import type { Component } from 'vue';
import type { Languages } from './language';

export enum RenderMode
{
    Client = 1,
    Hybrid,
    Server,
}

export interface ProductRender
{
    mode: RenderMode;
    component: () => Promise<Component>;
    icon?: () => Promise<string>;
    languages?: Languages;
    customLayout?: boolean;
}

export function defineProductRender(render: ProductRender)
{
    return render;
}