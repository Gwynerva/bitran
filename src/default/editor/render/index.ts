import { defineProductComponent } from '@render/component';
import { defineIcon } from '@render/icon';
import { defineProductRender, RenderMode } from '@render/product';

export const editor = defineProductRender({
    mode: RenderMode.Client,
    component: defineProductComponent(() => import('./Editor.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
    customLayout: true,
});