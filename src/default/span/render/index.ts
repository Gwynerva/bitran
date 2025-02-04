import { defineProductComponent } from '@render/component';
import { defineIcon } from '@render/icon';
import { defineProductRender, RenderMode } from '@render/product';

export const span = defineProductRender({
    mode: RenderMode.Server,
    component: defineProductComponent(() => import('./Span.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
});