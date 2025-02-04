import { defineProductRender, RenderMode } from '@render/product';
import { defineIcon } from '@render/icon';
import { defineLanguages } from '@render/language';
import { defineProductComponent } from '@render/component';

export const text = defineProductRender({
    mode: RenderMode.Server,
    component: defineProductComponent(() => import('./Text.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
    }),
});