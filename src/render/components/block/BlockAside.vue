<script setup lang="ts">
import { cls } from '@render/class';
import { BlockNode } from '@dom/productNode';
import { ErrorNode } from '@default/error';

import ProductIcon from '../ProductIcon.vue';

defineProps<{ node: BlockNode | ErrorNode }>();
</script>

<template>
    <div :class="cls.blockAside">
        <div :class="cls.blockAsideIcon" v-once>
            <ProductIcon :node="node.name" />
        </div>
    </div>
</template>

<style lang="scss">
@use '$styles/utils' as *;

@mixin asideTheme($bgColor, $iconColor, $force: false)
{
    @if ($force)
    {
        background: $bgColor !important;
        #{_(blockAsideIcon)} { color: $iconColor !important; }
    }
    @else
    {
        background: transparent;
        #{_(blockAsideIcon)} { color: transparent; }

        &:hover { background: $bgColor; }

        #{_(blockContainer)}:hover > #{_(block)} > &
        {
            #{_(blockAsideIcon)} { color: color-mix(in srgb, #{$iconColor} 65%, transparent); }
            &:hover #{_(blockAsideIcon)} { color: $iconColor; }
        }
    }
}

#{_(blockAside)}
{
    $borderRadius: 5px;

    flex-shrink: 0;
    @include transition(background);

    width: var(--_bitran_asideWidth);
    margin-right: var(--_bitran_asideGap);

    border-top-left-radius: $borderRadius;
    border-bottom-left-radius: $borderRadius;

    cursor: pointer;

    #{_(blockAsideIcon)}
    {
        position: sticky;
        top: 0;
        height: 30px;
        width: 100%;

        @include transition(color);

        display: flex;
        justify-content: center;
        align-items: center;

        > svg
        {
            aspect-ratio: 1 / 1;
            width: 68%;
            fill: currentColor;
        }
    }

    @include asideTheme(var(--bitran_bgAccent), var(--bitran_textMuted));

    #{_(block)}#{_(error)} > &
    {
        @include asideTheme(
            color-mix(in srgb, var(--bitran_colorError) 25%, light-dark(white, #212121)),
            color-mix(in srgb, var(--bitran_colorError) 60%, light-dark(black, white)),
            true
        );
    }

    // Outline current id!
    // @include asideTheme(
    //     color-mix(in srgb, var(--bitran_colorBrand) 35%, light-dark(white, black)),
    //     color-mix(in srgb, var(--bitran_colorBrand) 75%, light-dark(black, white)),
    //     true
    // );
}
</style>