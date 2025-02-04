<script lang="ts" setup>
import { computed, inject } from 'vue';

import { BlockNode } from '@dom/productNode';
import { globalStateKey, prepareProduct, useProduct } from '@render/front';
import { cls } from '@render/class';
import { ErrorNode } from '@default/error';

import BlockFloat from './BlockFloat.vue';
import BlockAside from './BlockAside.vue';

const props = defineProps<{ node: BlockNode | ErrorNode }>();
const globalState = inject(globalStateKey);

const { productRender } = useProduct(props.node.name);
const { VNode: BlockVNode, prepareError: error } = await prepareProduct(props.node);

const id = computed(() => {
    if (props.node instanceof ErrorNode)
        return null;

    return (globalState.scope ? globalState.scope  + ':' : '') + props.node.getId();
});
</script>

<template>
    <div :id :class="cls.blockContainer">

        <BlockFloat v-bind="{ node, position: 'above' }" />

        <BlockVNode v-if="productRender.customLayout && !error" />
        <div v-else :class="[cls.block, !!error && cls.error]">
            <BlockAside v-bind="{ node }" />
            <div :class="cls.blockMain">
                <div v-if="error">{{ error }}</div>
                <BlockVNode v-else />
            </div>
        </div>

        <BlockFloat v-bind="{ node, position: 'below' }" />

    </div>
</template>

<style lang="scss">
#{_(blockContainer)}
{
    position: relative;

    &:hover { z-index: 10; }

    #{_(block)}
    {
        display: flex;

        #{_(blockMain)}
        {
            min-width: 0;
            flex: 1;
        }

        &#{_(error)} #{_(blockMain)}
        {
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
            background: color-mix(in srgb, var(--bitran_colorError) 25%, light-dark(white, #212121));
            color: color-mix(in srgb, var(--bitran_colorError) 60%, light-dark(black, white));
        }
    }

    // Space for first and last BlockFloat's in edit mode
    #{_(container)}#{_(editMode)} &:first-child { margin-top: var(--bitran_blocksGap); }
    #{_(container)}#{_(editMode)} &:last-child  { margin-bottom: var(--bitran_blocksGap); }
}
</style>