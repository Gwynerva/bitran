import { defineProductComponent } from '@render/component';
import { defineIcon } from '@render/icon';
import { defineLanguages } from '@render/language';
import { defineProductRender, RenderMode } from '@render/product';

export const paragraph = defineProductRender({
    mode: RenderMode.Server,
    component: defineProductComponent(() => import('./Paragraph.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
});