<script lang="ts" setup>
import { h, inject, onUnmounted } from 'vue';

import { ProductNode } from '@dom/productNode';
import { privateStateKey } from '@render/front/state/private';
import { useIcon } from '@render/front/use/icon';

const props = defineProps<{ node: ProductNode | string; }>();
const privateState = inject(privateStateKey);

const nodeName = typeof props.node === 'string' ? props.node : props.node.name;
const firstOfType = !(nodeName in privateState.iconCache);

const Icon = await (async () => {
    if (firstOfType)
    {
        privateState.iconCache[nodeName] = null;
        const svg = await useIcon(props.node);
        return h('svg', { ...parseSvg(svg), id: `bitran-product-icon:${nodeName}` });
    }

    return h('svg', { innerHTML: `<use href="#bitran-product-icon:${nodeName}" />` });
})();

onUnmounted(() => {
    if (firstOfType)
        delete privateState.iconCache[nodeName];
});

function parseSvg(svg: string)
{
    svg = svg.slice(0, -6); // Remove </svg>

    const svgOpenMatch = svg.match(/<svg(?=\s)(?!(?:[^>"\']|"[^"]*"|\'[^\']*\')*?(?<=\s)(?:term|range)\s*=)(?!\s*\/?>)\s+(?:".*?"|\'.*?\'|[^>]*?)+>/m);
    svg = svg.slice(svgOpenMatch[0].length); // Remove opening <svg ...>

    const attributes = {};
    svgOpenMatch[0].replaceAll(/ (.+?)="(.+?)"/gm, (match, attribute, value) => {
        attributes[attribute] = value;
        return '';
    });

    return {
        ...attributes,
        innerHTML: svg,
    }
}
</script>

<template>
    <Icon />
</template>