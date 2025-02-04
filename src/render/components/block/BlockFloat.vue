<script lang="ts" setup>
import { cls } from '@render/class';
import { ErrorNode } from '@default/error';
import { BlockNode } from '@dom/productNode';

defineProps<{
    node: BlockNode | ErrorNode,
    position: 'above' | 'below'
}>();
</script>

<template>
    <div :class="[cls.blockFloat, cls[`blockFloat--${position}`]]">
    </div>
</template>

<style lang="scss">
#{_(blockFloat)}
{
    --_bitran-floatHeight: var(--bitran_blocksGap);

    position: absolute;
    width: 100%;
    height: var(--_bitran-floatHeight);

    &--above
    {
        top: calc(-1 * var(--_bitran-floatHeight));
    }

    &--below
    {
        bottom: calc(-1 * var(--_bitran-floatHeight));
    }

    #{_(container)}:not(#{_(editMode)}) #{_(blockContainer)}:first-child > &--above,
    #{_(container)}:not(#{_(editMode)}) #{_(blockContainer)}:last-child > &--below
    {
        display: none;
    }
}
</style>